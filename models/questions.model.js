import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
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
  addBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

export default mongoose.model("Question", questionSchema);
