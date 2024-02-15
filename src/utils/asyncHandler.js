
const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        console.log("Hello!!!!!!");
     Promise.resolve(requestHandler(req,res,next)).catch((error)=> next(error))
    }
 }
 
 export {asyncHandler}