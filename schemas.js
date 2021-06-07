const Joi = require('joi');
module.exports.postSchema = Joi.object({
    post:Joi.object({
        title:Joi.string().required(),
        //image:Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        //rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

