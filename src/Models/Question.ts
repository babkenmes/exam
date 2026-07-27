import QuestionOption from "./QuestionOption"
export default interface Question {
    text: string;
    options: QuestionOption[];
}