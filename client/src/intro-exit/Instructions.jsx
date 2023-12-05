import { usePlayer, useGame} from "@empirica/core/player/classic/react";
import React, { useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Button } from "../components/Button";
import { Timer } from "../components/Timer";



function Highlight({ children }) {
  return <span className="rounded bg-yellow-200 px-1">{children}</span>;
}

export function Instructions({next}) {
  const player = usePlayer();
  const game = useGame();
  
  const instructions = player.get("instructions");
  const statedOpponent = player.get("statedOpponent");

  useLayoutEffect(() => {
    const scrollContainer = document.getElementById("scroll-container-instructions");
    scrollContainer.scrollTop = 0;
  }, []);

  return (
    <div id="scroll-container-instructions" className="h-full w-full justify-center  overflow-auto lg:grid xl:items-center">
      <div className="lt-lg:bottom-0 absolute w-full text-center lg:top-0">
        <div className="lt-lg:mb-2 inline-block px-4 py-1 lg:mt-2">
          <Timer />
        </div>
      </div>

      {/* max-w-screen-lg */}
      <div className="lt-lg:pb-20 prose prose-bluegray w-full max-w-prose p-8 lg:pt-12">
        <h3 className="mt-0">Instructions</h3>

        <p>Here are the instructions for this negotiation simulation. Please read through this before proceeding. </p>

        <div className="flex">
          <div className="w-prose rounded-lg bg-gray-50 px-6 py-2 shadow-sm ring-1 ring-gray-900/5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{instructions}</ReactMarkdown>
          </div>
        </div>

        <p>
          <em>
            Please note that these instructions will always be accessible to you
            during the negotiation.
          </em>
        </p>

        {!player.stage.get("submit") ? 
          <div className="flex justify-end">
            <div className="mt-4">
              <Button onClick={() => player.stage.set("submit", true)} autoFocus scrollToTop>
                Next
              </Button>
            </div>
          </div> : 
          <h3 style={{backgroundColor:"#e8e8e8", padding:"2rem", borderRadius:"0.4rem"}}>Please wait for the other participant...</h3>
        }
      </div>
    </div>
  );
}