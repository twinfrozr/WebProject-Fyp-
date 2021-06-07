const express = require('express');
const router = express.Router();
const postRoutes = require('../controllers/postRoutes');
const catchAsync = require('../utils/catchAsync');
const userPost = require('../models/posts');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {isLoggedIn,isAuthor,validatePost} = require('../middleware');

// router.get('/',function(req,res){
//     eval(require('locus'));
    
    
//     userPost.find({},function(err,allPosts){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("Posts/index",{posts:allPosts});
//         }
//     });
    
// });

router.get('/',catchAsync(async (req,res)=>{
   
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const posts = await userPost.find({title: regex});
        
        
        res.render('Posts/index',{posts});

        
    }else{
        
        const posts = await userPost.find({});
        res.render('Posts/index',{posts});
    }
}));

router.get('/',catchAsync(postRoutes.index))

router.post('/',isLoggedIn,upload.array('image'),validatePost,catchAsync(postRoutes.createPost));
    
router.get('/new', isLoggedIn,postRoutes.renderNewForm);

router.route('/:id')
    .get(catchAsync(postRoutes.showPosts))
    .put(isLoggedIn,isAuthor,upload.array('image') ,validatePost, catchAsync(postRoutes.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(postRoutes.deletePost));


router.get('/:id/edit',isLoggedIn, isAuthor,catchAsync(postRoutes.renderEditForm));


//router.put('/:id',isLoggedIn,isAuthor, validatePost, catchAsync(postRoutes.updatePost)); 

//router.delete('/:id',isLoggedIn, isAuthor, catchAsync(postRoutes.deletePost));
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;