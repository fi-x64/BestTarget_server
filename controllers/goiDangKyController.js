const GoiDangKy = require('../models/goiDangKyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllGoiDangKy = factory.getAll(GoiDangKy);

exports.getOneGoiDangKy = catchAsync(async (req, res, next) => {
    const goiId = req.query.goiDangKyId
    if (goiId) {
        const data = await GoiDangKy.findById(goiId)

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});
