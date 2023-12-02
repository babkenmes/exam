import { PopulatedDoc, Schema, model, Document, ObjectId } from 'mongoose';
import { IQuestion } from './Question';
import { IExam } from './Exam';
import { IOption } from './Option';
export interface IExamQuestion {
    question: [PopulatedDoc<Document<ObjectId> & IQuestion>];
    exam: [PopulatedDoc<Document<ObjectId> & IExam>];
    answer: [PopulatedDoc<Document<ObjectId> & IOption>];
}

const examQuestionSchema = new Schema<IExamQuestion>({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    answer: { type: Schema.Types.ObjectId, ref: 'Option' },
});

const ExamQuestion = model<IExamQuestion>('ExamQuestion', examQuestionSchema);

export default ExamQuestion