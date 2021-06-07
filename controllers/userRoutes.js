const User = require('../models/user');

module.exports.renderRegister = (req,res) =>{
    if(req.isAuthenticated()){
        //res.render('users/register');
        res.redirect('/posts');
    }
    res.render('users/register');
}

module.exports.register = async(req,res)=>{
    try{

        const {email,username,password} = req.body;
        const user = new User({email,username});
        if(req.body.adminCode === 'secretcode123'){
            user.isAdmin = true;
        }
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelp camp!');
            res.redirect('/posts');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}
module.exports.renderLogin = (req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/posts');
        //res.render('users/login');
    }
    res.render('users/login');
    
}

module.exports.login = (req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/posts');

}