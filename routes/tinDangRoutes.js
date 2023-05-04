const express = require('express');
const tinDangController = require('../controllers/tinDangController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/getAllPostsNewest')
    .get(tinDangController.getAllPostsNewest);

router
    .route('/getAllTinDangByUserId')
    .get(tinDangController.getAllTinDangByUserId);

router
    .route('/getAllTinDangRelated')
    .post(tinDangController.getAllTinDangRelated);

router
    .route('/createPost')
    .post(tinDangController.createTinDang);

router
    .route('/editPost')
    .patch(tinDangController.editTinDang);

router
    .route('/getGoiY')
    .get(tinDangController.getGoiY);

router
    .route('/countTrangThaiTin')
    .get(tinDangController.countTrangThaiTin);

router
    .route('/getTinDang')
    .post(tinDangController.getTinDang);

router
    .route('/getTinDangId')
    .get(tinDangController.getTinDangId);

router
    .route('/deleteImage')
    .patch(tinDangController.deleteImage);

router
    .route('/deleteVideo')
    .patch(tinDangController.deleteVideo);

router
    .route('/getTinDangByValue')
    .post(tinDangController.getTinDangByValue)

router
    .route('/updateTinHetHan')
    .get(tinDangController.updateTinHetHan)

router.use(authController.protect);

router
    .route('/statisticsPostInWeekByUserId')
    .get(tinDangController.statisticsPostInWeekByUserId)

router.use(authController.restrictTo('Admin'));

router
    .route('/getAllPosts')
    .get(tinDangController.getAllPosts);

router
    .route('/getTinDangIdRestrict')
    .get(tinDangController.getTinDangIdRestrict);

router
    .route('/statisticsPostInWeek')
    .get(tinDangController.statisticsPostInWeek)

router
    .route('/statisticsPostInProvince')
    .get(tinDangController.statisticsPostInProvince)

module.exports = router;