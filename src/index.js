import connectDB from './db/db.js';
import 'dotenv/config'
import app from './app.js';
 // You can choose any available port


connectDB()
.then(()=> {
    app.listen(process.env.PORT||3001,()=>{
        console.log(`Server is listening on Port : ${process.env.PORT}`)
        console.log(`:http://localhost:${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MONGO DB connection failed !!! ",error)
})

// app.get('/user',(req,res)=>{
//     res.send('Hello This is Amit JI')
// })
