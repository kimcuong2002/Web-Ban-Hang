import { NavLink } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineShoppingCart, AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authReducer";

const AccountList = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5 text-lg lg:w-[20%] md:w-[30%] sm:w-[40%] pl-5 border-gray-500 border-r-2">
      <NavLink to="/profile" className="flex gap-3 items-center">
        <BsPersonCircle size={22} />
        <span className="account-list-title">My account</span>
      </NavLink>
      <NavLink to="/orders" className="flex gap-3 items-center">
        <AiOutlineShoppingCart size={22} />
        <span className="account-list-title">Orders</span>
      </NavLink>
      <span
        className="flex gap-3 items-center cursor-pointer"
        onClick={() => dispatch(logout("userToken"))}
      >
        <AiOutlineLogout size={22} />
        <span className="account-list-title">Logout</span>
      </span>
    </div>
  );
};

export default AccountList;
