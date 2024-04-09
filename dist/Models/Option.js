"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    is_correct: { type: Boolean, required: true, select: false },
});
const OptionModel = (0, mongoose_1.model)('Option', optionSchema);
exports.default = OptionModel;
