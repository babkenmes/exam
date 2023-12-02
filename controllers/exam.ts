import { RequestHandler, response } from 'express';
import Exam from '../Models/Exam';
import Question from '../Models/Question';
import ExamQuestion from '../Models/ExamQuestion';

export const createExam: RequestHandler = async (req, res, next) => {

    const refId = (req.body as { refId: string })?.refId;
    const exam = new Exam({
        refId,
        code: (Math.round(Math.random() * 100000)).toString()
    })

    const randomQuestions = await Question.aggregate(
        [{ $sample: { size: 2 } }]
    )

    await exam.save();

    for (let i = 0; i < randomQuestions.length; i++) {
        const question = randomQuestions[i]
        const examQuestion = new ExamQuestion({
            exam: exam._id,
            question: question._id
        })
        await examQuestion.save()
        exam.questions.push(examQuestion._id)
    }

    await exam.save();

    res.status(201).json({ exam: exam });
};

export const startExam: RequestHandler = async (req, res, next) => {
    const code = req.query.code;
    const exam = await Exam.findOne({ code }).populate({
        path: 'questions',
        populate: {
            path: 'question',
            model: 'Question',
            populate: {
                path: 'options',
                model: 'Option',
            }
        }
    })
    if (!exam)
        return res.status(404)
    if (exam.endDate)
        return res.status(500).json({ message: "exam is ended" })
    if (exam.startDate)
        return res.status(302).json({ message: "exam is already started", exam })
    exam.startDate = new Date();
    await exam.save();
    res.status(201).json({ exam });
};

export const answerQuestion: RequestHandler = async (req, res, next) => {
    const { questionId, answerId } = req.query;
    if (!questionId || !answerId)
        return res.status(500).json({ message: "invalid parameters" });

    const result = await ExamQuestion.findByIdAndUpdate(questionId, { answer: answerId })
    res.status(200).json({ result });
};

export const endExam: RequestHandler = async (req, res, next) => {
    const id = req.query.id;
    const exam = await Exam.findById(id)
    if (!exam)
        return res.status(404)
    exam.endDate = new Date();
    await exam.save();
    res.status(200).json({ exam });
};


export const examResults: RequestHandler = async (req, res, next) => {
    const id = req.query.id;
    const answers = await ExamQuestion.find({ exam: id }).populate("answer")
    let count = 0;
    answers.forEach(a => {
        
        if (a.answer.is_correct)
            count++
    })
    res.status(200).json({ correctAnswersCount: count });
};

export const getExam: RequestHandler = async (req, res, next) => {
    const id = req.query.id;
    const exam = await Exam.findById(id).populate({
        path: 'questions',
        populate: {
            path: 'question',
            model: 'Question',
            populate: {
                path: 'options',
                model: 'Option',
            }
        }
    })
    if (!exam)
        return res.status(404)
    res.status(200).json({ exam });
};

export const getAll: RequestHandler = async (req, res, next) => {
    const exams = await Exam.find({}).populate({
        path: 'questions',
        populate: {
            path: 'answer',
            model: 'Option'
        }
    }).sort([['created', -1]])
    res.status(200).json({ exams });
};