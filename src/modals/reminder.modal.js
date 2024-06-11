import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
         required: true,
    },
    time: {
        type: String,
        required:true,
    },
    location:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },

}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);

export { Reminder };
