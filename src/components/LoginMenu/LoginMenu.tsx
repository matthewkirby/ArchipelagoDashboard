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
    { label: "Player Name", key: "slotName", placeholder: "Ex: BBall Mikey", setter: setSlotName, setterDefault: "" },
    { label: "Password", key: "password", placeholder: "If none, leave blank", setter: setPassword, setterDefault: "" }
  ];

  return (
    <div className={`backdrop-blur absolute w-full h-full z-69 flex justify-center items-center ${loggedIn ? "hidden" : ""}`}>
      <div className="filter-none flex flex-col items-center gap-4 leading-loose w-1/2 min-w-[25rem] rounded-3xl bg-slate-900 p-8 box-content">

        {LoginTextFields.map((line, i) => {
          return (
            <div key={i} className="flex flex-row w-full h-12 gap-4">
              <label className="flex-auto w-1/3 flex justify-center items-center font-bold bg-blue-500 border-b-4 border-l-4 border-blue-700 select-none text-white text-lg">
                {line.label}
              </label>
              <input
                type="text"
                placeholder={line.placeholder}
                className="flex-auto w-2/3 bg-slate-400 border text-slate-950 text-md rounded-lg focus:border-blue-700 p-2.5 border-gray-slate-200 outline-none placeholder:text-slate-600 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-progress"
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
          className="h-12 w-full rounded-lg bg-yellow-500 text-slate-950 font-bold text-2xl hover:bg-yellow-300"
          onClick={connectToServer}
          disabled={lockMenu}
        />
      </div>
    </div>
  );
};

export default LoginMenu;