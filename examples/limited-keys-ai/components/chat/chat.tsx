"use client";

import { useChat } from "ai/react";

import MessageContainer from "../Messages/container";
import Message from "../Messages/message";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: "/api/completions",
  });

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isValid = searchParams.get("valid") as "false" | null;

  useEffect(() => {
    if (isValid && isValid === "false") {
      toast({
        title: "Uh Oh! Limit exceeded",
        description: `You've used up all your available tokens, Please consider buying some more.`,
      });

      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    }
  }, []);
  console.log(error);
  console.log(messages);
  return (
    <MessageContainer>
      {messages && messages.length > 0 ? (
        messages
          .filter((message) => message.content.includes("DOCTYPE") === false)
          .map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))
      ) : (
        <p>No messages yet...</p>
      )}

      <form
        className=" w-full flex gap-3 justify-center items-center md:left-[1%]"
        onSubmit={handleSubmit}
      >
        {
          <>
            <textarea
              className="w-5/6 p-3 border-2 border-black break-words whitespace-pre-line border-solid text-base"
              placeholder="Message"
              name="message"
              value={input}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-green-200 text-black/60 justify-center items-center flex gap-2 mt-2  rounded-md py-2 px-3 mb-2 text-base  md:text-2xl"
            >
              <span> Send</span> <span className="">🚁</span>
            </button>
          </>
        }
      </form>
      <Toaster />
    </MessageContainer>
  );
};

export default Chat;
