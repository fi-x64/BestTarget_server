const MenhGia = require('../models/menhGiaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllMenhGia = catchAsync(async (req, res, next) => {
    const data = await MenhGia.find().sort({ soTien: 1 })

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getOneMenhGia = catchAsync(async (req, res, next) => {

    if (req.query.menhGiaId) {
        const data = await MenhGia.findById(req.query.menhGiaId)

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});
