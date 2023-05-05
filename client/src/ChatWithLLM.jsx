// @ts-check
import React from "react";
import { ChatCommon } from "./ChatCommon";
import { CHAT_API_PORT } from "./constants";
import { randID } from "./utils";

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
  const messages = game.get("messages") || [];

  const playerId = player.id;
  const assistantPlayerId = `${player.id}-assistant`;

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

    try {
      const messagesWithUserMessage = [
        ...messages,
        {
          type: "message",
          text,
          playerId,
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "user",
        },
      ];
      game.set("messages", messagesWithUserMessage);

      game.set("currentTurnPlayerId", assistantPlayerId);

      try {
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
            playerId: `${player.id}-assistant`,
            gamePhase: `Round ${round.index} - ${stage.name}`,
            id: randID(),
            timestamp: Date.now(),
            agentType: "assistant",
          },
        ];
        game.set("messages", messagesWithLLMResponse);
        game.set("currentTurnPlayerId", playerId);
      } catch (err) {
        // Make sure that the turn is returned to the player if there is an error
        game.set("currentTurnPlayerId", playerId);
        throw err;
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <ChatCommon
      game={game}
      player={player}
      round={round}
      stage={stage}
      onNewMessage={onNewMessage}
      playerId={playerId}
      otherPlayerId={assistantPlayerId}
    />
  );
}
