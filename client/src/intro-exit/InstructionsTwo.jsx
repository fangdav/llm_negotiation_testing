import { usePlayer, useGame} from "@empirica/core/player/classic/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../components/Button";
import { Timer } from "../components/Timer";



function Highlight({ children }) {
  return <span className="rounded bg-yellow-200 px-1">{children}</span>;
}

export function InstructionsTwo({next}) {
  

  return (
    <div className="w-full justify-center lg:grid xl:items-center">
      <div className="lt-lg:bottom-0 absolute w-full text-center lg:top-0">
        <div className="lt-lg:mb-2 inline-block px-4 py-1 lg:mt-2">
          {/* <Timer /> */}
        </div>
      </div>

      {/* max-w-screen-lg */}
      <div className="lt-lg:pb-20 prose prose-bluegray w-full max-w-prose p-8 lg:pt-12">
        <h3 className="mt-0">Your bonus will depend on your negotiation outcome. Please review the following information before beginning:</h3><br/>
        <ul>
          <li>You will have 10 minutes to negotiate with your counterpart.</li><br/>
          <li>On the next screen, you will see information about your role and be able to chat with your counterpart.</li><br/>
          <li>If you or your counterpart decide to walk away from the negotiation without a deal (or time runs out before you make a deal), <strong>your "score" will be 500 points</strong>, as will be described in the instructions on the next page.</li><br/>
          <li>Transcripts will be reviewed to check that participants are actively negotiating.</li><br/>
          <li>Your bonus payment will be contingent on how your final negotiated outcome ranks among all other participants. <strong> Your odds of winning a $10 bonus are proportional to how many points you earn in your negotiation relative to others. </strong> Bonuses will be processed within a maximum of two days.</li><br/>
        </ul>

        <div className="flex justify-end">
          <div className="mt-4">
            <Button onClick={next} autoFocus scrollToTop>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
