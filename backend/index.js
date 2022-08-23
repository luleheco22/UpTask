import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoute.js'
import projectRoutes from './routes/projectRoute.js'
import taskRoutes from './routes/taskRoute.js'
import morgan from 'morgan'
import cors from 'cors'
import {Server} from 'socket.io'

const app= express()
app.use(express.json())
dotenv.config()

connectDB()
//Configure cors
const whitelist=[process.env.FRONTEND_URL]

const corsOptions={
    origin:(origin,callback)=>{
        console.log(origin)
       if (whitelist.includes(origin)) {
          callback(null,true)
       } else{
          callback(new Error('Error Cors'))
       }
    }
}

app.use(cors(corsOptions))
app.use(morgan('dev'))
//Routing
app.use('/api/users',userRoutes)
app.use('/api/projects',projectRoutes)
app.use('/api/tasks',taskRoutes)

const PORT= process.env.PORT || 4000

const server=app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})

//Socket.io

const io=new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket)=>{
    //console.log('Connected to socket');
    //Events

 socket.on('open project',(projectID)=>{
     socket.join(projectID)
 })

 socket.on('new task',(task)=>{
    const project=task.project
      socket.to(project).emit('added task',task)
 })

 socket.on('delete task',(task)=>{
    const project=task.project
    socket.to(project).emit('deleted task',task)
 })

 socket.on('update task',(task)=>{
    const project=task.project._id
    socket.to(project).emit('updated task',task)
 })

 socket.on('change state',(task)=>{
    const project=task.project._id
    socket.to(project).emit('new state', task)
 })

})