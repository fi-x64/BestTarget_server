const TinDang = require('../models/tinDangModel');
const GoiY = require('../models/goiYModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { propfind } = require('../routes/tinDangRoutes');
const cloudinary = require('cloudinary');
const moment = require('moment');
const mongoose = require('mongoose');

// exports.getAllDanhMuc = factory.getAll(DanhMuc);
exports.getAllPosts = catchAsync(async (req, res, next) => {
    const features = await TinDang.find().populate('nguoiDungId');

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: features,
        data: features
    });
});

exports.getAllPostsNewest = catchAsync(async (req, res, next) => {
    const amount = parseInt(req.query.amount);

    if (amount <= 50) {
        // const data = await TinDang.find().limit(amount).sort({ thoiGianPush: 'desc' });

        const data = await TinDang.aggregate([
            {
                $match: {
                    trangThaiTin: 'Đang hiển thị'
                }
            },
            {
                $lookup: {
                    from: 'tinhtps',
                    localField: 'diaChiTinDang.tinhTPCode',
                    foreignField: '_id',
                    as: 'tinhThanhPho'
                }
            },
            {
                $sort: {
                    thoiGianPush: -1
                }
            },
            {
                $limit: amount
            },
        ])

        // SEND RESPONSE
        return res.status(200).json({
            status: 'success',
            data: data
        });
    }
    res.status(200).json({
        status: 'error',
        message: 'Exceed limit'
    });

});

exports.getAllTinDangByUserId = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.query.userId);
    const postId = mongoose.Types.ObjectId(req.query.postId);

    const tinDang = await TinDang.aggregate([
        {
            $match: {
                _id: { $ne: postId },
                nguoiDungId: userId,
                trangThaiTin: 'Đang hiển thị'
            }
        },
        {
            $lookup: {
                from: 'tinhtps',
                localField: 'diaChiTinDang.tinhTPCode',
                foreignField: '_id',
                as: 'tinhThanhPho'
            }
        },
        {
            $sort: {
                thoiGianPush: -1
            }
        },
        {
            $limit: 20
        },
    ])

    // const tinDang = await TinDang.find({ nguoiDungId: userId, trangThaiTin: 'Đang hiển thị' }).populate('nguoiDungId').sort({ thoiGianPush: 'desc' }).limit(20);

    res.status(200).json({
        status: 'success',
        data: tinDang
    });
});

exports.getAllTinDangRelated = catchAsync(async (req, res, next) => {
    const values = req.body;

    if (values) {
        values.postId = mongoose.Types.ObjectId(values.postId);
        const regexList = values.tieuDe.split(' ').map((word) => new RegExp(word, 'i'));
        var result;

        if (values?.hangSX) {
            const tinDang = await TinDang.aggregate([
                {
                    $match: {
                        $and: [
                            { "_id": { $ne: values.postId } },
                            { "trangThaiTin": "Đang hiển thị" },
                            { "diaChiTinDang.tinhTPCode": values.tinhTPCode }
                        ]
                    }
                },
                {
                    $facet: {
                        byTitle: [
                            {
                                $match: {
                                    "tieuDe": { $in: regexList },
                                }
                            },
                            {
                                $sort: {
                                    thoiGianPush: -1
                                }
                            },
                            {
                                $lookup: {
                                    from: 'tinhtps',
                                    localField: 'diaChiTinDang.tinhTPCode',
                                    foreignField: '_id',
                                    as: 'tinhThanhPho'
                                }
                            },
                            {
                                $limit: 20
                            }
                        ],
                        byBrand: [
                            {
                                $match: {
                                    "hangSX": values.hangSX
                                }
                            },
                            {
                                $sort: {
                                    thoiGianPush: -1
                                }
                            },
                            {
                                $lookup: {
                                    from: 'tinhtps',
                                    localField: 'diaChiTinDang.tinhTPCode',
                                    foreignField: '_id',
                                    as: 'tinhThanhPho'
                                }
                            },
                            {
                                $limit: 20
                            }
                        ]
                    }
                }
            ]);

            if (tinDang) {
                if (tinDang[0].byTitle.length < 20) {
                    if (tinDang[0].byBrand < (20 - tinDang[0].byTitle.length - 1))
                        result = tinDang[0].byTitle.concat(tinDang[0].byBrand)
                    else {
                        result = tinDang[0].byTitle.concat(tinDang[0].byBrand.slice(0, 20 - tinDang[0].byTitle.length - 1))

                    }
                } else {
                    result = tinDang[0].byTitile
                }
            }
        } else {
            result = await TinDang.aggregate([
                {
                    $match: {
                        $and: [
                            { "_id": { $ne: values.postId } },
                            { "trangThaiTin": "Đang hiển thị" },
                            { "diaChiTinDang.tinhTPCode": values.tinhTPCode }
                        ]
                    }
                },
                {
                    $match: {
                        "tieuDe": { $in: regexList },
                    }
                },
                {
                    $sort: {
                        thoiGianPush: -1
                    }
                },
                {
                    $lookup: {
                        from: 'tinhtps',
                        localField: 'diaChiTinDang.tinhTPCode',
                        foreignField: '_id',
                        as: 'tinhThanhPho'
                    }
                },
                {
                    $limit: 20
                }
            ]);
        }
    }

    res.status(200).json({
        status: 'success',
        data: result
    });
});


