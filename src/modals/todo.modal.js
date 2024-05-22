import mongoose from "mongoose";

const personalTodoSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  time:{
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Todo = mongoose.model("Todo", personalTodoSchema);

export {Todo };
