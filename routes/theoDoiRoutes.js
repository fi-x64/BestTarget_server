const express = require('express');
const theoDoiController = require('../controllers/theoDoiController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/themTheoDoi')
    .get(theoDoiController.themTheoDoi);

router
    .route('/xoaTheoDoi')
    .get(theoDoiController.xoaTheoDoi);

router
    .route('/getListDangTheoDoi')
    .get(theoDoiController.getListFollowing);

router
    .route('/getListNguoiTheoDoi')
    .get(theoDoiController.getListFollower);

module.exports = router;
