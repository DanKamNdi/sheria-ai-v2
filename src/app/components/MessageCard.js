import React from 'react';

const MessageCard = ({message, sender}) => {
  const cardClass = sender === "sheria" ? "self-start ml-2" : "self-end mr-2";
  const alignmentClass = sender === "sheria" ? "bg-blue-100" : "bg-green-100";

  return (
    <div className={`w-3/4 ${cardClass} ${alignmentClass} p-2 rounded-lg`}>
      <p>{message}</p>
    </div>
  );
};

export default MessageCard;