const NguoiDung = require('../models/nguoiDungModel');
const TinhTP = require('../models/tinhTPModel');
const QuanHuyen = require('../models/quanHuyenModel');
const PhuongXa = require('../models/phuongXaModel');
const Quyen = require('../models/quyenModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const cloudinary = require('cloudinary');
const moment = require('moment');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.searchUser = catchAsync(async (req, res, next) => {
  const values = req.query.keyWord;

  const filteredData = await NguoiDung.find({
    $or: [
      { "hoTen": { $regex: '.*' + values + '.*', $options: 'i' } },
      { "email": { $regex: '.*' + values + '.*', $options: 'i' } },
      { "sdt": { $regex: '.*' + values + '.*', $options: 'i' } },
    ]
  }
  )

  res.status(200).json({
    status: 'success',
    data: filteredData
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.matKhau || req.body.xacNhanMatKhau) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  // const filteredBody = filterObj(req.body, 'sdt', 'email');
  // console.log("Check filteredBody: ", filteredBody);

  // 3) Update user document
  const updatedUser = await NguoiDung.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await NguoiDung.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getAllTinhThanh = catchAsync(async (req, res) => {
  const tinhThanh = await TinhTP.find();
  res.status(200).json({
    status: 'success',
    data: tinhThanh
  });
})

exports.getUser = catchAsync(async (req, res, next) => {
  let query = NguoiDung.findById(req.params.id);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAllUsers = factory.getAll(NguoiDung, 'quyen');

exports.changeAvatar = catchAsync(async (req, res, next) => {
  console.log("Check req.params: ", req.params);
  console.log("Check req.body: ", req.body);
  const nguoiDung = await NguoiDung.findById(req.params.id);
  if (nguoiDung) {
    if (nguoiDung.anhDaiDien.url && req.body.anhDaiDien.url) {
      cloudinary.v2.uploader.destroy(nguoiDung.anhDaiDien.public_id, function (error, result) {
        // if (error) return res.json({ success: false, message: 'Something went wrong!' })
      });
      nguoiDung.anhDaiDien = req.body.anhDaiDien;
      if (nguoiDung.quyen) {
        nguoiDung.quyen = nguoiDung.quyen._id
      }
      console.log("Check nguoiDung: ", nguoiDung);
      await nguoiDung.save();
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Avatar changed'
  });
});

// Do NOT update passwords with this!
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = req.body;
  if (user.quyen?._id) {
    user.quyen = user.quyen._id
  }
  if (user.matKhau) {
    delete user.matKhau
  }
  if (user.xacNhanMatKhau) {
    delete user.xacNhanMatKhau
  }

  var doc = await NguoiDung.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.statisticsUserInWeek = catchAsync(async (req, res, next) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const lastWeekDate = moment().subtract(7, 'days').format('YYYY-MM-DD');

  const data = await NguoiDung.aggregate([
    {
      $unwind: '$thoiGianTao'
    },
    {
      $match: {
        thoiGianTao: {
          $gte: new Date(lastWeekDate),
          $lte: new Date(currentDate),
        },
      },
    },
    {
      $sort: {
        thoiGianTao: -1
      }
    },
    {
      $project: {
        day: {
          $dayOfMonth: "$thoiGianTao"
        },
        month: {
          $month: "$thoiGianTao"
        },
        year: {
          $year: "$thoiGianTao"
        },
      },
    },
    {
      $group: {
        _id: {
          day: "$day",
          year: "$year",
          month: "$month",
        },
        count: {
          $sum: 1
        },
      },
    },
    {
      $project: {
        _id: 0,
        day: "$_id.day",
        month: "$_id.month",
        year: "$_id.year",
        count: "$count",
      },
    },
  ]);

  if (!data) {
    return next(new AppError('No statistics found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: data
  });
});

exports.deleteUser = factory.deleteOne(NguoiDung);
