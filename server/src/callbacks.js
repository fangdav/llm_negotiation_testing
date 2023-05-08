import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");

  const {
    firstPlayerInstructions,
    secondPlayerInstructions,
    llmStartsFirst,
    playerCount,
  } = treatment;

  const multiplayer = playerCount === 2;

  const task = multiplayer ? "human-vs-human" : "llm-vs-human";

  const round = game.addRound({
    name: "Round 1",
    task,
  });
  round.addStage({ name: "Negotiation", duration: 3600 });
  round.addStage({ name: "Result", duration: 30 });

  if (multiplayer) {
    game.players[0].set("instructions", firstPlayerInstructions);
    game.players[1].set("instructions", secondPlayerInstructions);
    game.set("currentTurnPlayerId", game.players[0].id);
  } else {
    if (llmStartsFirst) {
      game.players[0].set("llmInstructions", firstPlayerInstructions);
      game.players[0].set("instructions", secondPlayerInstructions);
      game.set("currentTurnPlayerId", `${game.players[0].id}-assistant`);
    } else {
      game.players[0].set("instructions", firstPlayerInstructions);
      game.players[0].set("llmInstructions", secondPlayerInstructions);
      game.set("currentTurnPlayerId", game.players[0].id);
    }
  }
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
