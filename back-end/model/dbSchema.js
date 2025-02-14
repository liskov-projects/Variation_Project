import mongoose,{Schema} from "mongoose";


const formSchema = new Schema(
    {
        userId:{ type: String, required: true,unique:true },
        email:{ type: String, required: true,unique:true },
        formData:{ type: Schema.Types.Mixed, required: true}
    },
    { timestamps: true }
)

const forms=mongoose.model('forms',formSchema)
export default forms;