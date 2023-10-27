import React, { Ref, forwardRef, useState } from "react";
import MsgHistory from "./MsgHistory";
import TextInputBox from "./TextInputBox";
import { Client } from "archipelago.js";

interface TextClientProps {
  client: Client;
}

const TextClient = React.forwardRef<HTMLDivElement | null, TextClientProps>(({ client }, ref) => {

  return (
    <div className="w-screen h-screen flex flex-col items-stretch justify-end p-4 gap-4">
      <div ref={ref} className="flex flex-col gap-y-2 divide-y divide-zinc-700 overflow-y-auto"></div>
      <TextInputBox client={client} />
    </ div>
  );
});

TextClient.displayName = "TextClient";
export default TextClient;