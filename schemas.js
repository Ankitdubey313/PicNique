const BaseJoi= require("joi");
const sanitizeHtml= require("sanitize-html")

const extension = (joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not include HTML'
    },

    rules:{

        escapeHTML:{
            validate(value,helpers){
                const clean =sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });

                if(clean!==value) return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }

    }
});

const Joi=BaseJoi.extend(extension);
module.exports.campgroundSchema= Joi.object({

        // validate campground is our middle ware defining it seperately because it will be used numerous times

    campground: Joi.object({
        title:Joi.string().required().escapeHTML(),
        // image:Joi.string().required(),
        location:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        description:Joi.string().required().escapeHTML()
        
    }).required(),

    deleteImages: Joi.array()
}); // all these validations is done through JOi before mongoose can even do its job


// the advantage of creating JOI validation is that no one can create invalid campground even if he bypasses client side validation , for example from postman

module.exports.reviewSchema= Joi.object({


    review: Joi.object({
    rating:Joi.number().required(),
    body:Joi.string().required().escapeHTML()
    
}).required()
});