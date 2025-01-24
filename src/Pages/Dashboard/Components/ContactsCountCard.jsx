import React from "react";

export default function ContactsCountCard({ icon, count, title }) {
  return (
    <div className="bg-blue-100 px-4 py-4 rounded-md shadow-md w-[250px] flex flex-col h-[300px]">
      <div
        className={
          " py-2 w-full flex flex-col bg-blue-100 h-full justify-between items-center"
        }
      >
        <p className="text-blue-800 font-bold text-xl">{title}</p>
        <div className="flex items-center w-20 h-20">
          <img alt="contacts icon" src={icon} className="object-cover" />
        </div>
        <p className="text-blue-800 font-bold text-4xl">{count}</p>
      </div>
    </div>
  );
}
