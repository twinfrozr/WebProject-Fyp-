const express = require('express');
const router = express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isReviewAuthor} =require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const userPost = require('../models/posts');
const Review = require('../models/review');
const postReviews = require('../controllers/reviewRoutes')

router.post('/',isLoggedIn, validateReview,catchAsync(postReviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(postReviews.deleteReview));

module.exports = router; 