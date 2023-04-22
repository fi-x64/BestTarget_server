const express = require('express');
const lichSuTimKiemController = require('../controllers/lichSuTimKiemController');

const router = express.Router();

router
    .route('/getLichSuTimKiemByUserId')
    .get(lichSuTimKiemController.getLichSuTimKiemByUserId);

// router
//     .route('/getOneMenhGia')
//     .get(menhGiaController.getOneMenhGia);

router
    .route('/createLichSuTimKiem')
    .post(lichSuTimKiemController.createLichSuTimKiem);

router
    .route('/deleteAllLichSuTimKiem')
    .delete(lichSuTimKiemController.deleteAllLichSuTimKiem);

module.exports = router;
