const express = require('express');
const tinYeuThichController = require('../controllers/tinYeuThichController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/getListTinYeuThich')
    .get(tinYeuThichController.getListTinYeuThich);

router
    .route('/themTinYeuThich')
    .get(tinYeuThichController.themTinYeuThich);

router
    .route('/xoaTinYeuThich')
    .get(tinYeuThichController.xoaTinYeuThich);

module.exports = router;
