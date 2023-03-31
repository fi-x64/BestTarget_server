vnPayParams = {
    vnp_TmnCode: "21B72BKW", //Mã website tại VNPAY 
    vnp_HashSecret: "CDGANRJGEBVNHGDTINIMROEJSJTIRAPD", //Chuỗi bí mật
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://127.0.0.1:5173/paymentResult",
}

module.exports = vnPayParams;