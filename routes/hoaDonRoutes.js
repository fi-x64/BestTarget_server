const express = require('express');
const hoaDonController = require('../controllers/hoaDonController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/getHoaDonByUserId')
    .get(hoaDonController.getHoaDonByUserId);

router.use(authController.restrictTo('Admin'));

router
    .route('/getAllHoaDon')
    .get(hoaDonController.getAllHoaDon);

module.exports = router;
