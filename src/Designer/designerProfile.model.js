import { Schema,model } from "mongoose";

const designerSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    speciality:{
        type:String,
        required:[true,"speciality is required"]
    },
    city:{
        type:String,
        required:[true,"city is required"],
    },
    country:{
        type:String,
        required:[true,"country is required"]
    },
    bio:{
        type:String,
        required:[true,"bio is required"]
    }
},
{timestamps:true})

const designer = model("Designer",designerSchema)

export default designer;