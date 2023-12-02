import { PopulatedDoc, Schema, model, Document, ObjectId } from 'mongoose';
import { IExamQuestion } from './ExamQuestion';
export interface IExam {
    code: string;
    refId: string;
    questions: [PopulatedDoc<Document<ObjectId> & IExamQuestion>];
    created: Date;
    startDate?: Date
    endDate?: Date

}

const examSchema = new Schema<IExam>({
    code: { type: String, required: true },
    refId: { type: String, required: true },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'ExamQuestion'
    }],
    created: { type: Date, default: Date.now },
    startDate: { type: Date },
    endDate: { type: Date },
});

const Exam = model<IExam>('Exam', examSchema);

export default Exam