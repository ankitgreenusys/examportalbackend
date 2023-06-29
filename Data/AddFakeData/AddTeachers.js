import bcrpyt from "bcryptjs";
import teachers from "../../models/teacher.model.js";

const addTeachers = async (noOfTeachers) => {
  for (let i = 0; i < noOfTeachers; i++) {
    const hashedPassword = await bcrpyt.hash(`teacher${i + 1}@1234`, 12);

    const newTeacher = new teachers({
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@digitaloql.in`,
      password: hashedPassword,
    });
    await newTeacher.save();
  }
};

export default addTeachers;
