import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

export const requireSignIn=async (req,res,next)=>{
    try {
        const decode= JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        if(!decode){
            return res.status(201).send("Invalid Token");
        }
        req.user=decode;
        next();

    } catch (error) {
        console.log(req.body);
        console.log({
            success:false,
            message:"error in middleware",
            error
        });

    }
}

export const isAdmin=async(req,res,next)=>{
    try {
        const user=await userModel.findById(req.user._id);
        
        if(user.role!==1){
            return res.status(201).send({
                success:false,
                message:"Unauthorized access",
            });
        }
        next();
       
    } catch (error) {
        console.log("admin mai error");
        console.log({
            success:false,
            message:"error in middleware",
            error
        });
    }
}
