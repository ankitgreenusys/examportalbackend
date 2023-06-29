import express from "express";
import manageDataController from "./manageData.controllers.js";

const router = express.Router();

router.post("/addquestion", manageDataController.addQuestions);
router.post("/addTeachers", manageDataController.addTeachers);
router.get("/clearQuestions", manageDataController.clearQuestions);
router.get("/clearTeachers", manageDataController.clearTeachers);
router.get("/clearTests", manageDataController.clearTests);
router.get("/clearStudents", manageDataController.clearStudents);

export default router;
