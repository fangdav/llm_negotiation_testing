import React from "react";
import { Chat } from "./components/Chat";
import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "./constants";

function randID() {
  return Math.random().toString(16).slice(8);
}

export function ChatView({ game, player, stage, round }) {
  function mapChatLog(messages) {
    const mappedMessages = messages.map(function (message) {
      return { role: message.agentType, content: message.text };
    });
    mappedMessages.splice(0, 0, {
      role: game.get("treatment").llmPromptRole,
      content: `${game.get("treatment").llmPrompt}. Your demeanor should be ${
        game.get("treatment").llmDemeanor
      }.`,
    });
    // mappedMessages.splice(0, 0, {"role": "system", "content": `${game.get("treatment").llmPrompt}`})
    return mappedMessages;
  }

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // async function getLLMResponse(prompt){
  //     var response = await openai.createCompletion({
  //         model: "text-davinci-003",
  //         prompt: prompt,
  //         temperature: 0,
  //         max_tokens: 30,
  //       });
  //     //   console.log(prompt)
  //     //   console.log(response.data.choices[0]["text"]);
  //     return(response.data.choices[0]["text"])
  // }

  async function getChatResponse(mappedMessages) {
    var response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: mappedMessages,
      temperature: game.get("treatment").temperature,
    });
    console.log(response);

    return response.data.choices[0].message.content;
  }

  return (
    <div className="h-full max-w-5xl mx-auto">
      <div className="pr-20 h-full ">
        <Chat
          messages={game.get("messages") || []}
          avatar={`https://avatars.dicebear.com/api/identicon/1.svg`}
          onNewMessage={(t) => {
            const text = t.trim();

            if (text.length === 0) {
              return;
            }

            game.set("messages", [
              ...(game.get("messages") || []),
              {
                text,
                avatar: `https://avatars.dicebear.com/api/identicon/1.svg`,
                playerId: player._id,
                gamePhase: `Round ${round.index} - ${stage.name}`,
                id: randID(),
                timestamp: Date.now(),
                agentType: "user",
              },
            ]);

            getChatResponse(mapChatLog(game.get("messages"))).then(
              (llmReply) => {
                game.set("messages", [
                  ...(game.get("messages") || []),
                  {
                    text: llmReply,
                    avatar:
                      "https://www.iconarchive.com/download/i106658/diversity-avatars/avatars/robot-01.1024.png",
                    playerId: player._id,
                    gamePhase: `Round ${round.index} - ${stage.name}`,
                    id: randID(),
                    timestamp: Date.now(),
                    agentType: "assistant",
                  },
                ]);
              }
            );

            // getLLMResponse(text).then((llmReply => {
            //     game.set("messages", [
            //         ...(game.get("messages") || []),
            //         {
            //           text: llmReply,
            //           avatar: <img
            //           className="h-full w-full rounded-md shadow bg-white p-1"
            //           src={`https://avatars.dicebear.com/api/identicon/2.svg`}
            //           alt="Avatar"
            //         />,
            //           playerId: player._id,
            //           gamePhase: `Round ${round.index} - ${stage.name}`,
            //           id: randID(),
            //           timestamp: Date.now(),
            //           agentType: "assistant"
            //         },
            //       ]);
            // }))
          }}
        />
      </div>
    </div>
  );
}
