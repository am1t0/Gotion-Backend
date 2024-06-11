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
  description:{
    type: String,
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
  members: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      default: null,
    },
    isAccepted:{
      type:Boolean,
      default:false
    }
  }],

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

}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export { Project };