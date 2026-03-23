import mongoose from "mongoose";
import User from "./Users/user.model.js";
import bcrypt from "bcrypt";
// import config from "./config/config.js";
import connectDb from "./config/db.js";



// const dummy =()=>{

// }
connectDb()

const  createDummyUsers = async() => {
  const password = "Test123!"; 
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [];

  for (let i = 6; i <= 10; i++) { 
    users.push({
      firstName: `Test${i}`,
      lastName: "User",
      email: `test${i}+dummy@yourdomain.com`,
      password: hashedPassword,
      role: "client",
      isVerified: true
    });
  }

  try {
    await User.insertMany(users);
    console.log("Dummy users created successfully!");
  } catch (err) {
    console.error("Error creating users:", err);
  } finally {
    mongoose.disconnect();
  }
}

createDummyUsers();