const DanhMuc = require('../models/danhMucModel');
const DanhMucPhu = require('../models/danhMucPhuModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getAllDanhMuc = factory.getAll(DanhMuc);

exports.getAllDanhMuc = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data

    const danhMuc = await DanhMuc.find();
    res.status(200).json({
        status: 'success',
        data: danhMuc
    });
});

exports.getAllDanhMucPhu = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    const danhMucPhu = await DanhMucPhu.find({ danhMucId: req.query.danhMucId });

    res.status(200).json({
        status: 'success',
        data: danhMucPhu
    });
});
