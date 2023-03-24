const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const nguoiDungSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  anhDaiDien: {
    url: {
      type: String
    },
    public_id: {
      type: String
    },
  },
  matKhau: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  xacNhanMatKhau: {
    type: String,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.matKhau;
      },
      message: 'Passwords are not the same!'
    }
  },
  sdt: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your phonenumber!']
  },
  gioiTinh: {
    type: String,
    enum: ['M', 'F', 'Other'],
    default: 'Other'
  },
  diaChi:
  {
    kinhDo: Number,
    viDo: Number,
    soNha: String,
    phuongXaCode: {
      // type: mongoose.Schema.ObjectId,
      // ref: 'phuongXa'
      type: String
    },
    quanHuyenCode: {
      // type: mongoose.Schema.ObjectId,
      // ref: 'quanHuyen'
      type: String
    },
    tinhTPCode: {
      // type: mongoose.Schema.ObjectId,
      // ref: 'tinhTP'
      type: String
    },
  },
  quyen: {
    // type: String,
    // enum: ['user', 'admin', 'manager'],
    // default: 'user'
    type: mongoose.Schema.ObjectId, ref: 'Quyen'
  },
  trangThai: {
    type: Boolean,
    default: false
  },
  thoiGianChinhSua: Date,
  thoiGianDoiMatKhau: Date,
  tokenDatLaiMatKhau: String,
  hanDatLaiMatKhau: Date,
  thoiGianTao: { type: Date, default: Date.now },
},
  {
    strict: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

nguoiDungSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('matKhau')) return next();

  // Hash the password with cost of 12
  this.matKhau = await bcrypt.hash(this.matKhau, 12);

  // Delete passwordConfirm field
  this.xacNhanMatKhau = undefined;
  next();
});

nguoiDungSchema.pre('save', function (next) {
  if (!this.isModified('matKhau') || this.isNew) return next();

  this.thoiGianDoiMatKhau = Date.now() - 1000;
  next();
});

// nguoiDungSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.find({ trangThai: { $ne: false } });
//   next();
// });

nguoiDungSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find().populate('quyen');
  next();
});

nguoiDungSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

nguoiDungSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.thoiGianDoiMatKhau) {
    const changedTimestamp = parseInt(
      this.thoiGianDoiMatKhau.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

nguoiDungSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.tokenDatLaiMatKhau = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.tokenDatLaiMatKhau);

  this.hanDatLaiMatKhau = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema);

module.exports = NguoiDung;
