// @ts-check
import React, { useState } from "react";
import { Chat } from "./components/chat/Chat";
import useGameMechanics from "./useGameMechanics";
import { randID } from "./utils";

const getHumanNoDealBehavior = (game, player, players) => {
  const { firstPlayerNoDeal, secondPlayerNoDeal } = game.get("treatment");

  const isFirst = players[0].id === player.id;
  const playerNoDeal = isFirst ? firstPlayerNoDeal : secondPlayerNoDeal;

  const allowNoDeal = playerNoDeal !== "not-allowed";
  const unilateralNoDeal = playerNoDeal === "allowed-unilateral";

  return {
    allowNoDeal,
    unilateralNoDeal,
  };
};

export function ChatCommon({
  game,
  player,
  players,
  round,
  stage,
  onNewMessage: onNewMessageImpl,
  onNewNoDeal: onNewNoDealImpl = undefined,
  onNewProposal: onNewProposalImpl = undefined,
  otherPlayerTyping = false,
}) {
  const [busy, setBusy] = useState(false);

  const {
    messages,
    setMessages,
    switchTurns,
    playerId,
    otherPlayerId,
    endWithDeal,
    endWithNoDeal,
    waitingOnOtherPlayer,
    hasNoDealPending,
    hasProposalPending,
  } = useGameMechanics();

  const { allowNoDeal, unilateralNoDeal } = getHumanNoDealBehavior(
    game,
    player,
    players
  );

  const onNewMessage = async (newMessage) => {
    setBusy(true);
    await onNewMessageImpl(newMessage);
    setBusy(false);
  };

  const onAccept = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "proposal") {
        lastMessage.proposalStatus = "accepted";
        setMessages([...messages]);
        endWithDeal(lastMessage.proposal);
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
        setMessages([...messages]);
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
        setMessages([...messages]);
        endWithNoDeal();
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
        setMessages([...messages]);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onNewNoDeal = async () => {
    setBusy(true);

    try {
      /** @type {import("./useGameMechanics").Message} */
      const newMessage = {
        type: "no-deal",
        noDealStatus: unilateralNoDeal ? "unilateral" : "pending",
        playerId,
        text: "",
        gamePhase: `Round ${round.index} - ${stage.name}`,
        id: randID(),
        timestamp: Date.now(),
        agentType: "user",
      };

      const messagesWithNoDeal = [...messages, newMessage];

      setMessages(messagesWithNoDeal);

      if (unilateralNoDeal) {
        endWithNoDeal();
      } else {
        switchTurns();
      }

      onNewNoDealImpl?.(messagesWithNoDeal);
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onNewProposal = async (proposal) => {
    setBusy(true);

    try {
      /** @type {import("./useGameMechanics").Message} */
      const newMessage = {
        type: "proposal",
        text: "",
        proposal,
        proposalStatus: "pending",
        playerId,
        gamePhase: `Round ${round.index} - ${stage.name}`,
        id: randID(),
        timestamp: Date.now(),
        agentType: "user",
      };

      const messagesWithProposal = [...messages, newMessage];

      setMessages(messagesWithProposal);
      switchTurns();

      onNewProposalImpl?.(messagesWithProposal);
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  return (
    <Chat
      busy={busy || waitingOnOtherPlayer}
      messages={messages}
      playerId={playerId}
      instructions={player.get("instructions")}
      points={JSON.parse(player.get("points"))}
      onNewMessage={onNewMessage}
      onNewNoDeal={allowNoDeal ? onNewNoDeal : undefined}
      onNewProposal={onNewProposal}
      onAccept={
        !waitingOnOtherPlayer && hasProposalPending ? onAccept : undefined
      }
      onReject={
        !waitingOnOtherPlayer && hasProposalPending ? onReject : undefined
      }
      onEnd={!waitingOnOtherPlayer && hasNoDealPending ? onEnd : undefined}
      onContinue={
        !waitingOnOtherPlayer && hasNoDealPending ? onContinue : undefined
      }
      waitingOnOtherPlayer={waitingOnOtherPlayer}
      otherPlayerId={otherPlayerId}
      otherPlayerTyping={otherPlayerTyping}
      unilateralNoDeal={unilateralNoDeal}
    />
  );
}
