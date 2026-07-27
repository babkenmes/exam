'use client'

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { Wizard, useWizard } from "react-use-wizard";
import Exam from "../../Models/Exam"
import ExamQuestion from "../../Models/ExamQuestion";
import { AnswerQuestion, EndExam, GetNewExam } from "../../Helpers/Exam";

export default function StartedExam() {
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

  const router = useRouter();

  const handleReset = useCallback(async () => {
    router.push(`/`)
  }, [router])

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
