'use client'

import LoginMenu from "@components/LoginMenu";
import TextClient from "@components/TextClient";
import { Client } from "archipelago.js";


const Dashboard: React.FC<{}> = () => {

  const client = new Client();

  client.addListener("PrintJSON", (packet) => {
    console.log(packet);
  });


  return (
    <>
      <LoginMenu client={client} />
      <TextClient />
    </>
  );
};

export default Dashboard;