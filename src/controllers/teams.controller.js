import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { Team } from '../modals/team.modal.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js'

// creating the team
const createTeam =  asyncHandler(async (req, res) => {

    try {
      const { name,description } = req.body;
      const owner = req.user._id; // Assuming user information is available in the request after authentication
  
      const newTeam = await Team.create({
        name,
        description,
        owner,
        members: [owner], // Owner is initially added as a member
        projects: [], // Empty array to start with no projects
      });
  
      return res.status(201).json(new ApiResponse(201,newTeam,"Team created Successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Update Team Details
const updateTeam = asyncHandler(async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, description } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner or has admin privileges
    if (team.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to update this team');
    }

    // Update team details
    team.name = name;
    team.description = description;
    const updatedTeam = await team.save();

    return res.status(200).json(new ApiResponse(200, updatedTeam, 'Team updated successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Member to Team
const addMemberToTeam = asyncHandler(async (req, res) => {
  try {
    const { teamId, memberId } = req.body;

    // Check if the team exists
    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (team.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to add members to this team');
    }

    // Check if the member user exists
    const memberUser = await User.findById(memberId);
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is already a part of the team
    if (team.members.includes(memberId)) {
      throw new ApiError(400, 'Member is already part of the team');
    }

    // Add the member to the team
    team.members.push(memberId);
    await team.save();

    return res.status(200).json(new ApiResponse(200, team, 'Member added to the team successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove Member from Team
const removeMemberFromTeam = asyncHandler(async(req, res) => {
  try {
    const { teamId, memberId } = req.body;

    // Check if the team exists
    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (team.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to remove members from this team');
    }

    // Check if the member user exists
    const memberUser = await User.findById(memberId);
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is part of the team
    if (!team.members.includes(memberId)) {
      throw new ApiError(400, 'Member is not part of the team');
    }

    // Remove the member from the team
    team.members.pull(memberId);
    await team.save();

    return res.status(200).json(new ApiResponse(200, team, 'Member removed from the team successfully'));
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Teams for User
const getTeamsForUser = asyncHandler( async (req, res) => {
  try {
    const userId = req.user._id;

    // Find teams where the user is the owner or a member
    const teams = await Team.find({ $or: [{ owner: userId }, { members: userId }] });

    return res.status(200).json(new ApiResponse(200, teams, 'Teams retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


export {createTeam,addMemberToTeam ,removeMemberFromTeam ,getTeamsForUser,updateTeam};
  