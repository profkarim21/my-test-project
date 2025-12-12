import { Router } from "express";
const router = Router();
import * as us from './user.controller.js'
router.post('/add',us.addUser)
router.get ('/',us.getUsers)
router.put('/',us.updateUser)   


export default router;
