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