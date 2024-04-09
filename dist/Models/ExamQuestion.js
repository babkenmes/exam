"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const examQuestionSchema = new mongoose_1.Schema({
    question: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question' },
    exam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Exam' },
    answer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Option' },
});
const ExamQuestion = (0, mongoose_1.model)('ExamQuestion', examQuestionSchema);
exports.default = ExamQuestion;
