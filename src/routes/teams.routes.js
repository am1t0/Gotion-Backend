import {Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { createTeam, addMemberToTeam ,removeMemberFromTeam,getTeamsForUser, updateTeam} from "../controllers/teams.controller.js";

const router = Router();

router.route("/create-team").post(veryfyJWT,createTeam)

router.route("/add-members").post(veryfyJWT,addMemberToTeam)

router.route("/remove-members").post(veryfyJWT,removeMemberFromTeam)

router.route("/teams-for-user").get(veryfyJWT,getTeamsForUser)

router.route("/update-team/:teamId").post(veryfyJWT,updateTeam)

export default router