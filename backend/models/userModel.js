// models/userModel.js
import mongoose from "mongoose";

// If you do NOT use a pre-save hook to hash, keep hashing in controllers (your current setup).
// If you add a pre-save hook later, remove hashing from controllers.

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // normalize and dedupe emails
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    // Hide password from queries by default. (Update login to .select("+password"))
    password: { type: String, required: true, select: false },

    // <-- these MUST exist to match your controllers
    resetTokenHash: { type: String, index: true },
    resetTokenExpiresAt: { type: Date },

    // optional but useful for JWT invalidation policies
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
);

// (Optional) If you want the model to hash automatically, uncomment this and
// remove manual bcrypt.hash in register/reset controllers.
/*
import bcrypt from "bcrypt";
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
*/

const userModel = mongoose.model("User", userSchema);
export default userModel;
