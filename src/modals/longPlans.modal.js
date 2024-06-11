import mongoose from "mongoose";

const plansSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    progress:{
        type: Number,
    },
    milestones:{
       type: [String],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },

}, { timestamps: true });

const Plans = mongoose.model("Plans", plansSchema);

export { Plans };
