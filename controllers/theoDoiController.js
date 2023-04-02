const MenhGia = require('../models/menhGiaModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const NguoiDung = require('../models/nguoiDungModel');
const TheoDoi = require('../models/theoDoiModel');

// exports.getUser = factory.getOne(NguoiDung);
exports.themTheoDoi = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const followId = req.query.followId;

    if (userId && followId) {
        const data = await TheoDoi.findOne({ nguoiDungId: userId })
        console.log("Check data: ", data);
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
            message: 'Thêm người theo dõi thành công'
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
        console.log("Check data: ", data);
        res.status(200).json({
            status: 'success',
            message: 'Xoá người theo dõi thành công'
        });
    }
});

exports.getListFollowing = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const listFollow = await TheoDoi.aggregate([
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
            }
        },
    ]);

    var count = 0;

    if (listFollow) {
        count = listFollow.length;
    } else count = 0;

    res.status(200).json({
        status: 'success',
        data: { listFollow, count }
    });
});

exports.getListFollower = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const listFollow = await TheoDoi.aggregate([
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
            }
        },
    ]);

    var count = 0;

    if (listFollow) {
        count = listFollow.length;
    } else count = 0;

    res.status(200).json({
        status: 'success',
        data: { listFollow, count }
    });
});