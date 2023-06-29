import express from "express";
import teacherController from "../controllers/teacher.controllers.js";
import teacherauth from "../middlewares/teacher.auth.js";

const router = express.Router();

router.post("/login", teacherController.login);
router.get("/getprofile", teacherauth, teacherController.getdta);
router.post("/addquestion", teacherauth, teacherController.addquestion);

export default router;
