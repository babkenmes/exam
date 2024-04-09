import Exam from "./Exam";
import Question from "./Question";
import QuestionOption from "./QuestionOption";

export default interface ExamQuestion {
    _id: string;
    question: Question;
    exam: Exam;
    answer?: QuestionOption | string;
}