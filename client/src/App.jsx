import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { SubjectiveValueSurvey } from "./intro-exit/SubjectiveValueSurvey";
import { Consent } from "./intro-exit/Consent";
import { Result } from "./intro-exit/Result";
import { PartnerRatingSurvey } from "./intro-exit/PartnerRating";
import { Strategy } from "./intro-exit/Strategy";
//import { HumannessQuestion } from "./intro-exit/HumannessQuestion"; //commented out for now
import { Demographic } from "./intro-exit/Demographic";
import { Introduction } from "./intro-exit/Introduction";
import { InstructionsTwo } from "./intro-exit/InstructionsTwo";
import { FinishedSubmissionCode } from "./intro-exit/FinishedSubmissionCode";
import { PlayerCreate } from "./intro-exit/PlayerCreate"
import { GamesFull } from "./intro-exit/GamesFull";

import {Lobby} from "./intro-exit/Lobby.jsx"

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Introduction, InstructionsTwo];
  }

  function exitSteps({ game, player }) {
    if(player.get("ended") === "game ended"){
      return [
        Result,
        SubjectiveValueSurvey,
        PartnerRatingSurvey,
        Strategy,
        //HumannessQuestion,
        Demographic,
      ];
    }
    else{
      return [GamesFull]
    }
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="relative h-screen">
        <EmpiricaMenu />
        <div id="scroll-container" className="h-full overflow-auto">
          <EmpiricaContext
            introSteps={introSteps}
            exitSteps={exitSteps}
            consent={Consent}
            finished={FinishedSubmissionCode}
            playerCreate={PlayerCreate}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
