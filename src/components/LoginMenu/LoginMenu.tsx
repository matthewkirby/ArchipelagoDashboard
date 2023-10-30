import { CLIENT_STATUS, Client, ITEMS_HANDLING_FLAGS } from "archipelago.js";
import React, { useState } from "react";

interface LoginMenuProps {
  client: Client;
};

type StringSetter = React.Dispatch<React.SetStateAction<string>>;

interface LoginTextFieldProps {
  label: string;
  key: string;
  placeholder: string;
  setter: StringSetter;
  setterDefault: string;
};


const LoginMenu: React.FC<LoginMenuProps> = ({client}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [lockMenu, setLockMenu] = useState(false);
  const [serverAddress, setServerAddress] = useState(localStorage.getItem("serverAddress") ?? "");
  const [slotName, setSlotName] = useState(localStorage.getItem("slotName") ?? "");
  const [password, setPassword] = useState("");

  const setTextFieldValue = (event: React.FormEvent<HTMLInputElement>, setter: StringSetter, key: string, defaultValue: string) => {
    event.preventDefault();
    let value = event.currentTarget.value;
    if (value === "") {
      value = defaultValue;
    }

    setter(value);
    localStorage.setItem(key, value);
  }

  const connectToServer = () => {
    setLockMenu(true);

    const [hostname, portString] = serverAddress.split(":");
    const port = parseInt(portString);

    if (isNaN(port)) {
      setLockMenu(false);
      return;
    }

    const connectionInfo = {
      hostname: hostname,
      port: port,
      game: "",
      name: slotName,
      password: password,
      items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
      tags: ["TextOnly"]
    };

    client.connect(connectionInfo)
      .then(() => {
        console.log("Connected to the server");
        setLoggedIn(true);
        client.updateStatus(CLIENT_STATUS.CONNECTED);
      })
      .catch((error) => {
        console.error("Failed to connect:", error);
        setLockMenu(false);
      });
  }

  const LoginTextFields: LoginTextFieldProps[] = [
    { label: "Server", key: "serverAddress", placeholder: "Ex: archipelago.gg:42069", setter: setServerAddress, setterDefault: "" },
    { label: "Player Name", key: "slotName", placeholder: "Ex: BBallMikey", setter: setSlotName, setterDefault: "" },
    { label: "Password", key: "password", placeholder: "If none, leave blank", setter: setPassword, setterDefault: "" }
  ];

  return (
    <div className={`backdrop-blur absolute w-full h-full z-69 flex justify-center items-center ${loggedIn ? "hidden" : ""}`}>
      <div className="filter-none flex flex-col items-center gap-4 leading-loose w-[35rem] shrink-0 rounded-3xl p-8 box-content bg-surface elevation-8dp">

        {LoginTextFields.map((line, i) => {
          return (
            <div key={i} className="flex flex-row w-full h-12 gap-4">
              <label className="flex-auto w-1/3 flex justify-center items-center font-bold bg-primary  border-primary-variant select-none text-on-primary text-lg elevation-4dp">
                {line.label}
              </label>
              <input
                type="text"
                placeholder={line.placeholder}
                className="flex-auto w-2/3 p-2.5 elevation-8dp bg-surfaceL2
                           text-md text-on-surface
                           outline-none border-primary
                           focus:border-b-4 focus:overlay-i3 focus:mb-[-4px]
                           disabled:cursor-progress disabled:opacity-40"
                disabled={lockMenu}
                onInput={(e) => setTextFieldValue(e, line.setter, line.key, line.setterDefault)}
                value={localStorage.getItem(line.key) ?? ""}
              />
            </div>
          );
        })}

        <input
          type="button"
          value="Connect"
          className="h-12 w-full bg-secondary
                     text-on-secondary font-bold text-2xl
                     hover:overlay-i3"
          onClick={connectToServer}
          disabled={lockMenu}
        />
      </div>
    </div>
  );
};

export default LoginMenu;