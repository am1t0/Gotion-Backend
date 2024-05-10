import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { Task } from '../modals/tasks.modal.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../modals/user.modal.js'
import {Project} from '../modals/project.modal.js';

const createTask = asyncHandler(async (req, res) => {
    try {
      // Extract task details from request body
      const { name, description, status, assignee, due, priority } = req.body;
      const { projectId } = req.params;
      const userId = req.user._id; // Assuming you have user information in req.user
  
      // Find the project
      const project = await Project.findById(projectId);
  
      // Check if project exists
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Check if the user is the owner of the team
      if (project.owner.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Create the task
      const newTask = new Task({
        name,
        description,
        status,
        assignee,
        due,
        priority,
      });
  
      // Save the task
      await newTask.save();
  
      // Associate the task with the project
      project.tasks.push(newTask._id);
  
      // Save the updated project
      await project.save();
  
      // Return success response
      return res.status(201).json(new ApiResponse(201, newTask, 'Task created successfully'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const updateTask = asyncHandler(async (req, res) => {
    try {
      const { name, description, status, assignee, due, priority } = req.body;
      const { taskId , ownerId } = req.params;
      const userId = req.user._id;
  

      // Find the task
      const task = await Task.findById(taskId);
  
      // Check if task exists
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check if the user is the owner of the task
      if (ownerId!== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Update task details
      if(name) task.name = name;
      if(description) task.description = description;
      if(status) task.status = status;
      if(assignee) task.assignee = assignee;
      if(due) task.due = due;
      if(priority) task.priority = priority;
  
      // Save the updated task
      await task.save();
  
      // Return success response
      return res.status(200).json(new ApiResponse(200, task, 'Task updated successfully'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const deleteTask  = asyncHandler(async (req, res) => {
    try {
      const { taskId, ownerId } = req.params;
      const userId = req.user._id; // Assuming you have user information in req.user

      // Find the task
      const task = await Task.findById(taskId);
  
      // Check if task exists
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check if the user is the owner of the task
      if (ownerId !== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Find the associated project
      const project = await Project.findOne({ tasks: taskId });
  
      // Remove task ID from the project's tasks array
      project.tasks = project.tasks.filter(id => id.toString() !== taskId);
  
      // Save the updated project
      await project.save();
  
    //   Delete the task
      await Task.deleteOne({ _id: taskId });
  
      // Return success response
      return res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const getTasks =asyncHandler(async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Find project by ID
      const project = await Project.findById(projectId);
  
      // Check if project exists
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Extract task IDs from project
      const taskIds = project.tasks;
  
      // Fetch tasks by IDs
      const tasks = await Task.find({ _id: { $in: taskIds } });
  
      // Return success response with tasks
      return res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  export {createTask,updateTask ,deleteTask,getTasks};