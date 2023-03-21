const express = require('express');
const nguoiDungController = require('../controllers/nguoiDungController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.restrictTo('Admin'));

router
    .route('/updateUser')
    .patch(nguoiDungController.updateUser);

module.exports = router;
