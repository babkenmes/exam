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