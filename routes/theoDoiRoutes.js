const express = require('express');
const theoDoiController = require('../controllers/theoDoiController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/getListDangTheoDoi')
    .get(theoDoiController.getListFollowing);

router
    .route('/getListNguoiTheoDoi')
    .get(theoDoiController.getListFollower);

router.use(authController.protect);

router
    .route('/getListLoggedDangTheoDoi')
    .get(theoDoiController.getListLoggedFollowing);

router
    .route('/getListLoggedNguoiTheoDoi')
    .get(theoDoiController.getListLoggedFollower);

router
    .route('/themTheoDoi')
    .get(theoDoiController.themTheoDoi);

router
    .route('/xoaTheoDoi')
    .get(theoDoiController.xoaTheoDoi);

module.exports = router;
