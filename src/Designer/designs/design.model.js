import {Schema,model} from "mongoose"

const designSchema = new Schema({
    designerId : {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
  category: {
  type: String,
  enum: [
    "Tops",
    "Bottoms",
    "Dresses",
    "Skirts",
    "Outerwear",
    "Footwear",
    "Accessories",
    "Activewear",
    "Ankara & Print Wear",
    "Agbada & Kaftan",
    "Aso-Ebi",
    "Bridal & Wedding",
    "Full Outfit"
  ],
  required: true
}
},
{timestamps:true})

const design = model("Design",designSchema)

export default design;