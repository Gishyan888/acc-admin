import React from "react";

export default function StatusCard({
  title,
  count,
  icon,
  containerClassName,
  color,
}) {
  return (
    <div
      className={`p-2 w-[250px] flex justify-between rounded-sm ${containerClassName}`}
    >
      <div className="w-20 h-20 flex items-center justify-center">
        <img src={icon} alt="title" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center text-end pr-4 text-white">
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
        <p className={`text-md font-bold ${color}`}>{title}</p>
      </div>
    </div>
  );
}
