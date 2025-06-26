import {bucket} from "../config/gcs.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Upload logo for user
export const uploadLogo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.params.userId;
  const fileName = `logos/${userId}-${uuidv4()}${path.extname(req.file.originalname)}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
  });

  blobStream.on("error", (err) => {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload file" });
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).json({
      message: "File uploaded successfully",
      logoUrl: publicUrl,
    });
  });

  blobStream.end(req.file.buffer);
};
