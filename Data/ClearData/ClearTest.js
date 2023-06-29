import testModel from "../../models/test.model.js";
import studentModel from "../../models/student.model.js";

const clearTests = async () => {
  // Delete all tests and test students array
  await testModel.deleteMany({});
  await studentModel.updateMany({}, { tests: "" });
};

export default clearTests;
