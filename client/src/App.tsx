import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import './App.css';
import { useCallback, useEffect, useState } from "react";
import Exam from "./Models/Exam"
import Question from "./Models/Question";
import ExamQuestion from "./Models/ExamQuestion";
import { Wizard, useWizard } from "react-use-wizard";
import QuestionOption from "./Models/QuestionOption";
function App() {
  return (
    <div className="container mx-auto text-slate-300 w-full p-4 bg-neutral-800">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exams" element={<CreateAxam />} />
          <Route path="/start" element={<ExamComponent />} />
          <Route path="/exam/:id" element={<StartedExam />} />
        </Routes>
      </BrowserRouter>
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
      <p className="mx-auto max-w-xl">
        Բարի գալուստ առաջին անգամ զենքի ձեռքբերման տեսական քննությանը նախապատրաստվելու համար ստեղծված թեստային հարթակ։
      </p>
      {/* <p>
        Թեստային հարթակը հնարավորություն է տալիս՝

      </p>

      <ul>
        <li>Հարցերի միջև տեղաշարժվել,</li>
        <li>Հարցի պատասխանը տեղում ստուգել,</li>
        <li>Ճիշտ պատասխանն իմանալ։</li>
      </ul>
      <p>
        Իրական քննության ժամանակ, այս բոլոր հնարավորությունները բացակայելու են։
      </p>
      <p>
        Տեսական քննության բոլոր հարցերը հասանելի են հետևյալ հղումով։
      </p> */}

    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={handleStart}
          className="flex w-full justify-center rounded-md disabled:bg-slate-700 bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Ստեղծել
        </button>
      </div>
    </div>
    {
      exams && Number(exams?.length) > 0 &&
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4">
        <ul role="list" className="divide-y divide-white/5">
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
                {/* <p className="mt-3 truncate text-sm text-gray-500">
                  Կոդ <span className="text-gray-400">{exam.code}</span>
                </p> */}
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
            className="block w-full cursor-pointer rounded-md border-0 bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={onStart}
          className="flex w-full cursor-pointer justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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

  useEffect(() => {
    if (id)
      getExam(id)
  }, [id])

  useEffect(() => {
    console.log("exam", exam)
    if (exam) {
      const timer = setInterval(() => {
        console.log("exam?.startDate", exam?.startDate)

        exam?.startDate && setTime((30 * 60) - Math.floor((Date.now() - new Date(exam.startDate).getTime()) / 1000));
      }, 1000);
    }
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

    <div className="mt-10 sm:mx-auto space-y-4 max-w-3xl p-4 border border-indigo-950 rounded-lg bg-neutral-700/60">
      {
        exam?.endDate || (expired) ?
          <div>
            <ExamResults examId={id} />
          </div>
          : <Wizard>
            {
              exam?.questions?.map(q => <QuestionStep
                key={q._id}
                question={q}
                refetchExam={getExam}
                examId={id as string} />)
            }
          </Wizard>
      }
    </div>
  </div>
}

function ExamResults({ examId }: { examId: string }) {
  const [correctAnswers, setCorrectAnswers] = useState<number>()
  const [exam, setExam] = useState<Exam>()

  useEffect(() => {
    (async () => {
      const res = await (await fetch(`/api/exam/examResults?id=${examId}`)).json()
      setCorrectAnswers(res?.correctAnswersCount)
      setExam(res?.exam)
    })()
  }, [examId])

  return <div className="space-y-4">
    <div>Քննության արդյունքները</div>
    <div className="space-x-2">
      <span className="text-slate-400">Ճիշտ պատասխան՝</span> <span>{correctAnswers} / {exam?.questions?.length}</span>
    </div>
  </div>
}

function QuestionStep({ question, examId, refetchExam }: { question: ExamQuestion, examId: string; refetchExam: (id: string) => Promise<void> }) {
  const { nextStep, isLastStep } = useWizard();
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(question?.answer as string)

  const handleInputChange = useCallback(async (optionId: string) => {
    setSelectedOptionId(optionId)
  }, [question])

  const handleNext = useCallback(async () => {
    await fetch(`/api/exam/answer?questionId=${question._id}&answerId=${selectedOptionId}`)
    nextStep()
  }, [selectedOptionId, question])

  const handleEndExam = useCallback(async () => {
    await fetch(`/api/exam/answer?questionId=${question._id}&answerId=${selectedOptionId}`)
    await fetch(`/api/exam/end?id=${examId}`)
    await refetchExam(examId)
    nextStep()
  }, [examId, selectedOptionId, question])

  return <div className="space-y-4">
    <p className="text-white text-base font-semibold">{question.question.text}</p>
    <fieldset className="mt-4">
      <legend className="sr-only">Notification method</legend>
      <div className="space-y-4">
        {question.question.options.map((option) => {
          return (
            <div key={option._id} className="flex items-center">
              <input
                onChange={() => handleInputChange(option._id)}
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
          )
        })}
      </div>
    </fieldset>
    <div className="flex space-x-4">
      {
        isLastStep ? <button
          type="button"
          disabled={!selectedOptionId}
          onClick={handleEndExam}
          className="flex w-full disabled:bg-neutral-500 disabled:text-slate-300 disabled:cursor-not-allowed justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Ավարտել քննությունը
        </button>
          :
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleNext}
            className="flex w-full disabled:bg-neutral-500 disabled:cursor-not-allowed disabled:text-slate-300 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Հաջորդը
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
