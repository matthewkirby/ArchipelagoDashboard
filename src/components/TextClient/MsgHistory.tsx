import React from "react";

interface MsgHistoryProps {
  hist: string[];
}

interface MessageProps {
  line: string;
  className: string;
}

const MsgHistory: React.FC<MsgHistoryProps> = ({hist}) => {
  return (
    <div className="flex flex-col gap-y-2 divide-y divide-zinc-700 overflow-y-auto">
      {hist.map((line, i) => (
        // <div key={i} className="block leading-loose">{line}</div>
        <Message line={line} key={i} className="block leading-loose" />
      ))}
    </div>
  );
};

const Message: React.FC<MessageProps> = ({line, className}) => {
  console.log(line);
  return (
    <div className={className}>{line}</div>
  );
};

export default MsgHistory;