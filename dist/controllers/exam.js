"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getExam = exports.examResults = exports.endExam = exports.answerQuestion = exports.startExam = exports.createExam = void 0;
const Exam_1 = __importDefault(require("../Models/Exam"));
const Question_1 = __importDefault(require("../Models/Question"));
const ExamQuestion_1 = __importDefault(require("../Models/ExamQuestion"));
const createExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.refId;
    const exam = new Exam_1.default({
        refId,
        code: (Math.round(Math.random() * 100000)).toString()
    });
    const randomQuestions = yield Question_1.default.aggregate([{ $sample: { size: 10 } }]);
    yield exam.save();
    for (let i = 0; i < randomQuestions.length; i++) {
        const question = randomQuestions[i];
        const examQuestion = new ExamQuestion_1.default({
            exam: exam._id,
            question: question._id
        });
        yield examQuestion.save();
        exam.questions.push(examQuestion._id);
    }
    yield exam.save();
    res.status(201).json({ exam: exam });
});
exports.createExam = createExam;
const startExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const exam = yield Exam_1.default.findOne({ code }).populate({
        path: 'questions',
        populate: {
            path: 'question',
            model: 'Question',
            populate: {
                path: 'options',
                model: 'Option',
            }
        }
    });
    if (!exam)
        return res.status(404);
    if (exam.endDate)
        return res.status(302).json({ message: "exam is ended", exam });
    if (exam.startDate)
        return res.status(302).json({ message: "exam is already started", exam });
    exam.startDate = new Date();
    yield exam.save();
    res.status(201).json({ exam });
});
exports.startExam = startExam;
const answerQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId, answerId } = req.query;
    if (!questionId || !answerId)
        return res.status(500).json({ message: "invalid parameters" });
    const result = yield ExamQuestion_1.default.findByIdAndUpdate(questionId, { answer: answerId });
    res.status(200).json({ result });
});
exports.answerQuestion = answerQuestion;
const endExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const exam = yield Exam_1.default.findById(id);
    if (!exam)
        return res.status(404);
    exam.endDate = new Date();
    yield exam.save();
    res.status(200).json({ exam });
});
exports.endExam = endExam;
const examResults = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const answers = yield ExamQuestion_1.default.find({ exam: id })
        .populate({
        path: 'answer',
        model: 'Option',
        select: "is_correct"
    });
    let count = 0;
    answers.forEach(a => {
        if (a.answer.is_correct)
            count++;
    });
    const exam = yield Exam_1.default.findById(id).populate({
        path: 'questions',
        populate: {
            path: 'answer',
            model: 'Option',
            select: "is_correct"
        }
    }).populate({
        path: 'questions',
        populate: {
            path: 'question',
            model: 'Question',
            populate: {
                path: 'options',
                model: 'Option',
                select: ["is_correct", "text"]
            },
        },
    });
    res.status(200).json({ correctAnswersCount: count, exam });
});
exports.examResults = examResults;
const getExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const exam = yield Exam_1.default.findById(id).populate({
        path: 'questions',
        populate: {
            path: 'question',
            model: 'Question',
            populate: {
                path: 'options',
                model: 'Option',
            },
        },
    });
    if (!exam)
        return res.status(404);
    res.status(200).json({ exam });
});
exports.getExam = getExam;
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const exams = yield Exam_1.default.find({}).populate({
        path: 'questions',
        populate: {
            path: 'answer',
            model: 'Option',
            select: "is_correct"
        }
    }).sort([['created', -1]]);
    res.status(200).json({ exams });
});
exports.getAll = getAll;
