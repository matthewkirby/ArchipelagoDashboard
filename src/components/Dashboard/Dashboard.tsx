'use client'

import LoginMenu from "@components/LoginMenu";
import PlayerPresenceBar from "@components/PlayerPresenceBar";
import TextClient from "@components/TextClient";
import { Client, ITEM_FLAGS, PRINT_JSON_TYPE, PrintJSONPacket } from "archipelago.js";
import { useMemo, useRef, useState } from "react";

const Dashboard: React.FC<{}> = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [activePlayers, setActivePlayers] = useState([]);
  const [myConnectedSlot, setMyConnectedSlot] = useState(null);
  const [trackSlots, setTrackSlots] = useState([]);
  let msgHistoryRef = useRef<HTMLDivElement | null>(null);

  // Set up the AP client connection
  const client = useMemo(() => {
    const apClient = new Client();

    apClient.addListener("PrintJSON", (packet) => {
      console.log(packet);

      if (packet.type === "CommandResult") {
        // This is super jank and sketch but there is no good way to get the connected playerlist sooooo...
        const nPlayers = apClient.players.all.length - 1;
        if (packet.data[0].text.includes(` players of ${nPlayers} connected `)) {
          const updatingActivePlayers = [];
          for (let i = 0; i < nPlayers; i++) {
            const onePlayer = apClient.players.name(i+1);
            if (!packet.data[0].text.includes(`(${onePlayer})`)) {
              updatingActivePlayers.push(i+1)
            }
          }
          setActivePlayers(updatingActivePlayers);
        }
      }

      const msgDOMElement = formatMessage(packet, apClient);
      msgHistoryRef.current?.appendChild(msgDOMElement);
    });

    apClient.addListener("Connected", (packet) => {
      console.log(packet)
      if (!isConnected) {
        setTrackSlots([packet.slot]);
        setMyConnectedSlot(packet.slot);
        setIsConnected(true);
        apClient.say("!players")
      }
    });

    apClient.addListener("PacketReceived", (packet) => {
      if (packet.cmd === "Connected") {}
      else if (packet.cmd === "PrintJSON") {}
      else {
        console.log(packet)
      }
    });

    return apClient;
  }, [])

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

  return (
    <>
      { isConnected ? "" : <LoginMenu client={client} /> }
      { isConnected ? <PlayerPresenceBar client={client} activePlayers={activePlayers} trackingSlots={trackSlots} /> : "" }
      <TextClient client={client} ref={msgHistoryRef} />
    </>
  );
};

export default Dashboard;