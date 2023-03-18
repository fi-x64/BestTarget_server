const NguoiDung = require('../models/nguoiDungModel');
const TinhTP = require('../models/tinhTPModel');
const QuanHuyen = require('../models/quanHuyenModel');
const PhuongXa = require('../models/phuongXaModel');
const Quyen = require('../models/quyenModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

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
  console.log("Check req: ", req.params);
  let query = NguoiDung.findById(req.params.id).populate('quyen');
  // query = query.populate({ path: 'diaChi.tinhTPCode', select: 'ten code' }).populate({ path: 'diaChi.quanHuyenCode', select: 'ten code' }).populate({ path: 'diaChi.phuongXaCode', select: 'ten code' });

  // let query = NguoiDung.aggregate([
  //   { $match: { _id: objectId } },
  //   { $lookup: { from: 'tinhTP', localField: 'diaChi.tinhTPCode', foreignField: '_id', as: 'tinhTPData' } },
  //   {
  //     $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$tinhTPData", 0] }, "$$ROOT"] } }
  //   },
  //   // { $project: { tinhTPData: 0 } }
  // ])

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  // let phuongXaData = await PhuongXa.findById(doc.diaChi[0].phuongXaCode).select('ten');
  // for (var i = 0; i < doc.diaChi.length; i++) {
  //   console.log("Check phuongXaData: ", phuongXaData);
  //   // doc.diaChi[i] = phuongXaData;
  //   doc.diaChi[i].phuongXaCode = [];
  //   Object.assign(doc.diaChi[i].phuongXaCode, phuongXaData);
  //   // doc.diaChi[i].phuongXaName = phuongXaData;
  // }
  // doc.diaChi.map(async (value, index) => {
  //   phuongXaData = await PhuongXa.findById(value.phuongXaCode).select('ten');
  //   return value.phuongXaName = phuongXaData.ten;
  //   // Object.assign(value, phuongXaData.ten);
  //   // const quanHuyenData = await PhuongXa.findById(value.quanHuyenCode);
  //   // value.quanHuyenName = quanHuyenData.ten;
  //   // const tinhTPData = await PhuongXa.findById(value.tinhTPCode);
  //   // value.tinhTPName = tinhTPData.ten;

  // })

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAllUsers = factory.getAll(NguoiDung);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(NguoiDung);
exports.deleteUser = factory.deleteOne(NguoiDung);
