import "dotenv/config"
import connectDb from "./src/config/db.js"
import designer from "./src/Designer/designerProfile/designerProfile.model.js";


// const rename = async()=>{
//   try{
//     await connectDb();
//     await designer.updateMany(
//       {},
//       {$rename:{'country':"state"}}
//     )
//         console.log("field renamed successfully");
//     process.exit(0);
//   }
//    catch (err) {
//     console.log("error renaming field", err);
//     process.exit(1);
//   }
// }

// rename()


const createIndex = async () => {
  try {
    
    await connectDb();
    console.log("connect edb",await connectDb());
    
    // await designer.collection.createIndexes([
    //   { key: { city: 1 } },
    //   { key: { state: 1 } },
    // ]);
    // console.log("index created successfully");
await designer.collection.dropIndex("country_1");
await designer.collection.dropIndex("location_1");
    await designer.collection.indexes();
    console.log(await designer.collection.indexes());
  } catch (err) {
    console.log("error creating index");
  }
};

createIndex();
