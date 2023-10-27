import { Client } from "archipelago.js";

interface TextInputBoxProps {
  client: Client;
}

const TextInputBox: React.FC<TextInputBoxProps> = ({ client }) => {

  const onMsgSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      e.preventDefault();
      client.say(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  return <input
    type="text"
    className="bg-blue-950 text-zinc-100 rounded leading-loose p-2 box-border select-none"
    onKeyDown={onMsgSubmit}
  />;
};

export default TextInputBox;