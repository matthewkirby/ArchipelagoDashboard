'use client'

import LoginMenu from "@components/LoginMenu";
import TextClient from "@components/TextClient";
import { Client } from "archipelago.js";
import { useRef } from "react";


const Dashboard: React.FC<{}> = () => {

  let msgHistoryRef = useRef<HTMLDivElement | null>(null);

  const client = new Client();

  client.addListener("PrintJSON", (packet) => {
    console.log(packet);
    const msgDOMElement = document.createElement("div");
    msgDOMElement.innerText = packet.data[0].text;
    msgHistoryRef.current?.appendChild(msgDOMElement);
  });


  return (
    <>
      <LoginMenu client={client} />
      <TextClient client={client} ref={msgHistoryRef} />
    </>
  );
};

export default Dashboard;