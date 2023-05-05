import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");

  const { humanSellerInstructions, humanBuyerInstructions, playerCount } =
    treatment;

  const multiplayer = playerCount === 2;

  const task = multiplayer ? "human-vs-human" : "llm-vs-human";

  const round = game.addRound({
    name: "Round 1",
    task,
  });
  round.addStage({ name: "Negotiation", duration: 3600 });
  round.addStage({ name: "Result", duration: 30 });

  const firstPlayerRole = treatment.firstPlayerRole || "buyer";
  game.players[0].set("role", firstPlayerRole);
  game.players[0].set(
    "instructions",
    firstPlayerRole === "buyer"
      ? humanBuyerInstructions
      : humanSellerInstructions
  );

  if (multiplayer) {
    const secondPlayerRole = firstPlayerRole === "buyer" ? "seller" : "buyer";
    game.players[1].set("role", secondPlayerRole);
    game.players[1].set(
      "instructions",
      secondPlayerRole === "buyer"
        ? humanBuyerInstructions
        : humanSellerInstructions
    );
  }

  game.set("currentTurnPlayerId", game.players[0].id);
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
