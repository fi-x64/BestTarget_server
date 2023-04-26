const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');
const io = require('../utils/socketio');
const { getAllPhongChatByUserIdQuery, getAllPhongChatForNotiQuery, getOnePhongChat } = require('./phongChatController');
const PhongChat = require('../models/phongChatModel');

// exports.getUser = factory.getOne(NguoiDung);
exports.getAllChat = factory.getAll(Chat);

exports.getAllChatByPhongId = catchAsync(async (req, res, next) => {
    const phongChatId = req.query.phongChatId;

    if (phongChatId) {
        const data = await Chat.find({
            phongChatId: phongChatId
        })

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.getOneChat = catchAsync(async (req, res, next) => {
    const chatId = req.query.chatId;

    if (phongChatId) {
        const data = await Chat.findById(chatId)

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.createChat = catchAsync(async (req, res, next) => {
    const values = req.body;

    if (values) {
        const chatData = await Chat.findOne({ phongChatId: values.phongChatId }).populate('phongChatId');
        var data;
        values.tinNhan._id = new mongoose.Types.ObjectId();

        if (!chatData) {
            data = await Chat.create(values);
        } else {
            if (chatData.phongChatId.nguoiDungId1 == values.tinNhan.nguoiGuiId || chatData.phongChatId.nguoiDungId2 == values.tinNhan.nguoiGuiId) {
                chatData.tinNhan.push(values.tinNhan);
                chatData.thoiGianChatMoiNhat = Date.now();

                data = await chatData.save();
            } else {
                return res.status(200).json({
                    status: 'error',
                    message: 'Id người gửi không hợp lệ'
                });
            }
        }

        if (data) {
            const phongChatData = await PhongChat.findById(values.phongChatId);
            if (phongChatData) {
                var allPhongChatByUserId1, allPhongChatByUserId2;
                if (phongChatData.loaiPhongChat == 'hoTro') {
                    allPhongChatByUserId1 = await getAllPhongChatByUserIdQuery(phongChatData.nguoiDungId1, "hoTro");
                    allPhongChatByUserId2 = await getAllPhongChatByUserIdQuery(phongChatData.nguoiDungId2, "hoTro");
                } else
                    if (phongChatData.loaiPhongChat == 'troChuyen') {
                        allPhongChatByUserId1 = await getAllPhongChatByUserIdQuery(phongChatData.nguoiDungId1, "troChuyen");
                        allPhongChatByUserId2 = await getAllPhongChatByUserIdQuery(phongChatData.nguoiDungId2, "troChuyen");
                    }

                const allPhongChatForNotiQuery1 = await getAllPhongChatForNotiQuery(phongChatData.nguoiDungId1);
                const allPhongChatForNotiQuery2 = await getAllPhongChatForNotiQuery(phongChatData.nguoiDungId2);
                // console.log("Check allPhongChatForNotiQuery1: ", allPhongChatForNotiQuery1);
                // console.log("Check allPhongChatForNotiQuery2: ", allPhongChatForNotiQuery2);

                if (phongChatData.loaiPhongChat == 'hoTro') {
                    io.sockets.emit(`newMessage_${phongChatData.nguoiDungId1}`, { data: allPhongChatByUserId1, loaiPhongChat: 'hoTro' });
                    io.sockets.emit(`newMessage_${phongChatData.nguoiDungId2}`, { data: allPhongChatByUserId2, loaiPhongChat: 'hoTro' });
                } else if (phongChatData.loaiPhongChat == 'troChuyen') {
                    io.sockets.emit(`newMessage_${phongChatData.nguoiDungId1}`, { data: allPhongChatByUserId1, loaiPhongChat: 'troChuyen' });
                    io.sockets.emit(`newMessage_${phongChatData.nguoiDungId2}`, { data: allPhongChatByUserId2, loaiPhongChat: 'troChuyen' });
                }

                io.sockets.emit(`newMessageNoti_${phongChatData.nguoiDungId1}`, allPhongChatForNotiQuery1);
                io.sockets.emit(`newMessageNoti_${phongChatData.nguoiDungId2}`, allPhongChatForNotiQuery2);
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'Lưu tin nhắn thành công'
        });
    }
});

exports.editReadChat = catchAsync(async (req, res, next) => {
    const chatId = req.query.chatId;

    if (chatId) {
        const data = await Chat.findById(chatId)

        if (data) {
            data.tinNhan.map((value, index) => {
                value.daDoc = true
            })

            const newChat = await data.save();

            if (newChat) {
                return res.status(200).json({
                    status: 'success',
                    messgae: 'Update read chat success'
                });
            }
        }
    }
    return res.status(200).json({
        status: 'error',
        messgae: 'Update read chat failed'
    });
});