const MenhGia = require('../models/menhGiaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllMenhGia = factory.getAll(MenhGia);

exports.getOneMenhGia = catchAsync(async (req, res, next) => {

    if (req.query.menhGiaId) {
        const data = await MenhGia.findById(req.query.menhGiaId)

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});
