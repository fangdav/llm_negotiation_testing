// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export function Chat({
  messages,
  avatar,
  onNewMessage,
  busy,
  onAccept,
  onReject,
  onEnd,
  onContinue,
}) {
  // Auto-scroll for the chat
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const prevMessages = useRef(messages);
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const messagesContainerRef = useRef();
  useEffect(() => {
    if (prevMessages.current !== messages) {
      // @ts-ignore
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    prevMessages.current = messages;
  }, [messages]);

  const waitingOnProposal = !!onAccept || !!onReject;
  const waitingOnNoDeal = !!onEnd || !!onContinue;

  return (
    <div className="w-full h-full px-2 py-2 pointer-events-auto flex flex-col justify-end ">
      <div className="rounded-2xl outline outline-2 outline-gray-300 pb-2 flex flex-col font-mono bg-white/95 max-h-full">
        <div className="overflow-auto px-2 pb-2" ref={messagesContainerRef}>
          <Messages
            messages={messages}
            showNoMessages
            onAccept={onAccept}
            onReject={onReject}
            onEnd={onEnd}
            onContinue={onContinue}
          />
          {busy && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
        <div className="px-2">
          <Input
            avatar={avatar}
            onNewMessage={onNewMessage}
            waitingOnProposal={waitingOnProposal}
            waitingOnNoDeal={waitingOnNoDeal}
            busy={busy}
          />
        </div>
      </div>
    </div>
  );
}

function TextMessage({ message, maxSize }) {
  let sliced = false;
  let text = message.text;
  if (maxSize > 0 && message.text.length > maxSize) {
    text = text.slice(0, maxSize);
    sliced = true;
  }

  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar src={message.avatar} />
      </div>
      <div>
        {text}
        {sliced ? <span className="text-gray-400 pl-2">[...]</span> : ""}
      </div>
    </div>
  );
}

function ButtonsContainer({ children }) {
  return <div className="flex space-x-2">{children}</div>;
}

function ProposalMessage({ message, onAccept, onReject }) {
  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar src={message.avatar} />
      </div>
      <div>
        <div>
          Proposed a deal:{" "}
          <b>
            {Intl.NumberFormat([], {
              style: "currency",
              currency: "USD",
            }).format(message.proposal)}
          </b>
        </div>
        <div>
          {message.proposalStatus === "pending" && (
            <ButtonsContainer>
              {onAccept && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded-md"
                  onClick={onAccept}
                >
                  Accept
                </button>
              )}
              {onReject && (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={onReject}
                >
                  Reject
                </button>
              )}
            </ButtonsContainer>
          )}
          {message.proposalStatus === "accepted" && (
            <span className="text-green-500">Accepted</span>
          )}
          {message.proposalStatus === "rejected" && (
            <span className="text-red-500">Rejected</span>
          )}
        </div>
      </div>
    </div>
  );
}

function NoDealMessage({ message, onEnd, onContinue }) {
  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar src={message.avatar} />
      </div>
      <div>
        <div>Rejected the deal</div>
        <div>
          {message.noDealStatus === "pending" && (
            <ButtonsContainer>
              {onContinue && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded-md"
                  onClick={onContinue}
                >
                  Keep negotiating
                </button>
              )}
              {onEnd && (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={onEnd}
                >
                  End with no deal
                </button>
              )}
            </ButtonsContainer>
          )}
          {message.noDealStatus === "ended" && (
            <span className="text-red-500">Ended with no deal</span>
          )}
          {message.noDealStatus === "continued" && (
            <span className="text-green-500">Continued negotiations</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Messages({
  messages,
  maxSize = 0,
  showNoMessages = false,
  onAccept,
  onReject,
  onEnd,
  onContinue,
}) {
  if (messages.length === 0) {
    if (showNoMessages) {
      return (
        <div className="h-full min-h-[4rem] w-full flex justify-center items-center">
          No messages yet
        </div>
      );
    } else {
      return null;
    }
  }

  return messages.map((message, i) => (
    <React.Fragment key={i}>
      {!!message.text && (
        <TextMessage message={message} maxSize={maxSize} key={message.id} />
      )}
      {message.type === "proposal" && (
        <ProposalMessage
          message={message}
          key={message.id}
          onAccept={onAccept}
          onReject={onReject}
        />
      )}
      {message.type === "no-deal" && (
        <NoDealMessage
          message={message}
          key={message.id}
          onContinue={onContinue}
          onEnd={onEnd}
        />
      )}
    </React.Fragment>
  ));
}

function Input({
  avatar,
  onNewMessage,
  busy,
  waitingOnProposal,
  waitingOnNoDeal,
}) {
  /**
   * @type {React.MutableRefObject<HTMLTextAreaElement>}
   */
  const textAreaRef = useRef();
  /**
   * @type {React.MutableRefObject<HTMLFormElement>}
   */
  const formRef = useRef();

  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Resize to text for the text input area
  const resize = () => {
    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${Math.min(
      textAreaRef.current.scrollHeight,
      200
    )}px`;
  };

  // Enable the button if there is text in the input area
  const changeButtonStatus = () => {
    setButtonEnabled(textAreaRef.current.value.length > 0);
  };

  const handleOnChange = (e) => {
    resize();
    changeButtonStatus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = textAreaRef.current.value;

    if (text.length > 1024) {
      e.preventDefault();

      alert("Max message length is 1024");

      return;
    }

    onNewMessage(text);

    textAreaRef.current.value = "";
    handleOnChange();
  };

  const placeholder = busy
    ? "Waiting for other party..."
    : waitingOnProposal
    ? "Please accept or reject the proposal"
    : waitingOnNoDeal
    ? "Please continue or end with no deal"
    : "Say something...";

  const disabled = busy || waitingOnProposal || waitingOnNoDeal;

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <fieldset
        disabled={disabled}
        className="w-full font-semibold flex flex-row items-center rounded-xl pl-2 pr-1 py-1 ring-2 bg-gray-50 ring-gray-200 focus-within:ring-gray-400 space-x-2"
      >
        <div className="w-6 h-6 flex-shrink-0">
          <Avatar src={avatar} />
        </div>

        <textarea
          autoFocus={true}
          className="peer resize-none w-full py-1 px-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
          rows={1}
          placeholder={placeholder}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (e.keyCode == 13 && e.shiftKey == false) {
              e.preventDefault();
              formRef.current.requestSubmit();
            }
          }}
          ref={textAreaRef}
          name="text"
        />

        <Button type="submit" className="mt-[1px]" primary={!buttonEnabled}>
          Send
        </Button>
      </fieldset>
    </form>
  );
}
