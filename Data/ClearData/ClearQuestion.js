import questionsModel from "../../models/questions.model.js";
import testModel from "../../models/test.model.js";

const clearQuestions = async () => {
  // Delete all questions and test questions array
  await questionsModel.deleteMany({});
  await testModel.updateMany({}, { questions: [] });
};

export default clearQuestions;
