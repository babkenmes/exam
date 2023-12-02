import express from "express";
import { createExam, startExam, endExam, getExam, getAll, answerQuestion, examResults } from "../controllers/exam"

const router = express.Router();

router.get("/start", startExam);
router.get("/end", endExam);
router.post("/create", createExam);
router.get("/getexam", getExam);
router.get("/getall", getAll);
router.get("/answer", answerQuestion);
router.get("/examResults", examResults);



export default router