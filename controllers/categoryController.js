import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController=async(req,res)=>{
        try {
            const {name}=req.body;
            if(!name){
                return res.status(401).send({message:"Name is required"});
            }
            const existingCategory=await categoryModel.findOne({name:name});
            if(existingCategory){
                return res.status(200).send({
                    success: true,
                    message: "Category already exists"
                })
            }
            const category= await new categoryModel({name,slug:slugify(name)}).save();
             res.status(201).send({
                success: true,
                message: "Category created successfully",
                category
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                sucess:false,
                message:"SomeThing went Wrong"
            })
        }
}


export const updateCategoryController=async (req,res)=>{

    try {
        const {name}=req.body;
        const {id}=req.params;
        const category =await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        if(!category){
            return res.status(400).send({
                success:false,
                message: "No category found"
            })
        }
        res.status(200).send({
            success:true,
            message:"category Updated Successfully",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in updating category",
            error
        });
    }
}



export const categoryController =async(req,res)=>{

    try {
        const category=await categoryModel.find({});
        res.status(200).send({
            success:true,
            message: "got Category",
            category
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting categories",
            error
        })
    }
}

export const singleCategoryController=async(req,res)=>{
    try {
        const {slug}=req.params;
        const category=await categoryModel.find({slug});
        if(!category){
            return res.status(400).send({
                success:false,
                message: "No category found"
            })
        };
        res.status(200).send({
            success:true,
            message: "got category",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting single categories",
            error
        })
    }
}

export const deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params;
    const category=  await categoryModel.findOne({_id:id});
    if(!category){
       return res.status(400).send({
            success:false,
            message: "No category found"
        })
    }
    await categoryModel.findByIdAndDelete({_id:id});
        res.status(200).send({
            success:true,
            message: "Category deleted successfully"
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in delete category",
            error
        })
    }
}