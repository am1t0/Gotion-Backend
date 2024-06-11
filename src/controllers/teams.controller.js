import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { Team } from '../modals/team.modal.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js'
import {Project} from '../modals/project.modal.js';

// creating the team
const createTeam =  asyncHandler(async (req, res) => {

    try {
      const { name,description } = req.body;
      const owner = req.user._id; 
      
      const newTeam = await Team.create({
        name,
        description,
        owner,
        members: [{member:owner}], // Owner is initially added as a member
        projects: [], // Empty array to start with no projects
      });
  
      return res.status(201).json(new ApiResponse(201,newTeam,"Team created Successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const deleteTeam = asyncHandler(async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const userId = req.user._id; // Assuming user information is available in the request after authentication
  
      // Check if the user requesting the deletion is the owner of the team
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      console.log('User making the request : ', req.user._id);
      if (team.owner.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to delete this team' });
      }
      
      // Delete the team and send a success response
      await Team.deleteOne({ _id: teamId });
      return res.status(200).json(new ApiResponse(200,'Delete Happened', "Team deleted successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // get all the projects
  const getProjects = asyncHandler(async (req, res) => {
    try {
        const {teamId} =  req.params;
    
        const team = await Team.findById(teamId);
  
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
     
      // Populate the projects array to get project details
      //await team.populate('projects').execPopulate();
  
      // Extract relevant project details for response
      const projects = await Promise.all(team.projects.map(async (projectId) => {
        const projectDetails = await Project.findById(projectId);
        return projectDetails;
      }));
      return res.status(200).json(new ApiResponse(200, projects, 'Projects retrieved successfully'));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
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
    const { teamId, username } = req.body;
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
    const memberUser = await User.findOne({ username });
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is already a part of the team
    const isMemberExists = team.members.some(member => member.member.toString() === memberUser._id.toString());
    if (isMemberExists) {
      throw new ApiError(400, 'Member is already part of the team');
    }

    // Add the member to the team with default role
    team.members.push({ member: memberUser._id });

    await team.save();
    
    memberUser.isAccepted = false;

    return res.status(200).json(new ApiResponse(200, memberUser, 'Member added to the team successfully'));
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
    const isMemberInTeam = team.members.some( member=> member.member.toString() === memberId.toString());
    console.log(isMemberInTeam,memberId);
    if (!isMemberInTeam) {
      throw new ApiError(400, 'Member is not part of the team');
    }

   // Remove the member from the team
   team.members = team.members.filter(member => member.member.toString() !== memberId);
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
    const teams = await Team.find({ $or: [{ owner: userId }, { 'members.member': userId }] });

    return res.status(200).json(new ApiResponse(200, teams, 'Teams retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all member's details from team 
const getAllmembers = asyncHandler(async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Fetch details of all members in the team
    const membersPromises = team.members.map(async ({ member, role }) => {
      const user = await User.findById(member);
      if (!user) {
        throw new ApiError(404, `User with ID ${member} not found`);
      }

      const { password, refreshToken, ...userData } = user.toObject(); // Convert Mongoose document to plain object
      return { ...userData, role }; // Include the role in the returned data
    });

    const members = await Promise.all(membersPromises);

    return res.status(200).json(new ApiResponse(200, members, 'Team members fetched successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


const getCurrentTeam = asyncHandler(async (req, res) => {
  try {
    const {teamId} = req.params; // Assuming teamId is passed in the request parameters

    // Find team by team ID
    const team = await Team.findById(teamId);

    // Check if team exists
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(new ApiResponse(200, team, 'Team details retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set role for a team member
const setRoleForMember = asyncHandler(async (req, res) => {
  try {
    const { teamId, memberId, role } = req.body;

    // Check if the team exists
    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (team.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to set roles in this team');
    }

    // Find the member in the team's members array
    const member = team.members.find(member => member.member.toString() === memberId);
    if (!member) {
      throw new ApiError(404, 'Member not found in the team');
    }

    // Update the member's role
    member.role = role;
    await team.save();

    return res.status(200).json(new ApiResponse(200, member, 'Role assigned to the member successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




export {createTeam,addMemberToTeam ,getCurrentTeam,removeMemberFromTeam ,getTeamsForUser,updateTeam,getProjects,deleteTeam,getAllmembers,setRoleForMember};
  