// @ts-check
import React, { useState } from "react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { NoDealMessage, ProposalMessage } from "./Messages";
import { Divider } from "../Divider";
import QuestionRadioGroup from "../QuestionRadioGroup";

/**
 * @param {{
 *   proposal: string;
 *   points: {
 *     name: string;
 *     options: { name: string; agreement: string; points: number }[];
 *   }[];
 * }} param0
 */
export const DealVisualizer = ({ proposal, points }) => {
  // convert proposal from an array of A,B,C to an array of 0,1,2
  const choicesIdxs = proposal.split(",").map((c) => c.charCodeAt(0) - 65);
  const choices = points.map((p, idx) => p.options[choicesIdxs[idx]]);
  const totalPoints = choices.reduce((acc, choice) => acc + choice.points, 0);
  return (
    <div>
      <ol>
        {choices.map((choice, idx) => (
          <li key={idx}>
            <span className="font-bold">{points[idx].name}</span>:{" "}
            {choice.agreement} ({choice.points} points)
          </li>
        ))}
      </ol>
      <span>
        <span className="font-bold">Total</span>: {totalPoints} points
      </span>
    </div>
  );
};

export function DealArea({
  waitingOnOtherPlayer,
  waitingOnNoDeal,
  waitingOnProposal,
  inputMode,
  setInputMode,
  messages,
  points,
  unilateralNoDeal,
  onNewNoDeal,
  onNewProposal,
  onAccept,
  onReject,
  onContinue,
  onEnd,
}) {
  const canTakeAction =
    !waitingOnOtherPlayer &&
    !waitingOnNoDeal &&
    !waitingOnProposal &&
    inputMode === "message";
  const canEndNoDeal = messages.length > 0 && Boolean(onNewNoDeal);

  return (
    <div>
      {inputMode === "proposal" && (
        <Modal onClickOut={() => setInputMode("message")} showCloseButton>
          <ProposalInput
            busy={waitingOnProposal}
            onNewProposal={onNewProposal}
            onCancel={() => setInputMode("message")}
            points={points}
          />
        </Modal>
      )}

      {inputMode === "no-deal-confirm" && (
        <Modal onClickOut={() => setInputMode("message")} showCloseButton>
          <NoDealConfirmation
            onContinue={() => setInputMode("message")}
            onEnd={onNewNoDeal}
          />
        </Modal>
      )}

      {!waitingOnOtherPlayer && waitingOnProposal && (
        <Modal onClickOut={() => setInputMode("message")}>
          <AcceptReject
            onAccept={onAccept}
            onReject={onReject}
            proposalMessage={messages[messages.length - 1]}
            points={points}
          />
        </Modal>
      )}

      {waitingOnNoDeal && (
        <Modal onClickOut={() => setInputMode("message")}>
          <ContinueEnd
            onContinue={onContinue}
            onEnd={onEnd}
            noDealMessage={messages[messages.length - 1]}
          />
        </Modal>
      )}

      <Divider text="or" />

      <PositiveNegativeButtons
        positiveText="Propose a deal"
        positiveAction={() => setInputMode("proposal")}
        positiveDisabled={!canTakeAction}
        negativeText="End with no deal"
        negativeAction={
          unilateralNoDeal ? () => setInputMode("no-deal-confirm") : onNewNoDeal
        }
        negativeDisabled={!canTakeAction || !canEndNoDeal}
      />
    </div>
  );
}

function NoDealConfirmation({ onContinue, onEnd }) {
  return (
    <div className="lg:min-w-96 max-w-prose">
      <div className="rounded bg-gray-100 p-2">
        Are you sure you want to walk away without a deal? This will immediately
        end the game and you will not be able to continue negotiating.
      </div>

      <div className="mt-4">
        <PositiveNegativeButtons
          positiveText="No, keep negotiating"
          positiveAction={onContinue}
          positiveDisabled={!onContinue}
          negativeText="Yes, end with no deal"
          negativeAction={onEnd}
          negativeDisabled={!onEnd}
        />
      </div>
    </div>
  );
}

function AcceptReject({ onAccept, onReject, proposalMessage, points }) {
  return (
    <div className="lg:min-w-96 max-w-prose">
      <div className="rounded bg-gray-100 p-2">
        <ProposalMessage
          message={proposalMessage}
          points={points}
          // We can just put anything in here, since it's just checking the
          // message is from self, and in this case, it is not.
          currentPlayerId={"not self"}
          hidePending
        />
      </div>

      <div className="mt-4">
        <PositiveNegativeButtons
          positiveText="Accept"
          positiveAction={onAccept}
          positiveDisabled={!onAccept}
          negativeText="Reject"
          negativeAction={onReject}
          negativeDisabled={!onReject}
        />
      </div>
    </div>
  );
}

function ContinueEnd({ noDealMessage, onContinue, onEnd }) {
  return (
    <div className="lg:min-w-96 max-w-prose">
      <div className="rounded bg-gray-100 p-2">
        <NoDealMessage
          message={noDealMessage}
          // We can just put anything in here, since it's just checking the
          // message is from self, and in this case, it is not.
          currentPlayerId={"not self"}
          hidePending
        />
      </div>
      <div className="mt-4">
        <PositiveNegativeButtons
          positiveText="Keep negotiating"
          positiveAction={onContinue}
          positiveDisabled={!onContinue}
          negativeText="End with no deal"
          negativeAction={onEnd}
          negativeDisabled={!onEnd}
        />
      </div>
    </div>
  );
}

function PositiveNegativeButtons({
  positiveAction,
  positiveText,
  positiveDisabled = false,
  negativeAction,
  negativeText,
  negativeDisabled = false,
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-x-4">
      <Button
        variant="positive"
        full
        onClick={positiveAction}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-full w-full fill-current"
          >
            <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
          </svg>
        }
        disabled={positiveDisabled}
      >
        {positiveText}
      </Button>
      <Button
        variant="negative"
        full
        onClick={negativeAction}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-full w-full fill-current"
          >
            <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
          </svg>
        }
        disabled={negativeDisabled}
      >
        {negativeText}
      </Button>
    </div>
  );
}

function ProposalInput({ onNewProposal, onCancel, busy, points }) {
  const [value, setValue] = useState(points.map(() => undefined));

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewProposal(value.join(","));
    setValue(points.map(() => undefined));
  };

  const incomplete = value.some((v) => v === undefined);

  const choicesIdxs = value.map((c) => (c ? c.charCodeAt(0) - 65 : undefined));
  const choices = points.map((p, idx) =>
    choicesIdxs[idx] != null ? p.options[choicesIdxs[idx]] : undefined
  );
  const totalPoints = choices.reduce(
    (acc, choice) => acc + (choice ? choice.points : 0),
    0
  );

  return (
    <form className="lg:min-w-96 max-w-prose" onSubmit={handleSubmit}>
      <fieldset disabled={busy}>
        <div>
          {points.map((p, idx) => (
            <QuestionRadioGroup
              key={idx}
              value={value[idx]}
              withLabelKey
              onChange={(e) => {
                const newProposal = [...value];
                newProposal[idx] = e.target.value;
                setValue(newProposal);
              }}
              question={p.name}
              options={p.options.reduce(
                (acc, option, idx) => ({
                  ...acc,
                  [option.name]: option.agreement,
                }),
                {}
              )}
            />
          ))}
        </div>

        <div>
          <span className="font-bold">Total</span>: {totalPoints} points
        </div>

        <div className="mt-4 flex justify-between">
          <Button type="submit" disabled={busy || incomplete}>
            Submit
          </Button>
          <Button onClick={onCancel} variant="secondary" disabled={busy}>
            Cancel
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
