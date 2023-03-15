const TinDang = require('../models/tinDangModel');
const GoiY = require('../models/goiYModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getAllDanhMuc = factory.getAll(DanhMuc);

exports.createTinDang = catchAsync(async (req, res, next) => {
    console.log("Check req.body: ", req.body);
    // 1) Create error if user POSTs password data

    const tinDang = await TinDang.create(req.body);
    res.status(200).json({
        status: 'success',
        data: tinDang
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