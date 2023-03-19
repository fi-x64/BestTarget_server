const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('Người dùng'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('Người dùng', 'Admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('Người dùng', 'Admin'),
    reviewController.deleteReview
  );

module.exports = router;
