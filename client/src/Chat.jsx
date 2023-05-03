import React from "react";
import { Chat } from "./components/Chat";
import { CHAT_API_PORT } from "./constants";

function randID() {
  return Math.random().toString(16).slice(8);
}

export function ChatView({ game, player, stage, round }) {
  function convertChatToOpenAIMessages(messages) {
    const mappedMessages = messages.map(function (message) {
      return { role: message.agentType, content: message.text };
    });
    mappedMessages.splice(0, 0, {
      role: game.get("treatment").llmPromptRole,
      content: `${game.get("treatment").llmPrompt}. Your demeanor should be ${
        game.get("treatment").llmDemeanor
      }.`,
    });
    return mappedMessages;
  }

  async function getChatResponse(messages) {
    const apiUrl = `http://localhost:${CHAT_API_PORT}/chat`;

    const openAIMessages = convertChatToOpenAIMessages(messages);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: openAIMessages,
        temperature: game.get("treatment").temperature,
      }),
    });

    const { chatResponse } = await response.json();

    return chatResponse;
  }

  return (
    <div
      className="overflow-y-auto h-full max-w-5xl mx-auto"
      style={{ maxHeight: "90vh" }}
    >
      <div className="pr-20 h-full ">
        <Chat
          messages={game.get("messages") || []}
          avatar={`https://avatars.dicebear.com/api/identicon/1.svg`}
          onNewMessage={async (t) => {
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

            let chatResponse;
            try {
              chatResponse = await getChatResponse(game.get("messages"));
            } catch (err) {
              console.error(err);
              return;
            }

            game.set("messages", [
              ...(game.get("messages") || []),
              {
                text: chatResponse,
                avatar:
                  "https://www.iconarchive.com/download/i106658/diversity-avatars/avatars/robot-01.1024.png",
                playerId: player._id,
                gamePhase: `Round ${round.index} - ${stage.name}`,
                id: randID(),
                timestamp: Date.now(),
                agentType: "assistant",
              },
            ]);
          }}
        />
      </div>
    </div>
  );
}
