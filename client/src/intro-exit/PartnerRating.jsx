// @ts-check
// @ts-ignore
import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Questions } from "../components/Questions";

const defaultOptions = {
  1: "Not at all",
  2: "A little",
  3: "A moderate amount",
  4: "A lot",
  5: "A great deal",
};

const questions = [
  {
    question: <>How <strong>assertive</strong> was your counterpart?</>,
    name: "pr-q1",
    options: defaultOptions,
  },
  {
    question: <>How much <strong>empathy</strong> did your counterpart convey?</>,
    name: "pr-q2",
    options: defaultOptions,
  },
  {
    question: <>How <strong>warm</strong> was your counterpart?</>,
    name: "pr-q3",
    options: defaultOptions,
  },
  {
    question: <>How <strong>dominant</strong> was your counterpart?</>,
    name: "pr-q4",
    options: defaultOptions,
  },
];

export function PartnerRatingSurvey({ next }) {
  return (
    <div className="mx-auto mt-3 w-full max-w-screen-md p-20 sm:mt-5">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Partner rating
      </h3>
      <p className="mt-2 text-gray-500">
        Recollecting the negotiation you just had, please answer the following
        questions about your counterpart.
      </p>

      <div className="mt-3">
        <Questions
          playerKey="partnerRatingSurvey"
          questions={questions}
          onDone={next}
          groupSize={4}
        />
      </div>
    </div>
  );
}
