const express = require('express');
const timKiemController = require('../controllers/timKiemController');

const router = express.Router({ mergeParams: true });

router
    .route('/handleTimKiem')
    .get(timKiemController.handleTimKiem);

module.exports = router;
