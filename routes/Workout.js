import express from "express";
import { WorkoutModel } from "../models/Workout.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";

const Workoutrouter = express.Router();



// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

Workoutrouter.post("/Workoutadd", upload.single('video'), async (req, res) => {

  const { name, reps } = req.body;

  try {
    // Convert the buffer to a readable stream
    const fileStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "workout-videos" // Specify the folder name
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading video to Cloudinary:", error);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Create a new WorkoutModel instance
        const newWorkout = new WorkoutModel({
          name,
          reps,
          video: result.secure_url // Use the secure URL provided by Cloudinary
        });

        // Save the new workout to the database
        newWorkout.save()
          .then(() => {
            // Return success response to the client
            return res.json({
              message: "Workout Added Successfully",
              status: true
            });
          })
          .catch((saveError) => {
            console.error("Error saving workout to the database:", saveError);
            return res.status(500).json({ message: "Internal server error" });
          });
      }
    );

    // Pipe the buffer to the file stream
    fileStream.write(req.file.buffer);
    fileStream.end();
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




Workoutrouter.get("/Workoutget", async (req, res) => {
  try {
    // Retrieve all workouts from the database
    const workout = await WorkoutModel.find();
    console.log("Check this: ", workout);
    return res.json(workout);
  } catch (error) {
    console.error("Error fetching workouts from the database:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { Workoutrouter };
