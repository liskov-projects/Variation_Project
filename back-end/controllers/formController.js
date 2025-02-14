import forms from "../model/dbSchema.js";

export const submitForm=async(req,res)=>{
    console.log(req.body)
    const {userId}=req.auth;
    const {email,formData}=req.body;

    try {
        const newForm=new forms({
            userId,
            email,
            ...formData
        })
        await newForm.save()
        res.status(200).json({message:"Form submitted successfully"})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Server error"})
    }
}

