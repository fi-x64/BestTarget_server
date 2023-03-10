const TinhTP = require('../models/tinhTPModel');
const QuanHuyen = require('../models/quanHuyenModel');
const PhuongXa = require('../models/phuongXaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllTinhThanh = factory.getAll(TinhTP);

exports.getQuanHuyen = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.query.tinhTPCode) {
        const quanHuyen = await QuanHuyen.find({
            parent_code: req.query.tinhTPCode
        })
        res.status(200).json({
            status: 'success',
            data: quanHuyen
        });
    }
});

exports.getPhuongXa = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.query.quanHuyenCode) {
        const phuongXa = await PhuongXa.find({
            parent_code: req.query.quanHuyenCode
        })
        res.status(200).json({
            status: 'success',
            data: phuongXa
        });
    }
});

exports.getOneTinhTP = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.query.tinhTPCode) {
        const quanHuyen = await TinhTP.findById(req.query.tinhTPCode)

        res.status(200).json({
            status: 'success',
            data: quanHuyen
        });
    }
});

exports.getOneQuanHuyen = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.query.quanHuyenCode) {
        const quanHuyen = await QuanHuyen.findById(req.query.quanHuyenCode)

        res.status(200).json({
            status: 'success',
            data: quanHuyen
        });
    }
});

exports.getOnePhuongXa = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.query.phuongXaCode) {
        const quanHuyen = await PhuongXa.findById(req.query.phuongXaCode)

        res.status(200).json({
            status: 'success',
            data: quanHuyen
        });
    }
});

exports.getOneDiaChi = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    console.log("Check req.query: ", req.query);
    const tinhThanh = await TinhTP.findById(req.query.tinhTPCode);
    const quanHuyen = await QuanHuyen.findById(req.query.quanHuyenCode);
    const phuongXa = await PhuongXa.findById(req.query.phuongXaCode);

    res.status(200).json({
        status: 'success',
        data: {
            tinhThanh,
            quanHuyen,
            phuongXa
        }
    });

});

// Do NOT update passwords with this!
// exports.updateUser = factory.updateOne(NguoiDung);
// exports.deleteUser = factory.deleteOne(NguoiDung);
