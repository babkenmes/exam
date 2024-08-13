import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import { useCallback, useEffect, useState } from "react";
import Exam from "./Models/Exam"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import ExamQuestion from "./Models/ExamQuestion";
import { Wizard, useWizard } from "react-use-wizard";
import { AnswerQuestion, EndExam, GetNewExam } from "./Helpers/Exam";

const Logo = () => {
  return (
    <svg className='h-11 w-auto m-auto' id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580.77 121.4"><defs></defs><path className="cls-1" d="M189.54,94.93V0h22.09V117ZM173.92,0V101.4l20,20H151.83V0Z" /><path className="cls-1" d="M113.25,20.15H98.38V48.32H76.29V14.88L92.26,0h43.08V85.2L127,101.4h8.37v20h-59V88.57H98.38V101.4h5.35L113.25,83Z" /><polygon className="cls-1" points="580.77 121.4 518.53 121.4 518.53 22.09 496.44 22.09 496.44 0 518.53 0 540.62 0 540.62 101.4 558.68 101.4 558.68 68.71 580.77 68.71 580.77 121.4" /><polygon className="cls-1" points="454.36 121.4 454.36 0 476.44 0 476.44 41.85 496.44 41.85 496.44 61.85 476.44 61.85 476.44 101.4 507.34 101.4 507.34 121.4 454.36 121.4" /><polygon className="cls-1" points="286.03 121.4 228.12 121.4 228.12 72.54 250.21 72.54 250.21 101.4 263.94 101.4 263.94 68.61 228.87 42.17 228.87 0 285.44 0 285.44 31.34 265.39 31.34 265.39 20.15 250.96 20.15 250.96 33.91 286.03 60.27 286.03 121.4" /><path className="cls-1" d="M340.23,94.93V0h22.09V117ZM324.61,0V101.4l20,20H302.52V0Z" /><path className="cls-1" d="M415.77,20.15H400.9V48.32H378.81V14.88L394.78,0h43.08V85.2l-8.37,16.2h8.37v20H378.81V88.57H400.9V101.4h5.35L415.77,83Z" /><path className="cls-1" d="M37.71,94.93V51.21l14.9-14.9-14.9-14.9V0H59.8V117ZM22.09,0V103.33L40.16,121.4H0V0Z" /></svg>
  )
}

