if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Joi = require('joi');
const {postSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const bodyParser= require('body-parser')
const whoisinfo=require('whois-json')
const moment = require('moment')
const isValidDomain = require('is-valid-domain')
const mongoSanitize = require('express-mongo-sanitize');
const userPost = require('./models/posts');
const Review = require('./models/review');
const userRoute = require('./routes/users');
const postRoute = require('./routes/postRoute');
const reviewsRoute = require('./routes/reviews');
const domainRoute = require('./routes/domainRoutes');

const { StringDecoder } = require('string_decoder');

const {isLoggedIn,isAuthor,validatePost} = require('./middleware');
const spawn = require("child_process").spawn;
const { json } = require('express');
const catchAsync = require('./utils/catchAsync.js');

// var obj;

mongoose.connect('mongodb://localhost:27017/user-post',{
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const app = express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoute);
app.use('/posts',postRoute);
app.use('/posts/:id/reviews',reviewsRoute);
//app.use('/domain',domainRoute);

// router.get('/',catchAsync(async (req,res)=>{
   
    
//     if(req.query.search){
//         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//         const posts = await userPost.find({title: regex});
        
        
//         res.render('Posts/index',{posts});

        
//     }else{
        
//         const posts = await userPost.find({});
//         res.render('Posts/index',{posts});
//     }
// }));


app.get('/', catchAsync(async(req,res)=>{

    const posts = await userPost.find({});
    const arr = posts.reverse();
    console.log(arr[0].image[0].url);
    res.render('home',{posts});
}))

app.get('/about', (req,res)=>{
    res.render('About')
})

//----domain routes----//

app.get('/domain',isLoggedIn,(req,res)=>{
    res.render('domainwhoisinfo',{title:
        "Whois Lookup Info Domain Availability & Registrar Checker - FreeMediaTools.com",
      data: '',
      flag: false,
      date: '',
      domainAge: '',
    }) //name of the ejs file that is in views folder 
})

app.post('/domainwhoisinfo',isLoggedIn,async(req,res)=>{
    var domain = req.body.domain;
    console.log(domain)
    //now checking if the domain is valid or not 
    //using isValidDomain function 
    if(isValidDomain(domain)){

    //now getting the whois info 
    var results = await whoisinfo(domain); //await is only valid in async 
    console.log(results)
    //passing data 
    var date = moment(results.creationDate).format("YYYY-MM-DD");
  var currentDate = moment(new Date()).format("YYYY-MM-DD");

  console.log(date);
  console.log(currentDate);

  var a = moment(date);
  var b = moment(currentDate);

  var years = b.diff(a, "year");
  a.add(years, "years");

  var months = b.diff(a, "months");
  a.add(months, "months");

  var days = b.diff(a, "days");

  var domainAge = years + " years " + months + " months " + days + " days";

  console.log(years);
  console.log(months);
  console.log(days);

  //console.log(year + "-" + month + "-" + dt);

  res.render("domainwhoisinfo", {
    title:
      "Whois Lookup Info Domain Availability & Registrar Checker - FreeMediaTools.com",
    data: results,
    flag: true,
    date: date,
    domainAge: domainAge,
  });


    }
    else
    {   
        req.flash('error', 'Please Enter complete name (e.g someWebsite.com)');

        res.redirect('/domain');
    }
})

//----domain routes----//
//-------------------------------------------------//
//const pythonProcess = spawn('python3',["scape.py"]);

//----scrape Routes----//

app.get('/scrape',isLoggedIn,(req,res)=>{
    res.render('scrapePage', {d:'',img:''})
})

app.post('/scrapePage',isLoggedIn, async(req,res)=>{
    var product = req.body.product;
    const childPython = spawn('python',['scape.py',product]);
    childPython.stdout.on('data',(data)=>{
        
            var d = new StringDecoder('utf8');
           
            
            s = d.write(data);
            var productList = s.split("@");
            
          
            //const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
            //console.log(productList)

            var cleanProductList = [];
            var imgList = [];
            for(var i = 0; i < productList.length; i++)
            {
                    
                var imgIndex = productList[i].indexOf("ImgURL");
                var productNoImage = productList[i].substring(0,imgIndex);
                cleanProductList.push(productNoImage);
                    
                var imgStart = productList[i].indexOf("^");
                var image1 = productList[i].substring(imgStart+1,);
                var image = image1.trim();
                imgList.push(image);
                    
            }
            cleanProductList.pop();
            imgList.pop()
            console.log(cleanProductList);
            
                
            res.render("scrapePage",{d:cleanProductList, img:imgList});
                
        
        

    });
    
    childPython.stderr.on('data',(data)=>{
        console.error(`stderr: ${data}`);
        
    });
    
    
    childPython.on('close',(code)=>{
        console.log(`child process exit with: ${code}`);
        

        
    });
})
//----scrape Routes----//



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no, something went wrong!'
    res.status(statusCode).render('error',{err});
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})

//const arrays = output.split("\n").map(out => JSON.parse(out));

