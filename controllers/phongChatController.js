const PhongChat = require('../models/phongChatModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllPhongChat = factory.getAll(PhongChat);

exports.getAllPhongChatByUserIdQuery = async (userIdData, type) => {
    const userId = mongoose.Types.ObjectId(userIdData);

    if (userId && type) {
        var data;
        if (type == 'troChuyen') {
            data = await PhongChat.aggregate([
                {
                    $unwind: "$_id"
                },
                {
                    $match: {
                        loaiPhongChat: 'troChuyen',
                        $or: [
                            { nguoiDungId1: userId },
                            { nguoiDungId2: userId },
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'chats',
                        localField: '_id',
                        foreignField: 'phongChatId',
                        as: 'chat'
                    }
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId1',
                        foreignField: '_id',
                        as: 'nguoiDungId1'
                    }
                },
                {
                    $unwind: "$nguoiDungId1"
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId2',
                        foreignField: '_id',
                        as: 'nguoiDungId2'
                    }
                },
                {
                    $unwind: "$nguoiDungId2"
                },
                {
                    $lookup: {
                        from: 'tindangs',
                        localField: 'tinDangId',
                        foreignField: '_id',
                        as: 'tinDangId'
                    }
                },
                {
                    $unwind: "$tinDangId"
                },
                {
                    $sort: { 'chat.thoiGianChatMoiNhat': -1 }
                }
            ])
        } else if (type == 'hoTro') {
            data = await PhongChat.aggregate([
                {
                    $unwind: "$_id"
                },
                {
                    $match: {
                        loaiPhongChat: 'hoTro',
                        $or: [
                            { nguoiDungId1: userId },
                            { nguoiDungId2: userId },
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'chats',
                        localField: '_id',
                        foreignField: 'phongChatId',
                        as: 'chat'
                    }
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId1',
                        foreignField: '_id',
                        as: 'nguoiDungId1'
                    }
                },
                {
                    $unwind: "$nguoiDungId1"
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId2',
                        foreignField: '_id',
                        as: 'nguoiDungId2'
                    }
                },
                {
                    $unwind: "$nguoiDungId2"
                },
                {
                    $sort: { 'chat.thoiGianChatMoiNhat': -1 }
                }
            ])
        }

        return data;
    }
}

exports.getAllPhongChatByUserId = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user.id);
    const type = req.query.type;

    if (userId) {
        var data;
        if (type == 'troChuyen') {
            data = await PhongChat.aggregate([
                {
                    $unwind: "$_id"
                },
                {
                    $match: {
                        loaiPhongChat: type,
                        $or: [
                            { nguoiDungId1: userId },
                            { nguoiDungId2: userId },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'chats',
                        localField: '_id',
                        foreignField: 'phongChatId',
                        as: 'chat'
                    }
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId1',
                        foreignField: '_id',
                        as: 'nguoiDungId1'
                    }
                },
                {
                    $unwind: "$nguoiDungId1"
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId2',
                        foreignField: '_id',
                        as: 'nguoiDungId2'
                    }
                },
                {
                    $unwind: "$nguoiDungId2"
                },
                {
                    $lookup: {
                        from: 'tindangs',
                        localField: 'tinDangId',
                        foreignField: '_id',
                        as: 'tinDangId'
                    }
                },
                {
                    $unwind: "$tinDangId"
                },
                {
                    $sort: { 'chat.thoiGianChatMoiNhat': -1 }
                }
            ])
        } else if (type == 'hoTro') {
            data = await PhongChat.aggregate([
                {
                    $unwind: "$_id"
                },
                {
                    $match: {
                        loaiPhongChat: type,
                        $or: [
                            { nguoiDungId1: userId },
                            { nguoiDungId2: userId },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'chats',
                        localField: '_id',
                        foreignField: 'phongChatId',
                        as: 'chat'
                    }
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId1',
                        foreignField: '_id',
                        as: 'nguoiDungId1'
                    }
                },
                {
                    $unwind: "$nguoiDungId1"
                },
                {
                    $lookup: {
                        from: 'nguoidungs',
                        localField: 'nguoiDungId2',
                        foreignField: '_id',
                        as: 'nguoiDungId2'
                    }
                },
                {
                    $unwind: "$nguoiDungId2"
                },
                {
                    $sort: { 'chat.thoiGianChatMoiNhat': -1 }
                }
            ])
        }

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.getAllPhongChatForNotiQuery = async (userIdData) => {
    const userId = mongoose.Types.ObjectId(userIdData);

    if (userId) {
        const data = await PhongChat.aggregate([
            // {
            //     $unwind: "$_id"
            // },
            {
                $match: {
                    $or: [
                        { nguoiDungId1: userId },
                        { nguoiDungId2: userId },
                    ]
                },
            },
            {
                $lookup: {
                    from: 'chats',
                    localField: '_id',
                    foreignField: 'phongChatId',
                    as: 'chat'
                }
            },
            // {
            //     $sort: { 'chat.thoiGianChatMoiNhat': -1 }
            // }
        ])
        if (data) {
            var count = 0;
            data.map((value, index) => {
                if (value?.chat[0]?.tinNhan) {
                    if (JSON.stringify(value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].nguoiGuiId) != JSON.stringify(userId) && value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].daDoc == false) {
                        console.log("Check userId: ", typeof userId);
                        console.log("Check value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].nguoiGuiId: ", typeof value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].nguoiGuiId);
                        count++;
                    }
                }
            })

            return { data, soLuongTinChuaDoc: count };
        }
    }
};

