import {Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import {createProject,addTaskToProject} from "../controllers/projects.controller.js"


const router = Router();

router.route('/create-project').post(veryfyJWT,createProject);

router.route('/:projectId/create-tasks').post(veryfyJWT,addTaskToProject);


export default router;