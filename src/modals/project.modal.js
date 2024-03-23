import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
    repo: {
      repoName: {
        type: String,
        required: false,
      },
      owner: {
        type: String,
        required: false,
      },
  },
  repoInitialized: {
    type: Boolean,
    default: false,
  },
  announcements: [],

  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
 
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export { Project };