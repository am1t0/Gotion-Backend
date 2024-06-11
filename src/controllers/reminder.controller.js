import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js'
import { Reminder } from '../modals/reminder.modal.js';

// Controller for creating a reminder
const createReminder = asyncHandler(async (req, res) => {
    try {
        // Extract reminder details from request body
        const { title, description, date, time, location, tag } = req.body;
        const userId = req.user._id; // Assuming user information is stored in req.user

        // Validate required fields
        if (!title || !description || !date || !time || !location) {
            return res.status(400).json({ error: 'All fields are required except tag' });
        }

        // Create the reminder
        const newReminder = new Reminder({
            title,
            description,
            date,
            time,
            location,
            tag,
            createdBy: userId,
        });

        // Save the reminder
        await newReminder.save();

        // Return success response
        return res.status(201).json({ message: 'Reminder created successfully', reminder: newReminder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Controller for updating a reminder
const updateReminder = asyncHandler(async (req, res) => {
    try {
        // Extract reminder ID from request params
        const { id } = req.params;
        const { title, description, date, time, location, tag } = req.body;
        const userId = req.user._id; // Assuming user information is stored in req.user

        // Find the reminder by ID
        const reminder = await Reminder.findById(id);

        // Check if reminder exists
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // Check if the user is the creator of the reminder
        if (reminder.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Update the reminder fields
        reminder.title = title || reminder.title;
        reminder.description = description || reminder.description;
        reminder.date = date || reminder.date;
        reminder.time = time || reminder.time;
        reminder.location = location || reminder.location;
        reminder.tag = tag || reminder.tag;

        // Save the updated reminder
        const updatedReminder = await reminder.save();

        // Return success response
        return res.status(200).json({ message: 'Reminder updated successfully', reminder: updatedReminder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const deleteReminder = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const reminder = await Reminder.findById(id);

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // the owner can only delete there reminders
        if (reminder.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        //removing reminder from database
        await reminder.deleteOne({_id:id});

        return res.status(200).json({ message: 'Reminder deleted successfully' ,reminder});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getUserReminders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find reminders created by the user
        const reminders = await Reminder.find({ createdBy: userId });

        return res.status(200).json({ reminders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { createReminder, updateReminder, deleteReminder, getUserReminders };
