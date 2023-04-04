const MenhGia = require('../models/menhGiaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const NguoiDung = require('../models/nguoiDungModel');
const TheoDoi = require('../models/theoDoiModel');
const mongoose = require('mongoose');

// exports.getUser = factory.getOne(NguoiDung);
exports.themTheoDoi = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const followId = req.query.followId;

    if (userId && followId) {
        const data = await TheoDoi.findOne({ nguoiDungId: userId })

        if (data) {
            if (!data.nguoiDungTheoDoiId.includes(followId)) {
                data.nguoiDungTheoDoiId.push(followId);
                await data.save();
            } else {
                res.status(500).json({
                    status: 'error',
                    message: 'Thêm người theo dõi không thành công'
                });
                return;
            }
        } else {
            const theoDoi = new TheoDoi({
                nguoiDungId: userId,
                nguoiDungTheoDoiId: [followId]
            })

            await theoDoi.save();
        }

        res.status(200).json({
            status: 'success',
            message: 'Thêm theo dõi thành công'
        });
    }
});

exports.xoaTheoDoi = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const followId = req.query.followId;

    if (userId && followId) {
        const data = await TheoDoi.updateOne(
            { nguoiDungId: userId },
            { $pull: { nguoiDungTheoDoiId: followId } },
        )
    }
    res.status(200).json({
        status: 'success',
        message: 'Huỷ theo dõi thành công'
    });
});

exports.getListFollowing = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.query.userId);

    const data = await TheoDoi.aggregate([
        {
            $unwind: "$nguoiDungTheoDoiId" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'nguoidungs',
                localField: 'nguoiDungTheoDoiId',
                foreignField: '_id',
                as: 'nguoiDung'
            }
        },
        {
            $match:
                { nguoiDungId: userId, "nguoiDung.trangThai": true }
        },
        {
            $project: {
                "nguoiDung._id": 1,
                "nguoiDung.hoTen": 1,
                "nguoiDung.anhDaiDien": 1
            }
        },
    ]);

    var count = 0;

    if (data) {
        count = data[0].nguoiDung.length;
    } else count = 0;

    res.status(200).json({
        status: 'success',
        data: { data, count }
    });
});

exports.getListFollower = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.query.userId);

    const data = await TheoDoi.aggregate([
        {
            $unwind: "$nguoiDungTheoDoiId" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'nguoidungs',
                localField: 'nguoiDungId',
                foreignField: '_id',
                as: 'nguoiDung'
            }
        },
        {
            $match:
                { nguoiDungTheoDoiId: userId, "nguoiDung.trangThai": true }
        },
        {
            $project: {
                "nguoiDung._id": 1,
                "nguoiDung.hoTen": 1,
                "nguoiDung.anhDaiDien": 1
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

exports.getListLoggedFollowing = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const data = await TheoDoi.aggregate([
        {
            $unwind: "$nguoiDungTheoDoiId" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'nguoidungs',
                localField: 'nguoiDungTheoDoiId',
                foreignField: '_id',
                as: 'nguoiDung'
            }
        },
        {
            $match:
                { nguoiDungId: userId, "nguoiDung.trangThai": true }
        },
        {
            $project: {
                "nguoiDung._id": 1,
                "nguoiDung.hoTen": 1,
                "nguoiDung.anhDaiDien": 1
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

exports.getListLoggedFollower = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const data = await TheoDoi.aggregate([
        {
            $unwind: "$nguoiDungTheoDoiId" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'nguoidungs',
                localField: 'nguoiDungId',
                foreignField: '_id',
                as: 'nguoiDung'
            }
        },
        {
            $match:
                { nguoiDungTheoDoiId: userId, "nguoiDung.trangThai": true }
        },
        {
            $project: {
                "nguoiDung._id": 1,
                "nguoiDung.hoTen": 1,
                "nguoiDung.anhDaiDien": 1
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