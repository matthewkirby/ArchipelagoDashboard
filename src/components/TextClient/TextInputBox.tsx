interface TextInputBoxProps {
  onMsgSubmit: React.KeyboardEventHandler<HTMLInputElement>;
}

const TextInputBox: React.FC<TextInputBoxProps> = ({onMsgSubmit}) => {
  return <input
    type="text"
    className="bg-blue-950 text-zinc-100 rounded leading-loose p-2 box-border select-none"
    onKeyDown={onMsgSubmit}
  />;
};

export default TextInputBox;