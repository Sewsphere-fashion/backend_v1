import express from "express";

const pingRoute = express.Router()

pingRoute.get("/ping",(req,res)=>{
    res.status(200).json({status : "alive"})
})
export default pingRoute;
