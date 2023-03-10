const express = require('express');
const nguoiDungController = require('../controllers/nguoiDungController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', nguoiDungController.getMe, nguoiDungController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', nguoiDungController.updateMe);
router.delete('/deleteMe', nguoiDungController.deleteMe);

router
  .route('/getAllTinhThanh')
  .get(nguoiDungController.getAllTinhThanh);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(nguoiDungController.getAllUsers)
  .post(nguoiDungController.createUser);

router
  .route('/:id')
  .get(nguoiDungController.getUser)
  .patch(nguoiDungController.updateUser)
  .delete(nguoiDungController.deleteUser);

module.exports = router;
