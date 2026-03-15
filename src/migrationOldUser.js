import Waitlist from "./waitlist/waitlist.model.js";
import connectDb from "./config/db.js";

const migrateOldUsers = async () => {
  try {

    await connectDb()
    const result = await Waitlist.updateMany(
      { notified: { $exists: false } }, // users without notified field
      { $set: { notified: false } }     // set notified to false
    );

    console.log(`Migrated ${result.modifiedCount} old users.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateOldUsers();