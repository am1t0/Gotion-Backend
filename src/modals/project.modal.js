import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  projectOverview: {
    type: String,
    required: true,
  },
  projectObjectives:{
    type: [String], 
    required: true,
  },
  techStack:{
    type: [String], 
    required: true,
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
  announcements: {
    type: [String], 
    required: false,
  },

  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
  theme:{
    type: String
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
 
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export { Project };