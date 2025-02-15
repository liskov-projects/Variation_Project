// import mongoose,{Schema} from "mongoose";


// const formSchema = new Schema(
//     {
//         userId:{ type: String, required: true,unique:true },
//         email:{ type: String, required: true,unique:true },
//         formData: [{ 
//             type: Schema.Types.Mixed,
//             required: true
//         }]
//     },
//     { timestamps: true }
// )

// const forms=mongoose.model('forms',formSchema)
// export default forms;

import mongoose, { Schema } from "mongoose";

const formSchema = new Schema(
    {
        userId: { 
            type: String, 
            required: true, 
            unique: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        formData: {
            type: [Schema.Types.Mixed],
            required: true,
            default: [],
            validate: {
                validator: function(v) {
                    return Array.isArray(v);
                },
                message: 'formData must be an array'
            }
        }
    },
    { 
        timestamps: true,
        strict: true
    }
);

// Middleware to ensure formData is always an array before saving
formSchema.pre('save', function(next) {
    if (!Array.isArray(this.formData)) {
        this.formData = [this.formData];
    }
    next();
});

const forms = mongoose.model('forms', formSchema);
export default forms;