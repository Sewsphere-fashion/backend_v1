import connectDb from "../config/db.js";
import designer from "../Designer/designerProfile/designerProfile.model.js";

const createIndex = async()=>{
  try{
    await connectDb()
    await designer.collection.createIndexes([
      {key:{location:1}},
      {key:{country:1}}
    ])
    console.log("index created successfully");
    

    await designer.collection.indexes()
    console.log(await designer.collection.indexes());
    
  }
  catch(err){
    console.log('error creating index');
  }
}

createIndex()