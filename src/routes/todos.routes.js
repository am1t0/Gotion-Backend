import {Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
import { createTodo,getTodosByUser,getTodo,updateTodo,deleteTodo,markTodoAsDoneUndone } from "../controllers/todos.controller.js";

const router = Router();

router.route("/create-todo").post(veryfyJWT,createTodo)

router.route("/get-todos").get(veryfyJWT,getTodosByUser);


router.route('/:todoId')
  .get(veryfyJWT, getTodo)
  .put(veryfyJWT, updateTodo)
  .delete(veryfyJWT, deleteTodo)
  .patch(veryfyJWT,markTodoAsDoneUndone)
  



export default router