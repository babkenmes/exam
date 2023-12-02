import { Schema, model, Document, PopulatedDoc, ObjectId } from 'mongoose';
import { IOption } from "./Option"

export interface IQuestion {
    text: string;
    options: [PopulatedDoc<Document<ObjectId> & IOption>];
}

const questionSchema = new Schema<IQuestion>({
    text: { type: String, required: true },
    options: [{
        type: Schema.Types.ObjectId,
        ref: 'Option'
    }],
});

const Question = model<IQuestion>('Question', questionSchema);

export default Question