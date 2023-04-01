const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const moment = require('moment');
const sortObject = require('../utils/sortObject');
const querystring = require('qs');
const crypto = require("crypto");
const https = require('https');
const ViTien = require('../models/viTienModel');
const HoaDon = require('../models/hoaDonModel');

exports.thanhToanMomo = (req, response, next) => {
    if (req.query.soTien && req.query.userId) {
        const soTien = parseInt(req.query.soTien);
        const userId = req.query.userId;

        var accessKey = process.env.momo_accessKey;
        var secretKey = process.env.momo_secretKey;
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'http://127.0.0.1:5173/paymentResult';
        var ipnUrl = 'http://127.0.0.1:5173/paymentResult';
        var requestType = "payWithMethod";
        var amount = soTien;
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData = '';
        var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';

        //before sign HMAC SHA256 with format
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        console.log("Check rawSignature: ", rawSignature);

        //puts raw signature
        //signature
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });

        //Create the HTTPS objects
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        var result;
        //Send the request and get the response
        req = https.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', (body) => {
                result = JSON.parse(body)
            });
            res.on('end', async () => {
                // console.log('No more data in response.');
                if (result.resultCode == 0) {
                    const hoaDon = new HoaDon({
                        nguoiDungId: userId,
                        soTien: amount,
                        donViThanhToan: partnerCode,
                        donDatId: orderId,
                    })

                    const newHoaDon = await hoaDon.save();

                    if (newHoaDon) {
                        response.status(200).json({
                            status: 'success',
                            data: result
                        });
                    }
                }
            });
        })

        req.on('error', (e) => {
            console.log(`problem with request: data.values.{e.message}`);
        });
        // write data to request body
        console.log("Sending....")
        req.write(requestBody);
        req.end();
    } else res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
};

exports.thanhToanVNPay = (req, res, next) => {
    const soTien = req.body.soTien;
    if (soTien) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var tmnCode = process.env.vnp_TmnCode;
        var secretKey = process.env.vnp_HashSecret;
        var vnpUrl = process.env.vnp_Url;
        var returnUrl = process.env.vnp_ReturnUrl;

        var createDate = moment().format('YYYYMMDDHHmmss')
        var orderId = moment().format('HHmmss')
        let amount = soTien * 100;
        var bankCode = '';

        var orderInfo = "pay with vnpay";
        var orderType = "billpayment";
        var locale = "vn";
        if (locale === null || locale === "") {
            locale = "vn";
        }

        var currCode = "VND";
        var vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = orderType;
        vnp_Params["vnp_Amount"] = amount;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({
            status: 'success',
            data: vnpUrl
        });
    } else res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
}

exports.saveMomoPayment = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (data.userId && data.values) {
        const soTien = parseInt(data.values.amount);

        const hoaDonData = await HoaDon.findOne({
            nguoiDungId: data.userId, soTien: soTien,
            donViThanhToan: data.values.partnerCode, donDatId: data.values.orderId
        })

        if (hoaDonData && !hoaDonData.ketQuaThanhToan && data.values.resultCode == 0) {
            hoaDonData.ketQuaThanhToan = true;
            hoaDonData.phuongThucThanhToan = data.values.payType;
            const newHoaDon = await hoaDonData.save();

            const viTienData = await ViTien.findOne({ nguoiDungId: data.userId });

            if (newHoaDon) {
                var newViTienData;
                if (!viTienData) {
                    const newViTien = new ViTien({
                        nguoiDungId: data.userId,
                        tongSoDu: soTien
                    })
                    newViTienData = await newViTien.save();
                } else if (viTienData) {
                    viTienData.tongSoDu = viTienData.tongSoDu + soTien;
                    newViTienData = await viTienData.save();
                }
            }
            if (newViTienData) {
                res.status(200).json({
                    status: 'success',
                    message: 'Thanh toán thành cộng, đã cộng coin vào tài khoản của bạn'
                });
                return;
            }
        }
    }
    res.status(200).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi thanh toán, hãy thử lại hoặc liên hệ trợ giúp'
    });
})

exports.saveVNPayPayment = catchAsync(async (req, res, next) => {
    const userId = req.body.userId;
    var vnp_Params = req.body.values;

    if (userId && vnp_Params) {
        const soTien = parseInt(vnp_Params.vnp_Amount) / 100;

        var secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = process.env.vnp_TmnCode;
        var secretKey = process.env.vnp_HashSecret;

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const hoaDonData = await HoaDon.findOne({
                nguoiDungId: userId,
                donViThanhToan: 'VNPay',
                donDatId: vnp_Params.vnp_TransactionNo,
                ketQuaThanhToan: true,
            })
            console.log("Check hoaDonData: ", hoaDonData);
            if (!hoaDonData) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                const hoaDon = new HoaDon({
                    nguoiDungId: userId,
                    donViThanhToan: 'VNPay',
                    phuongThucThanhToan: vnp_Params.vnp_CardType,
                    ketQuaThanhToan: true,
                    soTien: soTien,
                    donDatId: vnp_Params.vnp_TransactionNo
                })

                const newHoaDon = await hoaDon.save();

                if (newHoaDon) {
                    const viTienData = await ViTien.findOne({ nguoiDungId: userId });
                    var newViTienData;
                    if (!viTienData) {
                        const newViTien = new ViTien({
                            nguoiDungId: userId,
                            tongSoDu: soTien
                        })
                        newViTienData = await newViTien.save();
                    } else if (viTienData) {
                        viTienData.tongSoDu = viTienData.tongSoDu + soTien;
                        newViTienData = await viTienData.save();
                    }
                }
                if (newViTienData) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Thanh toán thành cộng, đã cộng coin vào tài khoản của bạn'
                    });
                    return;
                }
            }
        }
    }
    res.status(200).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi thanh toán, hãy thử lại hoặc liên hệ trợ giúp'
    });
})

exports.getViTien = catchAsync(async (req, res, next) => {
    const userId = req.query.userId;

    const viTien = await ViTien.findOne({ nguoiDungId: userId });

    if (!viTien) {
        viTien.tongSoDu = 0;
    }

    res.status(200).json({
        status: 'success',
        data: viTien
    });
});