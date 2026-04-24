import connectDb from "../config/db.js";
import User from "../Users/user.model.js";

const emailVerifiedAtMigration = async () => {
  try {
    await connectDb();
    const result = await User.updateMany({}, { $unset: { isVerified: "" } });
    console.log(`unset done`);
    process.exit(0);
  } catch (err) {
    console.log("error migrating");
    process.exit(1);
  }
};
emailVerifiedAtMigration();
