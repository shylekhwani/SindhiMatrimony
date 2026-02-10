import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
      unique: true, // 🔒 one profile per user
      index: true,
    },

    // ================= PROFILE PHOTOS =================
    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ================= BASIC INFO =================

    profileFor: {
      type: String,
      enum: ["self", "son", "daughter", "brother", "sister", "relative"],
      default: "self",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    timeOfBirth: String,
    placeOfBirth: String,
    height: String,
    weight: String,
    maritalStatus: {
      type: String,
      enum: ["never-married", "divorced", "widowed", "separated"],
      default: "never-married",
    },
    complexion: String,
    bodyType: String,
    caste: String,
    diet: {
      type: String,
      enum: ["vegetarian", "non-vegetarian", "eggetarian"],
      default: "vegetarian",
    },
    drinking: {
      type: String,
      enum: ["no", "occasionally", "yes"],
      default: "no",
    },
    smoking: {
      type: String,
      enum: ["no", "occasionally", "yes"],
      default: "no",
    },
    aboutMe: String,
    hobbies: String,
    languages: String,

    // ================= PROFESSIONAL INFO =================

    education: String,
    educationDetails: String,
    profession: String,
    organization: String,
    annualIncome: String,
    city: String,
    state: String,
    country: String,

    // ================= FAMILY INFO =================

    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    siblings: String,
    familyType: {
      type: String,
      enum: ["nuclear", "joint"],
      default: "nuclear",
    },
    familyValues: {
      type: String,
      enum: ["traditional", "moderate", "liberal"],
      default: "traditional",
    },
    familyStatus: {
      type: String,
      enum: ["middle-class", "upper-middle-class", "rich"],
      default: "middle-class",
    },
    familyLocation: String,

    // ================= PARTNER PREFERENCES =================

    partnerAgeMin: Number,
    partnerAgeMax: Number,
    partnerHeightMin: String,
    partnerHeightMax: String,
    partnerMaritalStatus: {
      type: String,
      enum: ["never-married", "divorced", "widowed", "separated"],
      default: "never-married",
    },
    partnerEducation: String,
    partnerProfession: String,
    partnerLocation: String,
    partnerCaste: String,
    partnerExpectations: String,

    // ================= STATUS FLAGS =================
    isVisible: {
      type: Boolean,
      default: false, // becomes true after verification + completion
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileStatus: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "HIDDEN", "BLOCKED"],
      default: "DRAFT",
    },
  },
  { timestamps: true },
);

const PROFILE = mongoose.model("PROFILE", profileSchema);

export default PROFILE;
