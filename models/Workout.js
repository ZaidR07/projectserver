import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const WorkoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reps : { type: String, required: true },
    video : { type: String, required: true }
});


WorkoutSchema.plugin(mongooseSequence(mongoose), { inc_field: 'workout_id' });

const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

export { WorkoutModel };
