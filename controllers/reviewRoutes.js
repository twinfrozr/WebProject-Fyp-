const userPost = require('../models/posts');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const post = await userPost.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const{id,reviewId} = req.params;
    await userPost.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted!');
    res.redirect(`/posts/${id}`);
}