import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
    },
    deadline: {
        type: Date,
    },

}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export { Task };
