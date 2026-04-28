import mongoose,{Schema,model} from "mongoose"

const portfolioSchema = new Schema({
  designer: {
    type:mongoose.Schema.Types.ObjectId,
    ref:      'Designer', 
    required: true
  },
  image: {
    url:      { type: String, required: true },
    publicId: { type: String, required: true }
  },
  description: {
    type:      String,
    required:  true,
    maxlength: 500
  }
}, { timestamps: true })

const designerPortfolio = model("Portfolio",portfolioSchema)

export default designerPortfolio;