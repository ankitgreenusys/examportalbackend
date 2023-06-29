import teacherModel from "../../models/teacher.model.js";
import questionsModel from "../../models/questions.model.js";

const clearTeachers = async () => {
  // Delete all teachers and questions
  await teacherModel.deleteMany({});
  await questionsModel.deleteMany({});
};

export default clearTeachers;