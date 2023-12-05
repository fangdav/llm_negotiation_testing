import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";




function Highlight({ children }) {
  return <span className="rounded bg-yellow-200 px-1">{children}</span>;
}

export function Introduction({next}) {
  const player = usePlayer();
  const game = useGame();
  
  const {
    firstPlayerInstructions: firstPlayerInstructionsShort,
    secondPlayerInstructions: secondPlayerInstructionsShort,
    firstPlayerStatedOpponent,
    secondPlayerStatedOpponent,
    llmStartsFirst,
    playerCount,
  } = game.get("treatment");

  // const instructions = player.get("instructions");
  // const statedOpponent = player.get("statedOpponent");
  
  

  return (
    <div className="w-full justify-center lg:grid xl:items-center">
      <div className="lt-lg:bottom-0 absolute w-full text-center lg:top-0">
        <div className="lt-lg:mb-2 inline-block px-4 py-1 lg:mt-2">
          {/* <Timer /> */}
        </div>
      </div>

      {/* max-w-screen-lg */}
      <div className="lt-lg:pb-20 prose prose-bluegray w-full max-w-prose p-8 lg:pt-12">
        <h3 className="mt-0">Introduction</h3>

        <p>
          In this task, you will be asked to participate in a{" "}
          <strong>negotiation</strong> with another party. You will have a greater chance of receieving a {" "}
          <strong>$10 bonus compensation</strong> based on{" "}
          <strong>how well you do </strong> on the negotiation (ie., the number of points you earn in your negotiation) 
          relative to other participants.
        </p>

        <p>
          At any time in the negotiation, you are able to send the other party{" "}
          <strong>an offer</strong> which they can <strong>accept</strong> or{" "}
          <strong>reject</strong>, as well as <strong>walk away</strong> from
          the negotiation (i.e., end the negotiation). The{" "}
          <strong>same features</strong> are given to the{" "}
          <strong>other party</strong>. The other party is able to send you
          offers or walk away from the negotiation. At any time, if either you or the other party 
          walks away from the negotiation, the negotiation will end without reaching a deal.
        </p>


        {secondPlayerStatedOpponent && (
          <p className="text-bluegray-700 font-medium">
            You will be negotiating with{" "}
            <strong>
              {secondPlayerStatedOpponent === "ai" ? "an A.I." : "a human"} negotiator.
            </strong>
          </p>
        )}

        <div className="flex justify-end">
          <div className="mt-4">
            <Button onClick={next} autoFocus scrollToTop>
              Understood
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
