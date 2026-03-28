import Waitlist from "./waitlist/waitlist.model.js";
import connectDb from "./config/db.js";


const migrateOldUsers = async () => {
  try {

    await connectDb()
    const result = await Waitlist.updateMany(
      { role:"desginer", designerNotified: { $exists: false } }, // desingers without notified field
      { $set: { designerNotified: false } }     // set notified to false
    );
    const all = await Waitlist.find({ role: "designer" });
console.log(all);

    console.log(`Migrated ${result.modifiedCount} old users.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateOldUsers();