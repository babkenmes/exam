"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exam_1 = require("../controllers/exam");
const router = express_1.default.Router();
router.get("/start", exam_1.startExam);
router.get("/end", exam_1.endExam);
router.post("/create", exam_1.createExam);
router.get("/getexam", exam_1.getExam);
router.get("/getall", exam_1.getAll);
router.get("/answer", exam_1.answerQuestion);
router.get("/examResults", exam_1.examResults);
exports.default = router;
