const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const userPost = require('../models/posts');
mongoose.connect('mongodb://localhost:27017/user-post',{
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await userPost.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 147);
        
        const camp = new userPost({
            author:'60717ff5c27a9716bc1a4778',
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, exercitationem quibusdam eius iure, recusandae sint sequi enim, eos veritatis facilis libero earum deleniti dignissimos nulla provident cumque consequuntur unde corrupti.',
            image:[
                {
                    url: 'https://res.cloudinary.com/dgrfrzcio/image/upload/v1617801399/YelpCamp/bb0djns9vmcdidwmiurc.jpg',
                    filename: 'YelpCamp/bb0djns9vmcdidwmiurc'
                },
                {

                    url: 'https://res.cloudinary.com/dgrfrzcio/image/upload/v1617801406/YelpCamp/efq1026bmwjombmvseuk.png',
                    filename: 'YelpCamp/efq1026bmwjombmvseuk'
                }
            ]

        })
        await camp.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
})