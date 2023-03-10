const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TinhTP = require('./../../models/tinhTPModel');
const QuanHuyen = require('./../../models/quanHuyenModel');
const PhuongXa = require('./../../models/phuongXaModel');
const Quyen = require('./../../models/quyenModel');
const NguoiDung = require('./../../models/nguoiDungModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tinhTP = JSON.parse(fs.readFileSync(`${__dirname}/tinh_tp.json`, 'utf-8'));
const quanHuyen = JSON.parse(fs.readFileSync(`${__dirname}/quan_huyen.json`, 'utf-8'));
const phuongXa = JSON.parse(
  fs.readFileSync(`${__dirname}/xa_phuong.json`, 'utf-8')
);
const quyen = JSON.parse(
  fs.readFileSync(`${__dirname}/quyen.json`, 'utf-8')
);
const nguoiDung = JSON.parse(
  fs.readFileSync(`${__dirname}/nguoiDung.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await TinhTP.create(tinhTP);
    await QuanHuyen.create(quanHuyen);
    await PhuongXa.create(phuongXa);
    await Quyen.create(quyen);
    await NguoiDung.create(nguoiDung);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await TinhTP.deleteMany();
    await QuanHuyen.deleteMany();
    await PhuongXa.deleteMany();
    await Quyen.deleteMany();
    await NguoiDung.deleteMany();

    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
