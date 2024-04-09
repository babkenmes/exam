"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    options: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Option'
        }],
});
const Question = (0, mongoose_1.model)('Question', questionSchema);
exports.default = Question;
