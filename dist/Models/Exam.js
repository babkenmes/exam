"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const examSchema = new mongoose_1.Schema({
    code: { type: String, required: true },
    refId: { type: String, required: true },
    questions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ExamQuestion'
        }],
    created: { type: Date, default: Date.now },
    startDate: { type: Date },
    endDate: { type: Date },
});
const Exam = (0, mongoose_1.model)('Exam', examSchema);
exports.default = Exam;
