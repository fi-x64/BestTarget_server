const TinDang = require('../models/tinDangModel');
const GoiY = require('../models/goiYModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { propfind } = require('../routes/tinDangRoutes');
const cloudinary = require('cloudinary');
const moment = require('moment');

// exports.getAllDanhMuc = factory.getAll(DanhMuc);
exports.getAllPosts = catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = await TinDang.find().populate('NguoiDung');
    // const doc = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: features,
        data: features
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
    const data = await TinDang.aggregate([
        {
            $group: {
                _id: '$trangThaiTin',
                soLuong: { $sum: 1 },
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getTinDang = catchAsync(async (req, res, next) => {
    const key = parseInt(req.query.phanLoai);

    var data;

    if (key === 1)
        data = await TinDang.find({ trangThaiTin: "Đang hiển thị" });
    else if (key === 2)
        data = await TinDang.find({ trangThaiTin: "Hết hạn" });
    else if (key === 3)
        data = await TinDang.find({ trangThaiTin: "Bị từ chối" });
    else if (key === 4)
        data = await TinDang.find({ trangThaiTin: "Đang đợi duyệt" });
    else if (key === 5)
        data = await TinDang.find({ trangThaiTin: "Khác" });

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getTinDangId = catchAsync(async (req, res, next) => {
    const tinDang = await TinDang.findOne({ _id: req.query.id, trangThaiTin: 'Đang hiển thị' });

    res.status(200).json({
        status: 'success',
        data: tinDang
    });
});

exports.getTinDangIdRestrict = catchAsync(async (req, res, next) => {
    const tinDang = await TinDang.findById(req.query.id);

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

exports.statisticsPostInWeek = catchAsync(async (req, res, next) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const lastWeekDate = moment().subtract(7, 'days').format('YYYY-MM-DD');

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