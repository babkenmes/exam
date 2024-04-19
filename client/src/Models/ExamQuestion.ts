import Exam from "./Exam";
import Question from "./Question";
import QuestionOption from "./QuestionOption";

export default interface ExamQuestion {
    question: Question;
    exam?: Exam;
    answer?: number;
}