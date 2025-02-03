const Switch = ({ enabled, onToggle }) => {
  return (
    <div
      className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer ${
        enabled ? "bg-blue-500" : "bg-gray-300"
      }  transition-colors duration-300 ease-in-out`}
      onClick={onToggle}
    >
      <span
        className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        } transition-transform duration-300`}
      ></span>
    </div>
  );
};

export default Switch;
