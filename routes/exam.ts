import express from "express";
import { createExam, startExam, endExam } from "../controllers/exam"

const router = express.Router();

router.get("/start", startExam);
router.get("/end", endExam);
router.post("/create", createExam);

export default router