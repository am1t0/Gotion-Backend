import {Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { createTask ,updateTask,deleteTask, getTasks} from "../controllers/tasks.controller.js";

const router = Router();

router.route('/create-task/:projectId').post(veryfyJWT,createTask);

router.route('/update-task/:ownerId/:taskId').post(veryfyJWT,updateTask);

router.route('/task-delete/:ownerId/:taskId').delete(veryfyJWT,deleteTask);

router.route('/getTasks/:projectId').get(veryfyJWT,getTasks);

export default router;