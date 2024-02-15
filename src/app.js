import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


// routes import

import userRouter from './routes/user.routes.js'
import todosRouter from './routes/todos.routes.js'
import teamsRouter from './routes/teams.routes.js'
import projectsRouter from './routes/projects.route.js'


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true ,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())


// routes decalaration
app.use("/api/v1/users", userRouter);

app.use('/api/v1/todos',todosRouter);

app.use('/api/v1/teams',teamsRouter);

app.use('/api/v1/projects',projectsRouter);

//http://localhost:4000/api/v1/users/register


//  routes declaration
//  app.use("/api/v1/users", userRouter)  // versions btana achi practice

//http://localhost:8000/api/v1/users/register

export default app;