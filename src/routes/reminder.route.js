import { Router } from "express";
import {createReminder, updateReminder, deleteReminder, getUserReminders} from '../controllers/reminder.controller.js';
import { veryfyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-reminder').post(veryfyJWT,createReminder);

router.route('/update-reminder/:id').patch(veryfyJWT,updateReminder);

router.route('/delete-reminder/:id').delete(veryfyJWT,deleteReminder);

router.route('/get-reminders').get(veryfyJWT,getUserReminders);

export default router;