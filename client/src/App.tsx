import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import './App.css';
import { useCallback, useEffect, useState } from "react";
import Exam, { ExamResult } from "./Models/Exam"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import ExamQuestion from "./Models/ExamQuestion";
import { Wizard, useWizard } from "react-use-wizard";
import QuestionOption from "./Models/QuestionOption";

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
            <Route path="/exams" element={<CreateAxam />} />
            <Route path="/start" element={<ExamComponent />} />
            <Route path="/exam/:id" element={<StartedExam />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

function Home() {

  const [refId, setRefId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleRefidChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefId(e.target.value)
  }

  const handleStart = useCallback(async () => {
    setLoading(true)
    const response = await (await fetch("/api/exam/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refId: `demo_${(Math.round(Math.random() * 10000)).toString()}` }),
    })).json()

    const exam = response?.exam
    await (await fetch(`/api/exam/start?code=${exam.code}`)).json()
    setLoading(false)
    navigate(`/exam/${exam._id}`)

  }, [refId])

  return <div>
    <div className="text-center">
      <p className="mx-auto text-lg max-w-xl mt-32 md:mt-2">
        Բարի գալուստ առաջին անգամ զենքի ձեռքբերման տեսական քննությանը նախապատրաստվելու համար ստեղծված թեստային հարթակ։
      </p>
    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={handleStart}
          className="flex w-full justify-center rounded-md disabled:bg-slate-700 bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Սկսել
        </button>
      </div>
    </div>
  </div >
}