exports.getAllPhongChatForNoti = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user.id);

    if (userId) {
        const data = await PhongChat.aggregate([
            {
                $unwind: "$_id"
            },
            {
                $match: {
                    $or: [
                        { nguoiDungId1: userId },
                        { nguoiDungId2: userId },
                    ]
                },
            },
            {
                $lookup: {
                    from: 'chats',
                    localField: '_id',
                    foreignField: 'phongChatId',
                    as: 'chat'
                }
            },
            {
                $sort: { 'chat.thoiGianChatMoiNhat': -1 }
            }
        ])

        if (data) {
            var count = 0;
            data.map((value, index) => {
                if (value.chat[0]?.tinNhan.length > 0) {
                    if (value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].nguoiGuiId != req.user.id && value.chat[0].tinNhan[value.chat[0].tinNhan.length - 1].daDoc == false) {
                        count++;
                    }
                }
            })

            data.soLuongChuaDoc = count;
            res.status(200).json({
                status: 'success',
                data: {
                    data,
                    soLuongTinChuaDoc: count
                }
            });
        }

    }
});

exports.getOnePhongChat = catchAsync(async (req, res, next) => {
    const phongChatId = req.query.phongChatId;

    if (phongChatId) {
        const data = await PhongChat.findById(phongChatId);

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.createPhongChat = catchAsync(async (req, res, next) => {
    const values = req.body;

    if (values && values.loaiPhongChat) {
        var phongChatData = [];
        if (values.loaiPhongChat == 'troChuyen') {
            phongChatData = await PhongChat.find({
                $or: [
                    {
                        $and: [
                            { nguoiDungId1: values.nguoiDungId1 },
                            { nguoiDungId2: values.nguoiDungId2 },
                            { tinDangId: values.tinDangId },
                            { loaiPhongChat: values.loaiPhongChat }
                        ]
                    },
                    {
                        $and: [
                            { nguoiDungId1: values.nguoiDungId2 },
                            { nguoiDungId2: values.nguoiDungId1 },
                            { tinDangId: values.tinDangId },
                            { loaiPhongChat: values.loaiPhongChat }
                        ]
                    }
                ],
            })
        } else if (values.loaiPhongChat == 'hoTro') {
            phongChatData = await PhongChat.find({
                $or: [
                    {
                        $and: [
                            { nguoiDungId1: values.nguoiDungId1 },
                            { nguoiDungId2: values.nguoiDungId2 },
                            { loaiPhongChat: values.loaiPhongChat }
                        ]
                    },
                    {
                        $and: [
                            { nguoiDungId1: values.nguoiDungId2 },
                            { nguoiDungId2: values.nguoiDungId1 },
                            { loaiPhongChat: values.loaiPhongChat }
                        ]
                    }
                ],
            })
        }

        var data;

        if (phongChatData.length == 0) {
            data = await PhongChat.create(values);
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'Chat room is already created',
                data: phongChatData
            });
        }

        if (data) {
            res.status(200).json({
                status: 'success',
                data: data
            });
        }
    }
});
