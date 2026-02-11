import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

// Always two users only
matchSchema.pre("save", function () {
  if (this.users.length !== 2) {
    throw new Error("Match must contain exactly two users");
  }

  // Sort to prevent duplicate A-B & B-A
  this.users.sort();
});

// Prevent duplicate match at DB level
matchSchema.index({ users: 1 }, { unique: true });

const MATCH = mongoose.model("MATCH", matchSchema);

export default MATCH;
