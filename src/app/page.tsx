'use client'

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GetNewExam } from "../Helpers/Exam";

export default function Home() {

  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleStart = useCallback(async () => {
    setLoading(true)

    const exam = GetNewExam()
    setLoading(false)
    router.push(`/exam`)

  }, [router])

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
