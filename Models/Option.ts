import { Schema, model } from 'mongoose';

export interface IOption {
    text: string;
    is_correct?: boolean;
}

const optionSchema = new Schema<IOption>({
    text: { type: String, required: true },
    is_correct: { type: Boolean, required: true, select: false },
});

const OptionModel = model<IOption>('Option', optionSchema);

export default OptionModel