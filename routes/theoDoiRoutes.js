const express = require('express');
const theoDoiController = require('../controllers/theoDoiController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/getListDangTheoDoi')
    .get(theoDoiController.getListFollower);

router
    .route('/getListNguoiTheoDoi')
    .get(theoDoiController.getListFollowing);

router.use(authController.protect);

router
    .route('/getListLoggedDangTheoDoi')
    .get(theoDoiController.getListLoggedFollower);

router
    .route('/getListLoggedNguoiTheoDoi')
    .get(theoDoiController.getListLoggedFollowing);

router
    .route('/themTheoDoi')
    .get(theoDoiController.themTheoDoi);

router
    .route('/xoaTheoDoi')
    .get(theoDoiController.xoaTheoDoi);

module.exports = router;
