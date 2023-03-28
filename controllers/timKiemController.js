const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const TinDang = require('../models/tinDangModel');
const GoiY = require('../models/goiYModel');

// exports.getUser = factory.getOne(NguoiDung);
exports.handleTimKiem = catchAsync(async (req, res, next) => {
    const values = req.query.searchKey;

    const hangSX = await GoiY.aggregate([
        {
            $unwind: "$hangSX" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'danhmucphus',
                localField: 'danhMucPhuId',
                foreignField: 'danhMucPhuId',
                as: 'danhMucPhu'
            }
        },
        {
            $match:
                { "hangSX.label": { $regex: '.*' + values + '.*', $options: 'i' } }
        },
        {
            $project: {
                "hangSX.label": 1,
                "hangSX.value": 1,
                "danhMucPhu.danhMucPhuId": 1,
                "danhMucPhu.ten": 1
            }
        },
        {
            $limit: 10
        }
    ]);

    const tinDang = await TinDang.aggregate([
        {
            $match: {
                $or: [
                    { "tieuDe": { $regex: '.*' + values + '.*', $options: 'i' } },
                    { "moTa": { $regex: '.*' + values + '.*', $options: 'i' } },
                    { "trangThaiTin": "Đang hiển thị" }
                ]
            },
        },
        {
            $lookup: {
                from: 'danhmucphus',
                localField: 'danhMucPhuId',
                foreignField: 'danhMucPhuId',
                as: 'danhMucPhu'
            }
        },
        {
            $group: {
                "_id": "$tieuDe",
                doc: { $first: '$$ROOT' }
            }
        },
        { $replaceRoot: { newRoot: '$doc' } },
        {
            $project: {
                "tieuDe": 1,
                "danhMucPhu": {
                    "danhMucPhuId": 1,
                    "ten": 1,
                    "danhMucId": 1
                },
            }
        },
        {
            $limit: 10
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            hangSX,
            tinDang
        }
    });

});