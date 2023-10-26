'use client'
import { useState } from "react";
import MsgHistory from "./MsgHistory";
import TextInputBox from "./TextInputBox";

const testStrings: string[] = [
  "oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg oldest msg ",
  "2nd oldest msg 2nd oldest msg 2nd oldest msg 2nd oldest msg 2nd oldest msg 2nd oldest msg ",
  "newest msg"
];

const TextClient: React.FC<{}> = () => {
  const [history, setHistory] = useState<string[]>(testStrings)

  const onMsgSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      e.preventDefault();
      const newHistory = [...history, e.currentTarget.value];
      setHistory(newHistory);
      e.currentTarget.value = "";
    }
  }


  return (
    <div className="w-screen h-screen flex flex-col items-stretch justify-end p-4 gap-4">
      <MsgHistory hist={history} />
      <TextInputBox onMsgSubmit={onMsgSubmit} />
    </ div>
  );
};

export default TextClient;