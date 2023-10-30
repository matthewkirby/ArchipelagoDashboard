'use client'

import LoginMenu from "@components/LoginMenu";
import TextClient from "@components/TextClient";
import { Client, ITEM_FLAGS, PRINT_JSON_TYPE, PrintJSONPacket } from "archipelago.js";
import { useEffect, useRef } from "react";

const Dashboard: React.FC<{}> = () => {

  let msgHistoryRef = useRef<HTMLDivElement | null>(null);
  const client = new Client();
  const mySlots = [12];

  const formatMessage = (packet: PrintJSONPacket, client: Client): HTMLDivElement => {
    const msgDOMElement = document.createElement("div");
    msgDOMElement.classList.add("block");
    for (const part of packet.data) {
      const subElement = document.createElement("span");

      // Parse multipart text
      switch (part.type) {
        case "player_id":
          const player = client.players.get(parseInt(part.text));
          subElement.innerText = player?.name ?? "Player Unknown";
          break;
        case "item_id":
          if (part.flags & ITEM_FLAGS.PROGRESSION) {
            subElement.classList.add("text-item-progression");
          } else if (part.flags & ITEM_FLAGS.NEVER_EXCLUDE) {
            subElement.classList.add("text-item-important");
          } else if (part.flags & ITEM_FLAGS.TRAP) {
            subElement.classList.add("text-item-trap");
          } else {
            subElement.classList.add("text-item-default");
          }
          const gameNameI = client.players.game(part.player);
          const itemName = client.items.name(gameNameI, parseInt(part.text));
          subElement.innerText = itemName;
          break;
        case "location_id":
          subElement.classList.add("text-location-name");
          const gameNameL = client.players.game(part.player);
          const locationName = client.locations.name(gameNameL, parseInt(part.text));
          subElement.innerText = locationName;
          break;
        default:
          subElement.innerText = part.text;
      }

      // Add any extra formatting
      if (packet.type === PRINT_JSON_TYPE.HINT) {
        if (part.text === "(found)") {
          subElement.classList.add("text-location-found");
        } else if (part.text === "(not found)") {
          subElement.classList.add("text-location-pending");
        }
      }

      msgDOMElement.appendChild(subElement);
    }

    // Add any extra formatting to the entire message element
    if (packet.type === PRINT_JSON_TYPE.TUTORIAL) {
      msgDOMElement.classList.add("text-on-surfaceSubtle", "hover:text-on-surface");
    }

    return msgDOMElement;
  };

  client.addListener("PrintJSON", (packet) => {
    console.log(packet);
    const msgDOMElement = formatMessage(packet, client);
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