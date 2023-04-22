const LichSuTimKiem = require('../models/lichSuTimKiemModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');

// exports.getUser = factory.getOne(NguoiDung);
exports.getLichSuTimKiemByUserId = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.query.userId);

    // const data = await LichSuTimKiem.findOne({ nguoiDungId: userId })
    const data = await LichSuTimKiem.aggregate([
        {
            $unwind: "$noiDung"
        },
        {
            $match: {
                nguoiDungId: userId,
            },
        },
        {
            $lookup: {
                from: 'danhmucphus',
                localField: 'noiDung.danhMucPhuId',
                foreignField: 'danhMucPhuId',
                as: 'noiDung.danhMucPhu'
            }
        },
    ])

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.createLichSuTimKiem = catchAsync(async (req, res, next) => {
    const values = req.body;

    const data = await LichSuTimKiem.findOne({ nguoiDungId: values.nguoiDungId });

    var newNguoiDung;
    if (data) {
        var isExist = false;
        for (let i = 0; i < data.noiDung.length; i++) {
            if (data.noiDung[i].tieuDe == values.noiDung.tieuDe) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            if (data.noiDung.length > 10) {
                for (let i = data.noiDung.length; i > 10; i--) {
                    data.noiDung.shift();
                }
            }
            data.noiDung.push(values.noiDung);
            newNguoiDung = await data.save();
        } else {
            return res.status(200).json({
                status: 'error',
                data: 'Duplicate history'
            });
        }
    } else {
        newNguoiDung = await LichSuTimKiem.create(values);
    }

    if (newNguoiDung) {
        res.status(200).json({
            status: 'success',
            data: newNguoiDung
        });
    }
});

exports.deleteAllLichSuTimKiem = catchAsync(async (req, res, next) => {
    const userId = req.query.userId;

    if (userId) {
        const data = await LichSuTimKiem.findOne({ nguoiDungId: userId });

        if (data) {
            data.noiDung = [];
            const newData = await data.save();

            if (newData) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Đã xoá tất cả lịch sử tìm kiếm'
                });
            }
        }

        return res.status(200).json({
            status: 'error',
            message: 'Có lỗi khi xoá lịch sử tìm kiếm'
        });
    }
});

