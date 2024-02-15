import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  // Other team member-related fields...
}, { timestamps: true });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export { TeamMember };