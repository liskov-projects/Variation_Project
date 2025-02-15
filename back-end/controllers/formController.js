import forms from "../model/dbSchema.js";

export const submitForm = async (req, res) => {
    console.log(req.body);
    const { userId, email, formData } = req.body;

    try {
        // First, try to find the existing user
        const existingUser = await forms.findOne({ userId });

        if (existingUser) {
            // If user exists, first update the document structure
            await forms.updateOne(
                { userId },
                { 
                    $set: { 
                        formData: Array.isArray(existingUser.formData) 
                            ? existingUser.formData 
                            : [existingUser.formData] 
                    } 
                }
            );

            // Now add the new form data
            const updatedUser = await forms.findOneAndUpdate(
                { userId },
                {
                    $push: { formData: formData }
                },
                { 
                    new: true,
                    runValidators: true
                }
            );

            return res.status(200).json({
                message: "Form data added to existing user",
                data: updatedUser
            });
        } else {
            // If user doesn't exist, create new entry
            const newForm = new forms({
                userId,
                email,
                formData: [formData]
            });
            
            const savedForm = await newForm.save();
            
            return res.status(201).json({
                message: "New user created with form data",
                data: savedForm
            });
        }
    } catch (error) {
        console.error('Error details:', error);
        
        // Check for specific error types and provide appropriate responses
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate entry found",
                error: error.message
            });
        }
        
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};