exports.getTinDangByValue = catchAsync(async (req, res, next) => {
    const values = req.body;

    const query = {
        $and: []
    };

    query.$and.push({ trangThaiTin: 'Đang hiển thị' })

    if (values.danhMucPhuId) {
        query.$and.push({ danhMucPhuId: parseInt(values.danhMucPhuId) });
    }

    if (values.keyWord) {
        query.$or = [
            { "tieuDe": { $regex: '.*' + values.keyWord + '.*', $options: 'i' } },
            { "moTa": { $regex: '.*' + values.keyWord + '.*', $options: 'i' } }
        ];
    }

    if (values.tinhTPCode) {
        query.$and.push({ 'diaChiTinDang.tinhTPCode': parseInt(values.tinhTPCode) });
    }

    if (values.quanHuyenCode) {
        query.$and.push({ 'diaChiTinDang.quanHuyenCode': parseInt(values.quanHuyenCode) });
    }

    if (values.hangSX) {
        query.$and.push({ 'hangSX': parseInt(values.hangSX) });
    }

    if (values.giaMin && values.giaMax) {
        const giaMin = parseInt(values.giaMin);
        const giaMax = parseInt(values.giaMax);
        if (giaMax < 30000001)
            query.$and.push({ gia: { $gte: giaMin, $lte: giaMax } });
        else
            query.$and.push({ gia: { $gte: giaMin } });
    }

    var data;
    if (values.sapXep === 'lowPricePriority') {
        data = await TinDang.find(query).sort({ gia: 'asc' });
    } else data = await TinDang.find(query).sort({ thoiGianPush: 'desc' });

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.createTinDang = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data

    const tinDang = await TinDang.create(req.body);
    res.status(200).json({
        status: 'success',
        data: tinDang
    });
});

exports.editTinDang = catchAsync(async (req, res, next) => {
    const updatedTinDang = await TinDang.findByIdAndUpdate(req.query.postId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: updatedTinDang
    });
});

exports.getGoiY = catchAsync(async (req, res, next) => {
    const goiY = await GoiY.findOne({ danhMucPhuId: parseInt(req.query.danhMucPhuId) });

    res.status(200).json({
        status: 'success',
        data: goiY
    });
});

