import Exam from '../Models/Exam';
import Questions from '../questions';

const NUMBER_OF_QUESTIONS = 10;

export const GetNewExam = (): Exam => {
    const shuffled = Questions.sort(function () { return 0.5 - Math.random() })
    const selectedQuestions = shuffled.slice(0, NUMBER_OF_QUESTIONS).map(q => ({ question: q }))
    const exam: Exam = {
        questions: selectedQuestions,
        startDate: new Date().toISOString()
    }
    localStorage.setItem('exam', JSON.stringify(exam));
    return exam
}


export const AnswerQuestion = (exam: Exam, questionIndex: number, answer: number) => {
    if (!exam.questions?.[questionIndex])
        throw new Error('Question not found');
    exam.questions[questionIndex].answer = answer;
    localStorage.setItem('exam', JSON.stringify(exam));
    return exam;
}

export const EndExam = (exam: Exam) => {
    exam.endDate = new Date().toISOString();
    localStorage.setItem('exam', JSON.stringify(exam));
}