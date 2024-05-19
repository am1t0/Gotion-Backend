import {Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import {createProject,addTaskToProject, repoCheck, getProject, getCurrentProject,uploadTheme} from "../controllers/projects.controller.js"


const router = Router();

router.route('/create-project').post(veryfyJWT,createProject);

router.route('/:projectId/create-tasks').post(veryfyJWT,addTaskToProject);

router.route('/repoDetail').post(veryfyJWT,repoCheck);

router.route('/:projectId').get(veryfyJWT,getProject);

router.route('/currProject/:projectId').get(veryfyJWT,getCurrentProject)

router.route('/theme-upload/:projectId').post(veryfyJWT,upload.single('theme'),uploadTheme)

export default router;