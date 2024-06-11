import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js'
import { Plans } from '../modals/longPlans.modal.js';

// Controller for creating a plan
const createPlan = asyncHandler(async (req, res) => {
    try {
        const { tag, duration, title, description, milestones } = req.body;
        const userId = req.user._id;

        const newPlan = new Plans({
            tag,
            duration,
            title,
            description,
            milestones,
            createdBy: userId,
        });

        await newPlan.save();

        return res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Controller for updating a plan
const updatePlan = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { tag, duration, title, description, milestones } = req.body;
        const userId = req.user._id;

        const plan = await Plans.findById(id);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        if (plan.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        plan.tag = tag || plan.tag;
        plan.duration = duration || plan.duration;
        plan.title = title || plan.title;
        plan.description = description || plan.description;
        plan.milestones = milestones || plan.milestones;

        const updatedPlan = await plan.save();

        return res.status(200).json({ message: 'Plan updated successfully', plan: updatedPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Controller for deleting a plan
const deletePlan = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const plan = await Plans.findById(id);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        if (plan.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await plan.deleteOne({_id:id});

        return res.status(200).json({ message: 'Plan deleted successfully' , plan});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Controller for getting all plans for a particular user
const getUserPlans = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find plans created by the user
        const plans = await Plans.find({ createdBy: userId });

        return res.status(200).json({ plans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { createPlan, updatePlan, deletePlan, getUserPlans };
