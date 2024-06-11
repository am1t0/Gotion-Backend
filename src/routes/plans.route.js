import { Router } from "express";
import { createPlan, updatePlan, deletePlan, getUserPlans } from '../controllers/plans.controller.js';
import { veryfyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-plan').post(veryfyJWT,createPlan);

router.route('/update-plan/:id').patch(veryfyJWT,updatePlan);

router.route('/delete-plan/:id').delete(veryfyJWT,deletePlan);

router.route('/get-plans').get(veryfyJWT,getUserPlans);

export default router;