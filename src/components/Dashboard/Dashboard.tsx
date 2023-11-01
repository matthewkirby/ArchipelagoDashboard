'use client'

import LoginMenu from "@components/LoginMenu";
import PlayerPresenceBar from "@components/PlayerPresenceBar";
import TextClient from "@components/TextClient";
import { Client, ConnectedPacket, ITEM_FLAGS, PRINT_JSON_TYPE, PrintJSONPacket, ServerPacket } from "archipelago.js";
import { useEffect, useMemo, useRef, useState } from "react";

const Dashboard: React.FC<{}> = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [activePlayers, setActivePlayers] = useState([]);
  const [myConnectedSlot, setMyConnectedSlot] = useState(null);
  const [trackSlots, setTrackSlots] = useState([]);
  let msgHistoryRef = useRef<HTMLDivElement | null>(null);

  // Set up the AP client connection
  const client = useMemo(() => {
    const apClient = new Client();
    return apClient;
  }, [])


  // Handle Lisener: Connected
  useEffect(() => {
    const parseConnected = (packet: ConnectedPacket) => {
      console.log(packet)
      if (!isConnected) {
        setTrackSlots([packet.slot]);
        setMyConnectedSlot(packet.slot);
        setIsConnected(true);
        client.say("!players")
      }
    };
    client.addListener("Connected", parseConnected);
    return () => client.removeListener("Connected", parseConnected);
  }, [client, isConnected]);


  // Handle Listener: PrintJSON
  useEffect(() => {
    const parsePrintJSON = (packet: PrintJSONPacket) => {
      console.log(packet);

      if (packet.type === "CommandResult") {
        // This is super jank and sketch but there is no good way to get the connected playerlist sooooo...
        const nPlayers = client.players.all.length - 1;
        if (packet.data[0].text.includes(` players of ${nPlayers} connected `)) {
          const updatingActivePlayers = [];
          for (let i = 0; i < nPlayers; i++) {
            const onePlayer = client.players.name(i+1);
            if (!packet.data[0].text.includes(`(${onePlayer})`)) {
              updatingActivePlayers.push(i+1)
            }
          }
          setActivePlayers(updatingActivePlayers);
        }
      }

      // Handle Join/Part for prescense bar
      if (packet.type === "Join" || packet.type === "Part") {
          const changingSlot = packet.slot;
          const newActivePlayers = [ ...activePlayers ];
          if (packet.type === "Join") {
            if (!newActivePlayers.includes(changingSlot)) {
              newActivePlayers.push(changingSlot);
              setActivePlayers(newActivePlayers);
            }
          } else {
            if (newActivePlayers.includes(changingSlot)) {
              const i = newActivePlayers.indexOf(changingSlot)
              newActivePlayers.splice(i, 1);
              setActivePlayers(newActivePlayers);
            }
          }
      }

      const msgDOMElement = formatMessage(packet, client);
      msgHistoryRef.current?.appendChild(msgDOMElement);
    }
    client.addListener("PrintJSON", parsePrintJSON);

    return () => client.removeListener("PrintJSON", parsePrintJSON);
  }, [client, activePlayers]);


  // Handle Listener: PacketReceived
  useEffect(() => {
    const parsePacketReceived = (packet: ServerPacket) => {
      if (packet.cmd === "Connected") {}
      else if (packet.cmd === "PrintJSON") {}
      else { console.log(packet) }
    }
    client.addListener("PacketReceived", parsePacketReceived);
    return () => client.removeListener("PacketReceived", parsePacketReceived);
  }, [client]);


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