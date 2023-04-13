const HoaDon = require('../models/hoaDonModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getAllDanhMuc = factory.getAll(DanhMuc);

exports.getAllHoaDon = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    const data = await HoaDon.find().sort({ thoiGianTao: -1 });

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getHoaDonByUserId = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const data = await HoaDon.find({ nguoiDungId: userId }).sort({ thoiGianTao: -1 });

    res.status(200).json({
        status: 'success',
        data: data
    });
});
