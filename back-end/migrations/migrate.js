import mongoose from "mongoose";
import forms from "./model/dbSchema.js";

const migrateForms = async () => {
  try {
    const cursor = forms.find().cursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      // Check if formData is not an array
      if (!Array.isArray(doc.formData)) {
        await forms.updateOne({ _id: doc._id }, { $set: { formData: [doc.formData] } });
        console.log(`Migrated document for user: ${doc.userId}`);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.disconnect();
  }
};

migrateForms();
