const {postSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const userPost = require('./models/posts');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next) =>{
    console.log("REQ.USER...", req.user);
    if(!req.isAuthenticated()){
        //store url which the user is requesting!
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePost = (req,res,next)=>{
    
    const {error} = postSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const post = await userPost.findById(id);
    if(post.author.equals(req.user._id) || req.user.isAdmin){
        next();
    }else{
        req.flash('error','You donot have permission to do that!');
        console.log("Bad!!!");
        return res.redirect(`/posts/${id}`);
    }
    
}
// module.exports.isAuthor = async(req,res,next)=>{
//     const {id}=req.params;
//     const post = await userPost.findById(id);
//     if(!post.author.equals(req.user._id)){
//         req.flash('error','You donot have permission to do that!');
//         return res.redirect(`/posts/${id}`);
//     }
//     next();
// }

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId);
    if(review.author.equals(req.user._id) || req.user.isAdmin){
        next();
    
    }
    else{
        req.flash('error','You donot have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    
}


// module.exports.isReviewAuthor = async(req,res,next)=>{
//     const {id,reviewId}=req.params;
//     const review = await Review.findById(reviewId);
//     if(!review.author.equals(req.user._id)){
//         req.flash('error','You donot have permission to do that!');
//         return res.redirect(`/posts/${id}`);
//     }
//     next();
// }

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

