import mongoose from "mongoose"

const waitlistSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:["client","designer","interested"],
        default:"interested"
    },
    notified:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)

const Waitlist = mongoose.model("Waitlist",waitlistSchema)

export default Waitlist;