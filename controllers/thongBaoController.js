const ThongBao = require('../models/thongBaoModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const mongoose = require('mongoose');
const io = require('../utils/socketio');
const NguoiDung = require('../models/nguoiDungModel');

exports.getAllThongBaoQuery = async (userId) => {
    const data = await ThongBao.aggregate([
        {
            $unwind: "$chiTiet" // tách mảng prices ra thành từng document riêng biệt
        },
        {
            $lookup: {
                from: 'tindangs',
                localField: 'chiTiet.tinDangId',
                foreignField: '_id',
                as: 'tinDang'
            }
        },
        {
            $match:
                { nguoiDungId: userId }
        },
        { $sort: { 'chiTiet.thoiGianThongBao': -1 } },
        {
            $project: {
                "chiTiet._id": 1,
                "chiTiet.noiDung": 1,
                "chiTiet.thoiGianThongBao": 1,
                "chiTiet.loai": 1,
                "chiTiet.daDoc": 1,
                "tinDang._id": 1,
                "tinDang.tieuDe": 1,
                "tinDang.hinhAnh": 1
            }
        }
    ]);
    var count = 0;
    if (data) {
        data.map((value, index) => {
            if (value.chiTiet.daDoc == false)
                count++;
        })
    }

    return { data, tinChuaDoc: count }
}

exports.getAllThongBao = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.query.userId);

    if (userId) {
        // const data = await ThongBao.findOne({ nguoiDungId: userId }).sort({ 'chiTiet.thoiGianThongBao': -1 }).limit(20).populate('chiTiet.tinDangId', 'tieuDe hinhAnh');

        const data = await this.getAllThongBaoQuery(userId);

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.createAllThongBao = catchAsync(async (req, res, next) => {
    const values = req.body;

    const users = await NguoiDung.find().select('_id');

    if (users) {
        await users.forEach(async (user) => {
            var data = await ThongBao.findOne({ nguoiDungId: user._id });
            values._id = new mongoose.Types.ObjectId();
            values.daDoc = false;
            if (data) {
                data.chiTiet.push(values);
                if (data.chiTiet.length > 10) {
                    // Số lượng phần tử vượt quá 10, xoá các phần tử đầu cho đến khi nhỏ hơn hoặc bằng 10
                    data.chiTiet = data.chiTiet.slice(data.chiTiet.length - 10, data.chiTiet.length);
                }
                data = await data.save();
            } else {
                data = await ThongBao.create({
                    nguoiDungId: user._id,
                    chiTiet: values,
                })
            }

        });

        io.sockets.emit('khuyenmai_updated', { status: 'success' });

        res.status(200).json({
            status: 'success',
            data: 'success'
        });
    }
});

exports.createThongBao = catchAsync(async (req, res, next) => {
    const userId = req.query.userId;
    const values = req.body;
    values.tinDangId = mongoose.Types.ObjectId(values.tinDangId);

    if (userId && values) {
        var data = await ThongBao.findOne({ nguoiDungId: userId });

        values._id = new mongoose.Types.ObjectId();

        if (data) {
            data.chiTiet.push(values);
            if (data.chiTiet.length > 10) {
                // Số lượng phần tử vượt quá 10, xoá các phần tử đầu cho đến khi nhỏ hơn hoặc bằng 10
                data.chiTiet = data.chiTiet.slice(data.chiTiet.length - 10, data.chiTiet.length);
            }
            data = await data.save();
        } else {
            data = await ThongBao.create({
                nguoiDungId: userId,
                chiTiet: values
            })
        }

        if (data) {
            const newThongBao = await this.getAllThongBaoQuery(mongoose.Types.ObjectId(userId));
            if (newThongBao) {
                io.emit(`thongbao_updated_${userId}`, newThongBao);
            }
        }

        res.status(200).json({
            status: 'success',
            data: data
        });
    }
});

exports.editReadThongBao = catchAsync(async (req, res, next) => {
    const thongBaoId = req.query.thongBaoId;

    // values.tinDangId = mongoose.Types.ObjectId(values.tinDangId);

    if (thongBaoId) {
        var data = await ThongBao.updateOne(
            { 'chiTiet._id': thongBaoId },
            { $set: { "chiTiet.$.daDoc": true } }
        )

        const thongBaoData = await ThongBao.findOne(
            { 'chiTiet._id': thongBaoId },
        )

        const userId = thongBaoData.nguoiDungId;

        const finalData = await this.getAllThongBaoQuery(userId);

        res.status(200).json({
            status: 'success',
            data: finalData
        });
    }
});