import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
const Quantity = ({ quantity, inc, dec, theme }) => {
  return (
    <div className="flex last:border-r last:rounded-tr-lg last:rounded-br-lg first:rounded-tl-lg first:rounded-bl-lg overflow-hidden">
      <span
        className={`flex border p-4 border-r-0 cursor-pointer hover:bg-red-500 hover:text-white transition-all ${
          theme === "indigo" && "bg-red-600 text-white"
        }`}
        onClick={dec}
      >
        <AiOutlineMinus />
      </span>
      <span className="flex-1 border flex items-center justify-center font-medium border-r-0">
        {quantity}
      </span>
      <span
        className={`flex border p-4 border-r-0 cursor-pointer hover:bg-green-500 hover:text-white transition-all ${
          theme === "indigo" && "bg-green-600 text-white"
        }`}
        onClick={inc}
      >
        <AiOutlinePlus />
      </span>
    </div>
  );
};

export default Quantity;
