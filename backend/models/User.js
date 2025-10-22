import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["MAIN_ADMIN", "SUB_ADMIN", "INTERN"],
    required: true,
  },
  // Additional fields for interns
  employeeId: { type: String, unique: true, sparse: true },
  companyEmail: { type: String, unique: true, sparse: true },
  personalEmail: { type: String },
  contactNumber: { type: String },
  username: { type: String, unique: true, sparse: true },
  // Track who created this user
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
