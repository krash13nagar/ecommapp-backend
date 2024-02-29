import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"

export const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,address,answer} = req.body;

        if(!name){
            return res.send({message:"name is required"});
        }
        if(!email){
            return res.send({message:"email is required"});
        }
        if(!password){
            return res.send({message:"password is required"});
        }
        if(!phone){
            return res.send({message:"phone is required"});
        }
        if(!address){
            return res.send({message:"address is required"});
        }
        if(!answer){
            return res.send({message:"answer is required"});
        }

        const existingUser=await userModel.findOne({email:req.body.email});
        // console.log(existingUser);
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already existing email"
            })
        }

        const hashedPassword=await hashPassword(password);

        const user=await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();

        res.status(201).send({
            success:true,
            message:"User register successfully",
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in registration",
            error
        })
    }
}

export const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
           return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        const user=await userModel.findOne({email:email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registerd"
            })
        }

        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }

        const token = JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:'7d',
        });

        res.status(201).send({
            success:true,
            message:"login successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        });
    }
}

export const forgetPasswordController=async(req,res)=>{
    try {
        const {email,answer,newpassword}=req.body;
        if(!email){
           return res.status(400).send("Email is required");
        }
        if(!answer){
           return res.status(400).send("answer is required");
        }
        if(!newpassword){
           return res.status(400).send("newPassword is required");
        }
        const user=await userModel.findOne({email,answer});
        if(!user){
           return  res.status(404).send({
                success:false,
                message:"Wrong Email or Answer",
            });
        }

        const hashed=await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully",
        });

    } catch (error) {
         res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}


export const updateProfileController=async(req,res)=>{
    try {
        const {name,password,address,phone}=req.body;
        const user=await userModel.findById(req.user._id);

        if(password && password.length<6){
            return res.json({error:"Password is required and 6 character long"});
        }
        const hashedPassword=password ? await hashPassword(password):undefined;

        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:hashedPassword || user.password,
            phone:phone || user.phone,
            address:address || user.address,

        },{new:true})
        res.status(200).send({
            success:true,
            message:"profile Upadted Successfully",
            updatedUser
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong in Update Profile"
        })
    }
}

export const getOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting Orders"
        })
    }
}

export const getAllOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:-1});
        res.json(orders);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting All Orders"
        })
    }
}

export const orderStatusController=async(req,res)=>{
    try {
        const {orderId}=req.params;
        const {status}=req.body;
        const order=await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
        res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while updating order Status"
        })
    }
}



