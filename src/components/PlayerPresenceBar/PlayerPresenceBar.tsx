import { Client } from "archipelago.js";

interface PlayerPresenceBarProps {
  client: Client;
  activePlayers: number[];
  trackingSlots: number[];
}

const PlayerPresenceBar: React.FC<PlayerPresenceBarProps> = ({ client, activePlayers, trackingSlots }) => {
  // The set notify code allows any user to receieve a SetReply packet whenever a given user's hints are changed (new hint, or hint status change)
  // const testPacket1: GetPacket = {
  //   cmd: "Get",
  //   keys: ["_read_hints_0_10"]
  // }
  // const testPacket2: SetNotifyPacket = {
  //   cmd: "SetNotify",
  //   keys: ["_read_hints_0_10"]
  // }
  // client.send(testPacket1);
  // client.send(testPacket2);

  const playerlist = client.players.all;

  const findSlotStatus = (slotName: number) => {
    let statusLight = "led-grey";
    if (trackingSlots.includes(slotName)) {
      statusLight = "led-blue";
    } else if (activePlayers.includes(slotName)) {
      statusLight = "led-green";
    }

    return statusLight;
  };

  return (
    <div className="absolute w-full h-min px-3 py-2
                    flex flex-row flex-nowrap justify-start items-center gap-3
                    bg-surface text-on-bg
                    elevation-8dp">
      {playerlist.map((player, i) => {
        if (player.name === "Archipelago") {
          return null;
        }

        return (
          <span key={i} className={`led ${findSlotStatus(player.slot)}`}>{i}</span>
        );
      })}
    </div>
  );
};

export default PlayerPresenceBar;