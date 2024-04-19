import ExamQuestion from "./ExamQuestion";

export default interface Exam {
    questions: ExamQuestion[];
    startDate: string
    endDate?: string
}


export interface ExamResult {
    code: string;
    refId: string;
    questions?: {
        answer?: {
            is_correct: true;
        };
        question: {
            text: string;
            options: {
                text: string;
                is_correct: boolean
            }[]
        };
    }[];
    created: string;
    startDate?: string
    endDate?: string
}