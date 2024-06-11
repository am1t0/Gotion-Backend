import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { Team } from '../modals/team.modal.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js';
import { Project } from '../modals/project.modal.js'; 
import { Task } from '../modals/tasks.modal.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const createProject = asyncHandler(async (req, res) => {
  try {
    // taking details regarding project 
    const { name,description,leaderToken} = req.body;
    const owner = req.user._id;

    // Create a new project document
    const newProject = new Project({
      owner,
      leaderToken,
      name,
      description,
      members: [{member:owner}],  // 'owner intially as member'
      announcements: [],
      tasks: [],
      repoInitialized:true,
    });

    // Save the new project to the database
    const savedProject = await newProject.save();

    return res.status(200).json(new ApiResponse(200,savedProject, 'Projects created successfully'));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const addTaskToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { taskName, description, username, status, deadline } = req.body;

  // Validate required fields
  if (!taskName || !description || !username || !status || !deadline) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // For simplicity, assuming username is unique
    // You may want to add additional validation or fetch user ID based on the username
    const user = await User.findOne({ username });

    // user exists or not 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const teamId = project.team;

    const team = await Team.findById(teamId);

    if(team.owner.toString() !== req.user._id.toString()){
      return  res.status(401).json({ success: false, message: "Unauthorized!" });
    }


    if (!team) {
      return res.status(403).json({ success: false, message: "Project does not have an associated team" });
    }
    
    // Create a new task instance
    const newTask = new Task({
      taskName,
      description,
      member: user._id, // Assign the user ID to the task
      status,
      deadline,
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // For simplicity, assuming projectId is valid
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      project: updatedProject,
      task: savedTask,
    });
  } catch (error) {
    console.error("Error adding task to project:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const repoCheck = asyncHandler(async (req, res) => {
  try {
    const { repoName, owner, projectId } = req.body;

    if (!repoName || !projectId || !owner) {
      return res.status(400).json({ message: 'Invalid request. Missing or empty parameters.' });
    }

    // Assuming you have a project model
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the project details with repoName and owner
    project.repo = {
      repoName: repoName,
      owner: owner,
    };

    console.log('Project after repo Details is : ',project);

    // Update the project to indicate that the repository has been initialized
    project.repoInitialized = true;

    await project.save();

    res.status(201).json({ message: 'Repository created and project updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getCurrentProject = asyncHandler(async (req, res) => {
  try {
    const {projectId} = req.params;

    // Find project by project ID
    const project = await Project.findById(projectId);

    // Check if team exists
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(new ApiResponse(200, project, 'Project details retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const uploadTheme = asyncHandler(async (req, res) => {
  try {
    console.log('backend me aa rhe hai bhaiyaaa!')
      const { projectId } = req.params;

      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      // Fetch the project to verify the owner
      const project = await Project.findById(projectId);

      if (!project) {
          return res.status(404).json({ error: 'Project not found' });
      }
      // Assuming the file is stored in req.file.path by multer
      const localFilePath = req.file.path;

      // Upload file to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if (!cloudinaryResponse) {
          return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      }

      // Update the theme in the project document
      project.theme = cloudinaryResponse.url;
      await project.save();

      res.status(200).json({ url: cloudinaryResponse.url });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Teams for User
const getProjectsForUser = asyncHandler( async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { owner: userId }, // The user is the owner
        { 
          members: {
            $elemMatch: {
              member: userId,
              isAccepted: true
            }
          }
        } // The user is a member and has accepted the invitation
      ]
    });

    return res.status(200).json(new ApiResponse(200, projects, 'projects retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all member's details from team 
const getAllmembers = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Team not found');
    }

    // Fetch details of all members in the team
    const membersPromises = project.members.map(async ({ member, role }) => {
      const user = await User.findById(member);
      if (!user) {
        throw new ApiError(404, `User with ID ${member} not found`);
      }

      const { password, refreshToken, ...userData } = user.toObject(); // Convert Mongoose document to plain object
      return { ...userData, role }; // Include the role in the returned data
    });

    const members = await Promise.all(membersPromises);

    return res.status(200).json(new ApiResponse(200, members, 'Project members fetched successfully'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const addMemberToProject = asyncHandler(async (req, res) => {
  try {
    const { projectId, username } = req.body;
    // Check if the team exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Team not found');
    }

    // Check if the user is the owner of the team
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to add members to this team');
    }

    // Check if the member user exists
    const memberUser = await User.findOne({ username });
    if (!memberUser) {
      throw new ApiError(404, 'Member user not found');
    }

    // Check if the member is already a part of the team
    const isMemberExists = project.members.some(member => member.member.toString() === memberUser._id.toString());
    if (isMemberExists) {
      throw new ApiError(400, 'Member is already part of the team');
    }

    // Add the member to the team with default role
    project.members.push({ member: memberUser._id });

    await project.save();
    
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



export { createProject ,addMemberToProject,getProjectsForUser,getAllmembers, getCurrentProject,addTaskToProject,repoCheck,getProject,uploadTheme};
