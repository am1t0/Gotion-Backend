import {Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { createTeam, addMemberToTeam ,removeMemberFromTeam,getTeamsForUser, updateTeam, getProjects, deleteTeam,getAllmembers,getCurrentTeam} from "../controllers/teams.controller.js";

const router = Router();

router.route("/create-team").post(veryfyJWT,createTeam)

router.route("/add-members").post(veryfyJWT,addMemberToTeam)

router.route("/remove-members").post(veryfyJWT,removeMemberFromTeam)

router.route("/teams-for-user").get(veryfyJWT,getTeamsForUser)

router.route("/update-team/:teamId").post(veryfyJWT,updateTeam)

router.route("/projects/:teamId").get(veryfyJWT,getProjects);

router.route("/remove/:teamId").delete(veryfyJWT,deleteTeam);

router.route("/members/:teamId").get(veryfyJWT,getAllmembers);

router.route("/currTeam/:teamId").get(veryfyJWT, getCurrentTeam);

export default router