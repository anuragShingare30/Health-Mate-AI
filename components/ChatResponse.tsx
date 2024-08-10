'use client';

import { ChatHeading } from './ChatHeading';
import { getChatResponse } from '../utils/actions';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";


const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];


interface Message {
  role: 'user' | 'bot';
  content: string;
};

const ChatResponse: React.FC = () => {

  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState([]);


  const { mutate, isPending, data } = useMutation({
    mutationFn: async (userInput: string) => await getChatResponse(userInput),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong...");
        return;
      }
      toast.success("Success!!!");
      const result = data;
      setMessages((prevMessages) => [...prevMessages, { role: 'bot', content: result }]);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: userInput }]);
    mutate(userInput);
    setUserInput("");
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };


  return (
    <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
      <div>
        <ChatHeading />
        {
          messages.map((message, index) => {
            let avatar = message.role === 'user' ? '👨🏻‍⚕️' : '🤖';
            let bcg = message.role === 'user' ? "bg-base-200 shadow-lg" : "bg-base-100 shadow-lg";
            return (
              <div key={index} className={`flex flex-row gap-2 mt-12 leading-loose bg-base-300  border-b ${bcg}`}>
                <p className="m-3 p-2">{avatar}</p>
                <p className={`m-3 p-2`}>{message.content}</p>
              </div>
            );
          })
        }

        <div className="mt-10">
          {isPending ? <span className="loading"></span> : null}
        </div>

      </div>
      <div>
        <div className="h-[screen] flex flex-col justify-center  items-center px-4 mt-20">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInput}
            onSubmit={handleSubmit}
            
          />
        </div>
      </div>
    </div>
  );
}

export { ChatResponse };
