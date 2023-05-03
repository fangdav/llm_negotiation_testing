import React, { useState } from "react";
import { Chat } from "./components/Chat";
import { CHAT_API_PORT } from "./constants";

function randID() {
  return Math.random().toString(16).slice(8);
}

const dealEndPrompt = `When a deal has been reached, output a single line that contains a string [DEAL REACHED] and the agreed upon amount, for example "[DEAL REACHED] $200", if the agreed upon amount is $200. If you decide an agreement cannot be met and would rather walk away, output a single line with a string [NO DEAL]. Do not output any other messages, do not format your response. Your output will be parsed by a computer.`;

export function ChatView({ game, player, stage, round }) {
  const [busy, setBusy] = useState(false);

  function convertChatToOpenAIMessages(messages) {
    const mappedMessages = messages.map((message) => ({
      role: message.agentType,
      content: message.text,
    }));
    mappedMessages.splice(0, 0, {
      role: game.get("treatment").llmPromptRole,
      content: `${game.get("treatment").llmPrompt}. Your demeanor should be ${
        game.get("treatment").llmDemeanor
      }.`,
    });
    mappedMessages.push({
      role: "system",
      content: dealEndPrompt,
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
          busy={busy}
          messages={game.get("messages") || []}
          avatar={`https://avatars.dicebear.com/api/identicon/1.svg`}
          onNewMessage={async (t) => {
            const text = t.trim();

            if (text.length === 0) {
              return;
            }

            setBusy(true);

            try {
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

              const chatResponse = await getChatResponse(game.get("messages"));

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
            } catch (err) {
              console.error(err);
              return;
            }

            setBusy(false);
          }}
        />
      </div>
    </div>
  );
}
