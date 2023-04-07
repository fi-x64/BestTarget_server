const MenhGia = require('../models/menhGiaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const TheoDoi = require('../models/theoDoiModel');
const TinYeuThich = require('../models/tinYeuThichModel');
const mongoose = require('mongoose');

// exports.getUser = factory.getOne(NguoiDung);
exports.themTinYeuThich = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const tinDangId = req.query.tinDangId;

    if (userId && tinDangId) {
        const data = await TinYeuThich.findOne({ nguoiDungId: userId });

        if (data) {
            if (!data.tinYeuThichId.includes(tinDangId)) {
                data.tinYeuThichId.push(tinDangId);
                await data.save();
            } else {
                res.status(500).json({
                    status: 'error',
                    message: 'Thêm tin yêu thích không thành công'
                });
                return;
            }
        } else {
            const tinYeuThich = new TinYeuThich({
                nguoiDungId: userId,
                tinYeuThichId: [tinDangId]
            })

            await tinYeuThich.save();
        }

        res.status(200).json({
            status: 'success',
            message: 'Thêm tin yêu thích thành công'
        });
    }
});

exports.xoaTinYeuThich = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const tinDangId = req.query.tinDangId;

    if (userId && tinDangId) {
        const data = await TinYeuThich.updateOne(
            { nguoiDungId: userId },
            { $pull: { tinYeuThichId: tinDangId } },
        )
    }
    res.status(200).json({
        status: 'success',
        message: 'Xoá tin yêu thích thành công'
    });
});

exports.getListTinYeuThich = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const data = await TinYeuThich.aggregate([
        {
            $unwind: "$tinYeuThichId" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'tinYeuThichId',
                foreignField: '_id',
                as: 'tinYeuThich'
            }
        },
        {
            $match:
                { nguoiDungId: userId, "tinYeuThich.trangThaiTin": 'Đang hiển thị' }
        },
        {
            $project: {
                "tinYeuThich._id": 1,
                "tinYeuThich.tieuDe": 1,
                "tinYeuThich.hinhAnh": 1,
                "tinYeuThich.gia": 1
            }
        },
    ]);

    var count = 0;

    if (data) {
        count = data.length;
    } else count = 0;

    res.status(200).json({
        status: 'success',
        data: { data, count }
    });
});