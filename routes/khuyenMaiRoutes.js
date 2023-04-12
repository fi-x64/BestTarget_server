const express = require('express');
const khuyenMaiController = require('../controllers/khuyenMaiController');

const router = express.Router();

router
    .route('/getAllKhuyenMai')
    .get(khuyenMaiController.getAllKhuyenMai);

router
    .route('/getOneKhuyenMai')
    .get(khuyenMaiController.getOneKhuyenMai);

router
    .route('/getAppliedKhuyenMai')
    .get(khuyenMaiController.getAppliedKhuyenMai);

router
    .route('/createKhuyenMai')
    .post(khuyenMaiController.createKhuyenMai);

router
    .route('/editKhuyenMai')
    .post(khuyenMaiController.editKhuyenMai);

router
    .route('/deleteKhuyenMai')
    .delete(khuyenMaiController.deleteKhuyenMai);

module.exports = router;
