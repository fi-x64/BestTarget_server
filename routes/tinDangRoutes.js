const express = require('express');
const tinDangController = require('../controllers/tinDangController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

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
    .get(tinDangController.getTinDang);

router
    .route('/getTinDangId')
    .get(tinDangController.getTinDangId);

router
    .route('/deleteImage')
    .patch(tinDangController.deleteImage);

router
    .route('/deleteVideo')
    .patch(tinDangController.deleteVideo);

router.use(authController.protect);
router.use(authController.restrictTo('Admin'));

router
    .route('/getAllPosts')
    .get(tinDangController.getAllPosts);

module.exports = router;