function App() {
  return (
    <div className="container mx-auto text-slate-300 w-full p-4 bg-neutral-800">
      <div className="md:pt-8">
        <Logo />
      </div>
      <div className="mx-auto max-w-2xl md:py-32 ">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam" element={<StartedExam />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

function Home() {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleStart = useCallback(async () => {
    setLoading(true)

    const exam = GetNewExam()
    setLoading(false)
    navigate(`/exam`)

  }, [])

  return <div>
    <div className="text-center">
      <p className="mx-auto text-lg max-w-xl mt-32 md:mt-2">
        Այստեղ կարող եք առցանց փորձել տեսական քննությունը, պատասխանելով հարցաշարից 10 պատահական հարցերի, ինչպես որ կլինի իրական քննության ընթացքում։
        Ուշադրություն․ մեկ-երկու անգամ այս թեստը հաջող անցնելը դեռ չի նշանակում որ նույնը կհաջողվի քննության ժամանակ։ Խորհուրդ ենք տալիս կարդալ ամբողջ <a target="_blank" className="underline text-azatazen-primary text-dec " href="https://drive.google.com/file/d/1BvbG--ORjZWiGU0CKMptprdCG8HmN1zV/view?usp=drive_link">հարցաշարը</a> և թեստը փորձել բազմաթիվ անգամ։      </p>
    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={handleStart}
          className="flex w-full justify-center rounded-md disabled:bg-slate-700 bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Սկսել քննությունը
        </button>
      </div>
    </div>
  </div >
}

function StartedExam() {
  const [exam, setExam] = useState<Exam>()
  const [time, setTime] = useState<number>()

  useEffect(() => {
    const examString = localStorage.getItem('exam')
    const exam = examString ? JSON.parse(examString) : null
    if (exam) {
      setExam(exam)
    }
    else {
      const newExam = GetNewExam()
      setExam(newExam)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (exam) {
        const timePassed = Math.floor((Date.now() - new Date(exam.startDate).getTime()) / 1000)
        if (timePassed > 0)
          exam?.startDate && setTime((30 * 60) - Math.floor((Date.now() - new Date(exam.startDate).getTime()) / 1000));
        else
          setTime(timePassed)
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [exam])

  const expired = time && Number(time) <= 0
  const handleAnswer = useCallback((question: number, answer: number) => {
    if (!exam)
      throw new Error('Exam not found')
    const updatedExam = AnswerQuestion(exam, question, answer)
    setExam(updatedExam)
  }, [exam])

  if (!exam)
    return <></>

  return <div>
    <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 rounded-lg bg-neutral-700/30">
      <div>Քննություն #____</div>
      {
        expired || exam?.endDate ?
          <div>Քննությունն ավարտվել է</div>
          :
          <>{time && <div>Ժամանակ {new Date(time * 1000).toISOString().substring(14, 19)}</div>}</>
      }
    </div>

    {
      exam?.endDate || (expired) ?
        <div>
          <ExamResults exam={exam} />
        </div>
        :
        <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
          <Wizard>
            {
              exam?.questions?.map((q, index) => <QuestionStep
                key={index}
                index={index}
                question={q}
                answer={handleAnswer}
                endExam={() => EndExam(exam)}
              />)
            }
          </Wizard>
        </div>

    }
  </div>
}

function ExamResults({ exam }: { exam: Exam }) {

  const correctAnswers = exam?.questions?.filter(q => q.answer !== undefined && q.question.options[q.answer].is_correct).length

  const navigate = useNavigate();

  const handleReset = useCallback(async () => {
    navigate(`/`)
  }, [])

  return <div className="space-y-4">
    <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
      <div>Քննության արդյունքները</div>
      <div className="space-x-2 flex items-center">
        <span className="text-slate-400">Ճիշտ պատասխան՝</span> {exam ? <span>{correctAnswers} / {exam?.questions?.length}</span> : <div className="h-4 w-20 animate-pulse bg-gray-500 rounded"></div>}
      </div>
    </div>
    <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 rounded-lg">
      <button
        type="button"
        onClick={handleReset}
        className="flex w-full justify-center rounded-md disabled:bg-slate-700 bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
      >
        Կրկին փորձել
      </button>
    </div>
    {
      exam?.questions?.map((question, index) => {
        return <div key={index} className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
          <div className="space-y-6">
            <p className="text-white text-base font-semibold">{question?.question.text}</p>
            <fieldset className="mt-4" id={index.toString()}>
              <legend className="sr-only">Question</legend>
              <div className="mt-4 divide-y divide-gray-700 border-b border-t border-gray-700">
                {question?.question?.options?.map((option, option_index) => {
                  return (
                    <div key={option_index} className="grid grid-cols-8 items-center py-4">
                      <input
                        id={option_index.toString()}
                        name={index.toString()}
                        type="radio"
                        readOnly={true}
                        checked={option_index === question.answer}
                        className="h-[20px] w-[20px] inline"
                      />
                      <label htmlFor={option_index.toString()} className={`${option_index === question.answer ? (option.is_correct ? 'text-green-300' : 'text-red-300') : option.is_correct ? 'text-green-300' : 'text-gray-300'}  col-span-7 cursor-pointer block text-sm font-medium leading-6 `}>
                        {option.text}
                      </label>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          </div>
        </div>
      })
    }
  </div >

}


function QuestionStep({ question, index, answer, endExam }
  : {
    question: ExamQuestion,
    index: number,
    answer: (question: number, answer: number) => void,
    endExam: () => void,
  }) {
  const { nextStep, isLastStep, previousStep, isFirstStep } = useWizard();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | undefined>(question.answer)
  const [loading, setLoading] = useState(false)

  const handleInputChange = useCallback(async (optionId: number) => {
    setSelectedOptionIndex(optionId)
  }, [question])

  const handleNext = useCallback(async () => {
    selectedOptionIndex !== undefined && answer(index, selectedOptionIndex)
    nextStep()
  }, [selectedOptionIndex, index])

  const handlePrevious = useCallback(async () => {
    selectedOptionIndex !== undefined && answer(index, selectedOptionIndex)
    previousStep()
  }, [selectedOptionIndex, index])

  const handleEndExam = useCallback(async () => {
    setLoading(true)
    selectedOptionIndex !== undefined && answer(index, selectedOptionIndex)
    endExam()
    setLoading(false)
    nextStep()
  }, [selectedOptionIndex, question])


  return <div className="space-y-6">
    {index + 1}/10
    <p className="text-white text-base font-semibold">{question.question.text}</p>
    <fieldset className="mt-4">
      <legend className="sr-only">Question</legend>
      <div className="mt-4 divide-y divide-gray-700 flex-shrink-0 border-b border-t border-gray-700">
        {question.question.options.map((option, option_index) => {
          return (
            <div key={option_index} className="flex shrink-0 space-x-2 items-center py-4">
              <input
                onChange={() => handleInputChange(option_index)}
                id={option_index.toString()}
                name="notification-method"
                type="radio"
                checked={selectedOptionIndex === option_index}
                className="h-5 w-5 inline shrink-0 "
              />
              <label htmlFor={option_index.toString()} className="col-span-7 shrink md:col-span-11 cursor-pointer block text-sm font-medium leading-6 text-gray-300">
                {option.text}
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
    <div className="flex grow space-x-2">
      {
        !isFirstStep && <button
          type="button"
          disabled={loading}
          onClick={handlePrevious}
          className="basis-1/4 space-x-2 items-center flex w-full disabled:bg-neutral-500 disabled:cursor-not-allowed disabled:text-slate-300 justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="grow content-end text-right">Նախորդը</span>
        </button>
      }
      {
        isLastStep ? <button
          type="button"
          disabled={selectedOptionIndex === undefined || loading}
          onClick={handleEndExam}
          className="flex w-full disabled:bg-neutral-500 disabled:text-slate-300 disabled:cursor-not-allowed justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Ավարտել քննությունը
        </button>
          :
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedOptionIndex === undefined}
            className="grow flex items-center w-full disabled:bg-neutral-500 disabled:cursor-not-allowed disabled:text-slate-300 justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
          >
            <span className="grow content-start text-left">Հաջորդը</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
      }
    </div>
  </div>
}


export default App;
