import studentModel from "../../models/student.model.js";
import testModel from "../../models/test.model.js";

const clearStudents = async () => {
  // Delete all students and test students array
  await studentModel.deleteMany({});
  await testModel.deleteMany({});
};

export default clearStudents;