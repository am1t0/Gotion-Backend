import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
         required: true,
    },
    due: {
        type: String,
        required:true,
    },
    priority:{
        type: String,
        required: true,
    }

}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export { Task };
