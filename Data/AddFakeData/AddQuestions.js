import mongoose from "mongoose";
import questions from "../../models/questions.model.js";

const addQuestions = async (itiTrade, noOfQues, teacid) => {
  const listitiTrade = [
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
  ];
  if (itiTrade == "All" || itiTrade == "all") {
    for (let i = 0; i < listitiTrade.length; i++) {
      for (let j = 0; j < noOfQues; j++) {
        const newQuestion = new questions({
          itiTrade: listitiTrade[i],
          question: `Question ${j + 1} of ${listitiTrade[i]}`,
          option1: `Option 1`,
          option2: `Option 2`,
          option3: `Option 3`,
          option4: `Option 4`,
          answer: `Option ${Math.floor(Math.random() * 4) + 1}`,
          addBy: teacid,
        });
        await newQuestion.save();
      }
    }
  } else {
    for (let i = 0; i < noOfQues; i++) {
      const newQuestion = new questions({
        itiTrade,
        question: `Question ${i + 1} of ${itiTrade}`,
        option1: `Option 1`,
        option2: `Option 2`,
        option3: `Option 3`,
        option4: `Option 4`,
        answer: `Option ${Math.floor(Math.random() * 4) + 1}`,
        addBy: teacid,
      });
      await newQuestion.save();
    }
  }
};

export default addQuestions;
