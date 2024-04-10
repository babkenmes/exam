import ExamQuestion from "./ExamQuestion";

export default interface Exam {
    _id: string;
    code: string;
    refId: string;
    questions?: ExamQuestion[];
    created: string;
    startDate?: string
    endDate?: string
}


export interface ExamResult {
    _id: string;
    code: string;
    refId: string;
    questions?: {
        answer?: {
            _id: string;
            is_correct: true;
        };
        question: {
            text: string;
            options: {
                _id: string;
                text: string;
                is_correct: boolean
            }[]
        };
    }[];
    created: string;
    startDate?: string
    endDate?: string
}