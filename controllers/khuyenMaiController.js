const KhuyenMai = require('../models/khuyenMaiModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllKhuyenMai = catchAsync(async (req, res, next) => {
    const data = await KhuyenMai.find().sort({ ngayKetThuc: -1 }).populate('goiDangKyId');

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getOneKhuyenMai = catchAsync(async (req, res, next) => {
    if (req.query.khuyenMaiId) {
        const data = await KhuyenMai.findById(req.query.khuyenMaiId).populate('goiDangKyId');

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.getAppliedKhuyenMai = catchAsync(async (req, res, next) => {
    const now = new Date();

    const data = await KhuyenMai.findOne({ ngayKetThuc: { $gt: now } }).sort({ ngayKetThuc: -1 }).populate('goiDangKyId');

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.createKhuyenMai = catchAsync(async (req, res, next) => {
    if (req.body) {
        const data = await KhuyenMai.create(req.body);

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.editKhuyenMai = catchAsync(async (req, res, next) => {
    const khuyenMaiId = req.query.khuyenMaiId;
    const values = req.body;
    if (khuyenMaiId && values) {
        const data = await KhuyenMai.findByIdAndUpdate(khuyenMaiId, values);

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.deleteKhuyenMai = catchAsync(async (req, res, next) => {
    const khuyenMaiId = req.query.khuyenMaiId;

    if (khuyenMaiId) {
        const data = await KhuyenMai.findByIdAndDelete(khuyenMaiId);

        res.status(200).json({
            status: 'success',
            data: 'success'
        });
    }
});

