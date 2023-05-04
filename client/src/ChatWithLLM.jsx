// @ts-check
import React, { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { CHAT_API_PORT } from "./constants";

function randID() {
  return Math.random().toString(16).slice(8);
}

const DEAL_REACHED = "[DEAL REACHED]";
const NO_DEAL = "[NO DEAL]";

const dealEndPrompt = `When a deal has been reached, output a single line that contains a string ${DEAL_REACHED} and the agreed upon amount, for example "${DEAL_REACHED} $200", if the agreed upon amount is $200.
If you decide an agreement cannot be met and would rather walk away, output a single line with a string ${NO_DEAL}.
Do not output any other messages, do not format your response. Your output will be parsed by a computer.
If the user rejects your proposal, continue negotiating.
If the user wants to continue negotiating, continue negotiating.`;

/**
 * @param {string} message
 * @return {{
 *    type: 'message',
 *    text: string,
 *  } | {
 *    type: 'proposal',
 *    text: string,
 *    proposal: number,
 *  } | {
 *    type: 'no-deal',
 *    text: string,
 *  }}
 */
const extractMessageProposal = (message) => {
  const hasProposal = message.includes(DEAL_REACHED);
  const hasNoDeal = message.includes(NO_DEAL);

  if (hasProposal) {
    const messageSplit = message.split(DEAL_REACHED);
    const proposal = messageSplit[1].trim();
    const messageWithoutProposal = messageSplit[0].trim();

    const hasDollarSign = proposal.includes("$");

    if (hasDollarSign) {
      const amount = proposal.split("$")[1].trim();

      return {
        type: "proposal",
        text: messageWithoutProposal,
        proposal: parseInt(amount),
      };
    } else {
      // Bail out if we have a deal reached but no dollar sign
      return {
        type: "message",
        text: messageWithoutProposal,
      };
    }
  } else if (hasNoDeal) {
    const messageSplit = message.split(NO_DEAL);
    const messageWithoutNoDeal = messageSplit[0].trim();
    return {
      type: "no-deal",
      text: messageWithoutNoDeal,
    };
  } else {
    return {
      type: "message",
      text: message,
    };
  }
};

export function ChatWithLLM({ game, player, stage, round }) {
  const [busy, setBusy] = useState(false);
  const messages = game.get("messages") || [];

  /**
   * @param {any[]} messages
   */
  function convertChatToOpenAIMessages(messages) {
    const mappedMessages = messages.map((message) => ({
      role: message.agentType,
      content:
        message.agentType === "user" ? message.text : message.originalText,
    }));
    mappedMessages.unshift(
      {
        role: game.get("treatment").llmPromptRole,
        content: `${game.get("treatment").llmPrompt}. Your demeanor should be ${
          game.get("treatment").llmDemeanor
        }.`,
      },
      {
        role: game.get("treatment").llmPromptRole,
        content: dealEndPrompt,
      }
    );
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

    if (response.status !== 200) {
      throw new Error(`Chat API returned status ${response.status}`);
    }

    const { chatResponse } = await response.json();

    return chatResponse;
  }

  const onNewMessage = async (newMessage) => {
    const text = newMessage.trim();

    if (text.length === 0) {
      return;
    }

    setBusy(true);

    try {
      const messagesWithUserMessage = [
        ...messages,
        {
          type: "message",
          text,
          avatar: `https://avatars.dicebear.com/api/identicon/1.svg`,
          playerId: player._id,
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "user",
        },
      ];
      game.set("messages", messagesWithUserMessage);

      const chatResponse = await getChatResponse(messagesWithUserMessage);
      const extracted = extractMessageProposal(chatResponse);

      const messagesWithLLMResponse = [
        ...messagesWithUserMessage,
        {
          type: extracted.type,
          ...(extracted.type === "proposal" && {
            proposal: extracted.proposal,
            proposalStatus: "pending",
          }),
          ...(extracted.type === "no-deal" && {
            noDealStatus: "pending",
          }),
          text: extracted.text,
          originalText: chatResponse,
          avatar:
            "https://www.iconarchive.com/download/i106658/diversity-avatars/avatars/robot-01.1024.png",
          playerId: player._id,
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "assistant",
        },
      ];

      console.log("messagesWithLLMResponse", messagesWithLLMResponse);

      game.set("messages", messagesWithLLMResponse);
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onAccept = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "proposal") {
        lastMessage.proposalStatus = "accepted";
        game.set("messages", [...messages]);

        // We might want to save this data to a stage or a round instead if the game can have multiple rounds
        game.set("result", "deal-reached");
        game.set("price", lastMessage.proposal);
        player.stage.set("submit", true);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onReject = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "proposal") {
        lastMessage.proposalStatus = "rejected";
        game.set("messages", [...messages]);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onEnd = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "no-deal") {
        lastMessage.noDealStatus = "ended";
        game.set("messages", [...messages]);

        // We might want to save this data to a stage or a round instead if the game can have multiple rounds
        game.set("result", "no-deal");
        player.stage.set("submit", true);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onContinue = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "no-deal") {
        lastMessage.noDealStatus = "continued";
        game.set("messages", [...messages]);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const hasProposalPending =
    messages[messages.length - 1]?.proposalStatus === "pending";
  const hasNoDealPending =
    messages[messages.length - 1]?.noDealStatus === "pending";

  const hasProposalAccepted =
    messages[messages.length - 1]?.proposalStatus === "accepted";
  const hasProposalRejected =
    messages[messages.length - 1]?.proposalStatus === "rejected";

  const hasNoDealEnded =
    messages[messages.length - 1]?.noDealStatus === "ended";
  const hasNoDealContinued =
    messages[messages.length - 1]?.noDealStatus === "continued";

  const chatEnded =
    hasProposalAccepted ||
    hasProposalRejected ||
    hasNoDealEnded ||
    hasNoDealContinued;

  const stageSubmitted = player.stage.get("submit");

  // This will submit the local player stage if the chat has ended by any of the players
  useEffect(() => {
    if (!stageSubmitted && chatEnded) {
      player.stage.set("submit", true);
    }
  }, [stageSubmitted, chatEnded]);

  return (
    <div
      className="overflow-y-auto h-full container mx-auto"
      style={{ maxHeight: "80vh" }}
    >
      <Chat
        busy={busy || stageSubmitted}
        messages={messages}
        avatar={`https://avatars.dicebear.com/api/identicon/1.svg`}
        onNewMessage={onNewMessage}
        onAccept={hasProposalPending ? onAccept : undefined}
        onReject={hasProposalPending ? onReject : undefined}
        onEnd={hasNoDealPending ? onEnd : undefined}
        onContinue={hasNoDealPending ? onContinue : undefined}
      />
    </div>
  );
}
