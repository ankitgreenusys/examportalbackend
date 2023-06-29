import addQuestions from "./AddFakeData/AddQuestions.js";
import addTeachers from "./AddFakeData/AddTeachers.js";

import ClearQuestions from "./ClearData/ClearQuestion.js";
import ClearTeachers from "./ClearData/ClearTeacher.js";
import ClearTests from "./ClearData/ClearTest.js";
import ClearStudents from "./ClearData/ClearStudent.js";

const routes = {};

routes.addQuestions = async (req, res) => {
  const { itiTrade, noOfQues, teacid } = req.body;
  await addQuestions(itiTrade, noOfQues, teacid);
  res.status(200).json({ success: "Questions added" });
};

routes.addTeachers = async (req, res) => {
  const { noOfTeachers } = req.body;
  await addTeachers(noOfTeachers);
  res.status(200).json({ success: "Teachers added" });
};

routes.clearQuestions = async (req, res) => {
  await ClearQuestions();
  res.status(200).json({ success: "Questions cleared" });
};

routes.clearTeachers = async (req, res) => {
  await ClearTeachers();
  res.status(200).json({ success: "Teachers cleared" });
};

routes.clearTests = async (req, res) => {
  await ClearTests();
  res.status(200).json({ success: "Tests cleared" });
};

routes.clearStudents = async (req, res) => {
  await ClearStudents();
  res.status(200).json({ success: "Students cleared" });
};

export default routes;