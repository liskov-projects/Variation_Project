import mongoose from 'mongoose';
import forms from "./model/dbSchema.js";
import { config } from 'dotenv';

config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all documents
        const allDocs = await forms.find({});

        for (const doc of allDocs) {
            if (!Array.isArray(doc.formData)) {
                console.log(`Fixing document for userId: ${doc.userId}`);
                
                await forms.updateOne(
                    { _id: doc._id },
                    { 
                        $set: { 
                            formData: [doc.formData] 
                        } 
                    },
                    { strict: false }
                );
            }
        }

        console.log('All documents fixed successfully');
    } catch (error) {
        console.error('Error fixing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

fixData();