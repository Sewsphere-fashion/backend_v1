import AppError from "../errorHandlers/appError.js";

const validate = (schema) =>(req,res,next)=>{
    const {error,value}= schema.validate(req.body,{
        abortEarly:false, //collects all the error
        stripUnknown:true
    });
    if(error){
        // Extract detailed error messages from Joi validaton schema
        // and combines into one messsage and joins with ,
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(errorMessages, 400));
    }
    req.body = value
    next()
}

export default validate;