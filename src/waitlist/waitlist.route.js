import express from "express"
import WaitListController from "./waitlist.controller"

const waitlistRouter = express.Router()

waitlistRouter.use(express.json());
waitlistRouter.use(express.urlencoded())
