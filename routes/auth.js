import { registerUser } from "../controllers/authContoller.js";
import express from 'express'

export const authRouter = express.Router()

authRouter.post('/register', registerUser)