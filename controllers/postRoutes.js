const userPost = require('../models/posts');
const {cloudinary} = require("../cloudinary");

// module.exports.index = async (req,res)=>{
//     //eval(require('locus'));
    
    
//     const posts = await userPost.find({});
//     res.render('Posts/index',{posts})
// }

module.exports.renderNewForm = (req,res) =>{
    
    res.render('Posts/new');
}

module.exports.createPost = async (req, res, next)=>{
    //if(!req.body.post) throw new ExpressError('Invalid Post Data', 400);
    const post = new userPost(req.body.post);
    post.image = req.files.map(f=>({url: f.path, filename: f.filename}));
    
    post.author = req.user._id;
    await post.save();
    console.log(post);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/posts/${post._id}`)
    
}

module.exports.showPosts = async(req,res)=>{
    const posts = await userPost.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    
    console.log(posts);
    if(!posts){
        req.flash('error','Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('Posts/show', { posts });
}

module.exports.renderEditForm = async(req,res)=>{
    const {id}=req.params;
    const posts = await userPost.findById(id);
    if(!posts){
        req.flash('error','Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('Posts/edit', { posts });

}

module.exports.updatePost = async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const post = await userPost.findByIdAndUpdate(id,{...req.body.post});
    const imgs= req.files.map(f=>({url: f.path, filename: f.filename}));
    post.image.push(...imgs);
    await post.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
        console.log(post);
    }
    
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`)
}

module.exports.deletePost = async(req,res)=>{
    
    const {id} = req.params;
    await userPost.findByIdAndDelete(id);
    res.redirect('/posts')
}