import React, { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

export function Chat({ messages, avatar, onNewMessage }) {
  // Auto-scroll for the chat
  const prevMessages = useRef(messages);
  const messagesRef = useRef();
  useEffect(() => {
    if (messagesRef.current) {
      // @ts-ignore
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    prevMessages.current = messages;
  }, []);

  return (
    <div className="w-full h-full px-2 py-2 pointer-events-auto flex flex-col justify-end ">
      <div className="rounded-2xl outline outline-2 outline-gray-300 pb-2 max-h-[75%] flex flex-col font-mono bg-white/95">
        <div className="overflow-auto px-2 pb-2" ref={messagesRef}>
          <Messages messages={messages} showNoMessages />
        </div>
        <div className="px-2">
          <Input autoFocus={true} avatar={avatar} onNewMessage={onNewMessage} />
        </div>
      </div>
    </div>
  );
}

function Messages({ messages, maxSize = 0, showNoMessages = false }) {
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

  return messages.map((message, i) => {
    let sliced = false;
    let text = message.text;
    if (maxSize > 0 && message.text.length > maxSize) {
      text = text.slice(0, maxSize);
      sliced = true;
    }

    return (
      <div className="p-2 flex items-start space-x-2" key={message.id}>
        <div className="w-6 h-6 flex-shrink-0">
          <Avatar src={message.avatar} />
        </div>
        <div>
          {text}
          {sliced ? <span className="text-gray-400 pl-2">[...]</span> : ""}
        </div>
      </div>
    );
  });
}

function Input({ avatar, onFocus, onBlur, autoFocus, onNewMessage }) {
  const textAreaRef = useRef();
  const formRef = useRef();

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
  };

  // Resize to text for the text input area
  const resize = () => {
    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${Math.min(
      textAreaRef.current.scrollHeight,
      200
    )}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full font-semibold flex flex-row items-center rounded-xl pl-2 pr-1 py-1 ring-2 bg-gray-50 ring-gray-200 focus-within:ring-gray-400 space-x-2"
      ref={formRef}
    >
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar src={avatar} />
      </div>

      <textarea
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
        className="peer resize-none w-full py-1 px-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
        rows={1}
        placeholder="Say something..."
        onChange={resize}
        onKeyDown={(e) => {
          if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            formRef.current.requestSubmit();
          }
        }}
        ref={textAreaRef}
        name="text"
      />

      <button
        type="submit"
        className="py-0.5 px-2 rounded-lg bg-transaprent text-gray-300 peer-focus:text-gray-500 mt-[1px]"
      >
        Send
      </button>
    </form>
  );
}
