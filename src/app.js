import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


// routes import

import userRouter from './routes/user.routes.js'
import todosRouter from './routes/todos.routes.js'
import teamsRouter from './routes/teams.routes.js'
import projectsRouter from './routes/projects.route.js'
import tasksRouter from './routes/tasksRouter.js'


const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true ,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())


// routes decalaration   here mounting the specific routers to the app , this each router's will use Router.use('path',(rq,res));
app.use("/api/v1/users", userRouter);

app.use('/api/v1/todos',todosRouter);

app.use('/api/v1/teams',teamsRouter);

app.use('/api/v1/projects',projectsRouter);

app.use('/api/v1/tasks',tasksRouter);


export default app;