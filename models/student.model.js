import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: [true, "Phone number already exists"],
  },
  addharNumber: {
    type: Number,
    required: true,
    unique: [true, "Addhar number already exists"],
  },
  yearOfPassing: {
    type: Number,
    length: [4, "Year must be 4 digits"],
  },
  itiTrade: {
    type: String,
    enum: [
      "Mechanic Desil",
      "Mechanic Moter Cycle",
      "Mechanic (Moter Vechicle)",
      "Mechanic (Denting, Painting, Welding)",
      "Poniter Genral",
      "Welder (Gas and Electric)",
      "TIG/MIG (Welder)",
      "Carpenter",
      "Apprentice Food Production (Cookery)",
      "Mechanic (Repair & Maintenance)",
      "Electronics Mechanic",
      "Electrican",
    ],
  },
  category: {
    type: String,
    enum: ["General", "OBC", "SC", "ST"],
    default: "General",
  },
  otp: {
    type: Number,
    default: 0,
  },
  otpExpiresIn: {
    type: Date,
    default: Date.now(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isExamGiven: {
    type: Boolean,
    default: false,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
  },
});

export default mongoose.model("Student", studentSchema);