function CreateAxam() {

  const [refId, setRefId] = useState<string>()
  const [exams, setExams] = useState<Exam[]>()

  useEffect(() => {
    getExams()
  }, [])

  const getExams = async () => {
    const res = await (await fetch(`/api/exam/getall`)).json()
    setExams(res?.exams)
  }

  const handleRefidChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefId(e.target.value)
  }

  const handleCreate = useCallback(async () => {
    const response = await (await fetch("/api/exam/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refId }),
    })).json()
    const exam = response?.exam
    getExams()
  }, [refId])

  return <div>
    <div className="text-center">Նոր քննություն</div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
          Հղման համար
        </label>
        <div className="mt-2">
          <input
            id="refId"
            name="refId"
            type="text"
            required
            onChange={handleRefidChange}
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-azatazen-primary sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex w-full justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Ստեղծել
        </button>
      </div>
    </div>
    {
      exams && Number(exams?.length) > 0 &&
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
        <ul className="divide-y divide-white/5">
          {exams.map((exam) => {
            let correctAnswers = 0
            exam.questions?.forEach(q => {
              if ((q.answer as QuestionOption)?.is_correct)
                correctAnswers++
            })
            return (
              <li key={exam._id} className="py-4">
                <div className="flex items-center gap-x-3">
                  <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">{exam.refId}</h3>
                  {
                    exam.endDate && Number(exam.questions?.length) > 0 &&
                    <div className="flex-none text-xs text-gray-500">
                      {correctAnswers}/{exam.questions?.length}
                    </div>
                  }
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    }
  </div >
}


function ExamComponent() {

  const [code, setCode] = useState<string>()
  const navigate = useNavigate();

  const onStart = useCallback(async () => {
    const res = await (await fetch(`/api/exam/start?code=${code}`)).json()
    navigate(`/exam/${res.exam._id}`)
  }, [code])

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
  }

  return <div>
    <div className="text-center">Քննություն</div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
          Անհատական կոդ
        </label>
        <div className="mt-2">
          <input
            id="refId"
            name="refId"
            type="text"
            required
            onChange={handleCodeChange}
            className="block w-full cursor-pointer rounded-md border-0 bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-azatazen-primary sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={onStart}
          className="flex w-full cursor-pointer justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Սկսել
        </button>
      </div>
    </div>
  </div>
}


function StartedExam() {
  let { id } = useParams();
  const [exam, setExam] = useState<Exam>()
  const [time, setTime] = useState<number>()
  const [cachedData, setCachedData] = useState<{ [key: string]: string }>({})
  console.log("cachedData", cachedData)
  const updateCache = (key: string, value: string) => {
    setCachedData(d => ({ ...cachedData, [key]: value }))
  }
  useEffect(() => {
    if (id)
      getExam(id)
  }, [id])

  useEffect(() => {
    const timer = setInterval(() => {
      if (exam) {
        exam?.startDate && setTime((30 * 60) - Math.floor((Date.now() - new Date(exam.startDate).getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam])

  const getExam = async (id: string) => {
    const res = await (await fetch(`/api/exam/getexam?id=${id}`)).json()
    setExam(res?.exam)
  }
  if (!id) {
    return <></>
  }
  const expired = time && Number(time) <= 0

  return <div>
    <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 rounded-lg bg-neutral-700/30">
      <div>Քննություն #{exam?.refId}</div>

      {/* <div>Կոդ {exam?.code}</div> */}
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
          <ExamResults examId={id} />
        </div>
        :
        <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
          <Wizard>
            {
              exam?.questions?.map((q, index) => <QuestionStep
                cachedData={cachedData}
                updateCache={updateCache}
                key={q._id}
                index={index}
                question={q}
                refetchExam={getExam}
                examId={id as string} />)
            }
          </Wizard>
        </div>

    }
  </div>
}

function ExamResults({ examId }: { examId: string }) {
  const [correctAnswers, setCorrectAnswers] = useState<number>()
  const [exam, setExam] = useState<ExamResult>()

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await (await fetch(`/api/exam/examResults?id=${examId}`)).json()
      setCorrectAnswers(res?.correctAnswersCount)
      setExam(res?.exam)
    })()
  }, [examId])

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
        return <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
          <div className="space-y-6">
            <p className="text-white text-base font-semibold">{question?.question.text}</p>
            <fieldset className="mt-4" id={index.toString()}>
              <legend className="sr-only">Question</legend>
              <div className="mt-4 divide-y divide-gray-700 border-b border-t border-gray-700">
                {question?.question?.options?.map((option) => {
                  return (
                    <div key={option._id} className="grid grid-cols-8 items-center py-4">
                      <input
                        id={option._id}
                        name={index.toString()}
                        type="radio"
                        checked={option._id === question.answer?._id}
                        className="h-[20px] w-[20px] inline"
                      />
                      <label htmlFor={option._id} className={`${option._id === question.answer?._id ? (question.answer.is_correct ? 'text-green-300' : 'text-red-300') : option.is_correct ? 'text-green-300' : 'text-gray-300'}  col-span-7 cursor-pointer block text-sm font-medium leading-6 `}>
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


function QuestionStep({ question, examId, refetchExam, index, updateCache, cachedData }
  : {
    question: ExamQuestion,
    examId: string;
    refetchExam: (id: string) => Promise<void>,
    index: number,
    cachedData: { [key: string]: string },
    updateCache: (key: string, value: string) => void
  }) {
  const { nextStep, isLastStep, previousStep, isFirstStep } = useWizard();

  const initialValue = cachedData[question._id] ? cachedData[question._id] : question?.answer as string

  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(initialValue)
  const [loading, setLoading] = useState(false)

  const handleInputChange = useCallback(async (optionId: string) => {
    setSelectedOptionId(optionId)
    updateCache(question._id, optionId)
  }, [question])

  const handleNext = useCallback(async () => {
    await fetch(`/api/exam/answer?questionId=${question._id}&answerId=${selectedOptionId}`)
    nextStep()
  }, [selectedOptionId, question])

  const handlePrevious = useCallback(async () => {
    selectedOptionId && await fetch(`/api/exam/answer?questionId=${question._id}&answerId=${selectedOptionId}`)
    previousStep()
  }, [selectedOptionId, question])

  const handleEndExam = useCallback(async () => {
    setLoading(true)
    await fetch(`/api/exam/answer?questionId=${question._id}&answerId=${selectedOptionId}`)
    await fetch(`/api/exam/end?id=${examId}`)
    await refetchExam(examId)
    setLoading(false)
    nextStep()
  }, [examId, selectedOptionId, question])


  return <div className="space-y-6">
    {index}/10
    <p className="text-white text-base font-semibold">{question.question.text}</p>
    <fieldset className="mt-4">
      <legend className="sr-only">Question</legend>
      <div className="mt-4 divide-y divide-gray-700 flex-shrink-0 border-b border-t border-gray-700">
        {question.question.options.map((option) => {
          return (
            <div key={option._id} className="flex shrink-0 space-x-2 items-center py-4">
              <input
                onChange={() => handleInputChange(option._id)}
                id={option._id}
                name="notification-method"
                type="radio"
                checked={selectedOptionId === option._id}
                className="h-5 w-5 inline shrink-0 "
              />
              <label htmlFor={option._id} className="col-span-7 shrink md:col-span-11 cursor-pointer block text-sm font-medium leading-6 text-gray-300">
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
          disabled={!selectedOptionId || loading}
          onClick={handleEndExam}
          className="flex w-full disabled:bg-neutral-500 disabled:text-slate-300 disabled:cursor-not-allowed justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
        >
          Ավարտել քննությունը
        </button>
          :
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOptionId}
            className="grow flex items-center w-full disabled:bg-neutral-500 disabled:cursor-not-allowed disabled:text-slate-300 justify-center rounded-md bg-azatazen-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-azatazen-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azatazen-primary"
          >
            <span className="grow content-start text-left">Հաջորդը</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
      }
    </div>
  </div>
}

function correctAnswer({ question }: { question: ExamQuestion }) {
  return <div className="space-y-4">
    <p className="text-white text-base font-semibold">{question.question.text}</p>
    <fieldset className="mt-4">
      <legend className="sr-only">Notification method</legend>
      <div className="space-y-4">
        {question.question.options.map((option) => (
          <div key={option._id} className="flex items-center">
            <input
              id={option._id}
              name="notification-method"
              type="radio"
              defaultChecked={question?.answer === option._id}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
            />
            <label htmlFor={option._id} className="cursor-pointer ml-3 block text-sm font-medium leading-6 text-gray-300">
              {option.text}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  </div>
}



export default App;
