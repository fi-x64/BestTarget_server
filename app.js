const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cloudinary = require('cloudinary');
const schedule = require('node-schedule');
const http = require('http');
const socketIo = require('socket.io');
const io = require('./utils/socketio');
const mongoose = require('mongoose');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const nguoiDungRouter = require('./routes/nguoiDungRoutes');
const diaChiRouter = require('./routes/diaChiRoutes');
const danhMucRouter = require('./routes/danhMucRoutes');
const tinDangRouter = require('./routes/tinDangRoutes');
const timKiemRouter = require('./routes/timKiemRoutes');
const menhGiaRouter = require('./routes/menhGiaRoutes');
const goiDangKyRouter = require('./routes/goiDangKyRoutes');
const thanhToanRouter = require('./routes/thanhToanRoutes');
const theoDoiRouter = require('./routes/theoDoiRoutes');
const thongBaoRouter = require('./routes/thongBaoRoutes');
const tinYeuThichRouter = require('./routes/tinYeuThichRoutes');
const khuyenMaiRouter = require('./routes/khuyenMaiRoutes');
const managerRouter = require('./routes/managerRoutes');
const NguoiDung = require('./models/nguoiDungModel');
const { getAllThongBaoQuery } = require('./controllers/thongBaoController');

// const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// const server = http.createServer(app);
// const io = new socketIo.Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// server.listen(3001);

app.use(cors());
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

io.on('connection', (socket) => {
  socket.on('currentUserId', async (userId) => {
    const userData = await NguoiDung.findById(userId);
    socket.emit(`cuurentUserData_${userId}`, { userData });
  });
})

//Schedule tasks
//*/10 * * * * *
//0 0 1 * *
schedule.scheduleJob('*/0 0 1 * *', async function () {
  const values = {
    "goiTinDang": {
      id: '642d8cf41c396b8a219d01b2',
      soLuongTinDang: 10
    }
  }
  try {
    // Lấy tất cả các document trong collection của model
    const newNguoiDung = await NguoiDung.updateMany({}, values);
    if (newNguoiDung) {
      console.log("Reset dữ liệu gói thành công");
      io.sockets.emit('goiTinDang_updated', { status: "success" });
    }
  } catch (error) {
    console.log('Loi trong qua trinh reset so luong tin dang: ', error);
  }
});

// 3) ROUTES
app.use('/api/users', nguoiDungRouter);
app.use('/api/tinDang', tinDangRouter);
app.use('/api/timKiem', timKiemRouter);
app.use('/api/thongBao', thongBaoRouter);
app.use('/api/menhGia', menhGiaRouter);
app.use('/api/khuyenMai', khuyenMaiRouter);
app.use('/api/goiDangKy', goiDangKyRouter);
app.use('/api/theoDoi', theoDoiRouter);
app.use('/api/thanhToan', thanhToanRouter);
app.use('/api/diaChi', diaChiRouter);
app.use('/api/danhMuc', danhMucRouter);
app.use('/api/tinYeuThich', tinYeuThichRouter);
// app.use('/api/', managerRouter);

// app.use('/api/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// server.listen(3000);

app.use(globalErrorHandler);

module.exports = app;
