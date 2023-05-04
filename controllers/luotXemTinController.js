const LuotXemTin = require('../models/luotXemTinModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');
const moment = require('moment');

// exports.getUser = factory.getOne(NguoiDung);
exports.getLuotXemTinByTinDangId = catchAsync(async (req, res, next) => {
    const tinDangId = req.query.tinDangId;

    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.findOne({ tinDangId: tinDangId }).populate('tindangs');

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.statisticsLuotXemTinByCategory = catchAsync(async (req, res, next) => {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.aggregate([
        {
            $match: {
                noiDung: {
                    $elemMatch: {
                        thoiGianXem: {
                            $gte: startDate,
                            $lte: endDate
                        },
                    }
                }
            },
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'tinDangId',
                foreignField: '_id',
                as: 'tinDang'
            }
        },
        {
            $match: {
                'tinDang.trangThaiTin': 'Đang hiển thị'
            }
        },
        {
            $unwind: '$tinDang'
        },
        {
            $group: {
                "_id": '$tinDang.danhMucPhuId',
                count: {
                    $sum: 1
                },
            },
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $lookup: {
                from: 'danhmucphus',
                localField: '_id',
                foreignField: 'danhMucPhuId',
                as: 'danhMucPhu'
            }
        },
        {
            $unwind: '$danhMucPhu'
        }
    ])

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.statisticsLuotXemDanhMucPhuInWeek = catchAsync(async (req, res, next) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.aggregate([
        {
            $match: {
                noiDung: {
                    $elemMatch: {
                        thoiGianXem: {
                            $gte: sevenDaysAgo,
                        },
                    }
                }
            },
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'tinDangId',
                foreignField: '_id',
                as: 'tinDang'
            }
        },
        {
            $match: {
                'tinDang.trangThaiTin': 'Đang hiển thị'
            }
        },
        {
            $unwind: '$tinDang'
        },
        {
            $group: {
                "_id": '$tinDang.danhMucPhuId',
                count: {
                    $sum: 1
                },
                // firstLuotXem: { $first: "$$ROOT" }
            },
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $lookup: {
                from: 'danhmucphus',
                localField: '_id',
                foreignField: 'danhMucPhuId',
                as: 'danhMucPhu'
            }
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getAllTinDangRelatedHot = catchAsync(async (req, res, next) => {
    const danhMucPhuId = parseInt(req.body.danhMucPhuId);
    const postId = req.body.postId;

    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.aggregate([
        {
            $match:
                { "tinDangId": { $ne: mongoose.Types.ObjectId(postId) } },
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'tinDangId',
                foreignField: '_id',
                as: 'tinDang'
            }
        },
        {
            $sort: {
                tongLuotXemTin: -1
            }
        },
        {
            $match: {
                'tinDang.danhMucPhuId': danhMucPhuId
            }
        },
        {
            $lookup: {
                from: 'tinhtps',
                localField: 'tinDang.diaChiTinDang.tinhTPCode',
                foreignField: '_id',
                as: 'tinhThanhPho'
            }
        },
        // {
        //     $project: {
        //         "tinDangId": 1,
        //         "tinDang": 1,
        //         "tongLuotXemTin": 1
        //     }
        // },
        {
            $limit: 20
        }
    ])

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.statisticsLuotXemTinInWeek = catchAsync(async (req, res, next) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.aggregate([
        // {
        //     $unwind: '$noiDung'
        // },
        {
            $match: {
                noiDung: {
                    $elemMatch: {
                        thoiGianXem: {
                            $gte: sevenDaysAgo,
                        },
                    }
                }
            },
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'tinDangId',
                foreignField: '_id',
                as: 'tinDang'
            }
        },
        {
            $sort: {
                tongLuotXemTin: -1
            }
        },
        {
            $match: {
                'tinDang.trangThaiTin': 'Đang hiển thị'
            }
        },
        {
            $project: {
                "tinDangId": 1,
                "tinDang": 1,
                "tongLuotXemTin": 1
            }
        },
        {
            $limit: 5
        }
    ])

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.createLuotXemTin = catchAsync(async (req, res, next) => {
    const values = req.body;
    // const data = await LuotXemTin.findOne({ nguoiDungId: userId })
    const data = await LuotXemTin.findOne({ tinDangId: values.tinDangId });

    var newTinDang;
    if (data) {
        var isExist = false;
        for (let i = 0; i < data.noiDung.length; i++) {
            if (data.noiDung[i].nguoiDungId == values.noiDung.nguoiDungId) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            data.tongLuotXemTin += 1;
            data.noiDung.push(values.noiDung);
            newTinDang = await data.save();
        } else {
            return res.status(200).json({
                status: 'error',
                data: 'Duplicate view of post'
            });
        }
    } else {
        newTinDang = await LuotXemTin.create(values);
    }

    if (newTinDang) {
        res.status(200).json({
            status: 'success',
            data: newTinDang
        });
    }
});

exports.deleteAllLuotXemTin = catchAsync(async (req, res, next) => {
    const tinDangId = req.query.tinDangId;

    if (tinDangId) {
        const data = await LuotXemTin.deleteOne({ tinDangId: tinDangId });

        if (data) {
            return res.status(200).json({
                status: 'success',
                message: 'Đã xoá tất cả lượt xem'
            });
        }

        return res.status(200).json({
            status: 'error',
            message: 'Có lỗi khi xoá lượt xem'
        });
    }
});