exports.countTrangThaiTin = catchAsync(async (req, res, next) => {
    const userId = req.query.userId;

    if (userId) {
        const data = await TinDang.aggregate([
            {
                $match: {
                    nguoiDungId: mongoose.Types.ObjectId(userId),
                    xoaMem: false
                },
            },
            {
                $group: {
                    _id: '$trangThaiTin',
                    soLuong: { $sum: 1 },
                }
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.getTinDang = catchAsync(async (req, res, next) => {
    const userId = req.body.userId;
    const key = parseInt(req.body.phanLoai);

    var data;

    if (key === 1)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Đang hiển thị" });
    else if (key === 2)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Hết hạn" });
    else if (key === 3)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Bị từ chối" });
    else if (key === 4)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Đang đợi duyệt" });
    else if (key === 5)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Đã ẩn" });
    else if (key === 6)
        data = await TinDang.find({ nguoiDungId: userId, trangThaiTin: "Đã bán" });

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getTinDangId = catchAsync(async (req, res, next) => {
    const tinDang = await TinDang.findOne({ _id: req.query.id, trangThaiTin: 'Đang hiển thị' }).populate('nguoiDungId');

    res.status(200).json({
        status: 'success',
        data: tinDang
    });
});

exports.getTinDangIdRestrict = catchAsync(async (req, res, next) => {
    const tinDang = await TinDang.findById(req.query.id).populate('nguoiDungId');

    res.status(200).json({
        status: 'success',
        data: tinDang
    });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
    const { imagePublicId } = req.body
    const tinDang = await TinDang.findById(req.query.postId);
    if (tinDang) {
        tinDang.hinhAnh = tinDang.hinhAnh.filter(x => x.public_id !== imagePublicId)
        await tinDang.save()
        cloudinary.v2.uploader.destroy(imagePublicId, function (error, result) {
            // if (error) return res.json({ success: false, message: 'Something went wrong!' })
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Image deleted'
    });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
    const { videoPublicId } = req.body
    const tinDang = await TinDang.findById(req.query.postId);
    if (tinDang) {
        tinDang.video = tinDang.video.filter(x => x.public_id !== videoPublicId)
        await tinDang.save()
        cloudinary.v2.uploader.destroy(videoPublicId, function (error, result) {
            // if (error) return res.json({ success: false, message: 'Something went wrong!' })
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Video deleted'
    });
});

exports.updateTinHetHan = catchAsync(async (req, res, next) => {
    // const sixtyDaysAgo = new Date();
    // sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const currentDate = Date.now();
    const sixtyDaysAgo = moment(currentDate).subtract(60, 'days');
    const seventyFiveDaysAgo = moment(currentDate).subtract(75, 'days');
    const fiveDaysAgo = moment(currentDate).subtract(15, "days");
    await TinDang.updateMany({ thoiGianPush: { $lte: sixtyDaysAgo, $gte: seventyFiveDaysAgo }, trangThaiTin: { $ne: 'Bị từ chối' } }, { trangThaiTin: 'Hết hạn' })
    await TinDang.updateMany({ thoiGianPush: { $lte: seventyFiveDaysAgo }, trangThaiTin: { $ne: 'Bị từ chối' } }, { trangThaiTin: 'Hết hạn', xoaMem: true })
    await TinDang.updateMany({ thoiGianPush: { $lte: fiveDaysAgo }, trangThaiTin: 'Bị từ chối' }, { trangThaiTin: 'Hết hạn', xoaMem: true })

    res.status(200).json({
        status: 'success',
        message: 'Cập nhật tin hết hạn thành công'
    });
});

exports.statisticsPostInWeek = catchAsync(async (req, res, next) => {
    const currentDate = Date.now();
    const lastWeekDate = moment(currentDate).subtract(7, 'days');

    const data = await TinDang.aggregate([
        {
            $unwind: '$thoiGianTao'
        },
        {
            $match: {
                thoiGianTao: {
                    $gte: new Date(lastWeekDate),
                    $lte: new Date(currentDate),
                },
            },
        },
        {
            $sort: {
                thoiGianTao: -1
            }
        },
        {
            $project: {
                day: {
                    $dayOfMonth: "$thoiGianTao"
                },
                month: {
                    $month: "$thoiGianTao"
                },
                year: {
                    $year: "$thoiGianTao"
                },
            },
        },
        {
            $group: {
                _id: {
                    day: "$day",
                    year: "$year",
                    month: "$month",
                },
                count: {
                    $sum: 1
                },
            },
        },
        {
            $project: {
                _id: 0,
                day: "$_id.day",
                month: "$_id.month",
                year: "$_id.year",
                count: "$count",
            },
        },
    ]);

    if (!data) {
        return next(new AppError('No statistics found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.statisticsPostInWeekByUserId = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const currentDate = Date.now();
    const lastWeekDate = moment(currentDate).subtract(7, 'days');
    console.log("Check userId: ", userId);
    const data = await TinDang.aggregate([
        // {
        //     $unwind: '$thoiGianTao'
        // },
        {
            $match: {
                nguoiDungId: mongoose.Types.ObjectId(userId),
                thoiGianTao: {
                    $gte: new Date(lastWeekDate),
                    $lte: new Date(currentDate),
                },
            },
        },
        {
            $sort: {
                thoiGianTao: -1
            }
        },
        {
            $project: {
                day: {
                    $dayOfMonth: "$thoiGianTao"
                },
                month: {
                    $month: "$thoiGianTao"
                },
                year: {
                    $year: "$thoiGianTao"
                },
            },
        },
        {
            $group: {
                _id: {
                    day: "$day",
                    year: "$year",
                    month: "$month",
                },
                count: {
                    $sum: 1
                },
            },
        },
        {
            $project: {
                _id: 0,
                day: "$_id.day",
                month: "$_id.month",
                year: "$_id.year",
                count: "$count",
            },
        },
    ]);
    console.log("Check data: ", data);
    if (!data) {
        return next(new AppError('No statistics found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.statisticsPostInProvince = catchAsync(async (req, res, next) => {
    const data = await TinDang.aggregate([
        {
            $group: {
                _id: '$diaChiTinDang.tinhTPCode',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 10
        }
    ]);

    if (!data) {
        return next(new AppError('No statistics found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.countSoLuongTinDang = catchAsync(async (req, res, next) => {
    const now = new Date();

    const total = await TinDang.find({ trangThaiTin: 'Đang hiển thị' }).count();

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date();

    const data = await TinDang.aggregate([
        {
            $match: {
                trangThaiTin: 'Đang hiển thị',
                thoiGianTao: { $gte: lastMonthStart, $lte: thisMonthStart },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: '$thoiGianTao' },
                    year: { $year: '$thoiGianTao' },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
            },
        },
    ])

    var percentage = 0;
    if (data) {
        var lastMonthCount = 0;
        var thisMonthCount = 0;

        if (data[0]?.count) {
            lastMonthCount = data[0].count;
        }
        if (data[1]?.count) {
            thisMonthCount = data[1].count;
        }

        if (lastMonthCount != 0)
            percentage = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
        else
            percentage = ((thisMonthCount - lastMonthCount) / 1) * 100;
    }

    res.status(200).json({
        status: 'success',
        data: {
            total,
            percentage
        }
    });
});