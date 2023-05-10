import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authReducer";

const Sidebar = ({ side, closeSidebar }) => {
  const dispatch = useDispatch();
  const adminLogout = () => {
    dispatch(logout("admin-token"));
  };

  return (
    <div
      className={`fixed top-0 ${side} sm:left-0 w-64 h-screen bg-gray-800 z-10 transition-all`}
    >
      <i
        className="bi bi-x-lg absolute top-4 right-4 sm:hidden block cursor-pointer text-lg"
        onClick={closeSidebar}
      ></i>
      <div className="w-full flex justify-center items-center p-4">
        <img className="w-28" src={logo} alt="logo" />
      </div>
      <ul className="mt-4">
        <Link to="/admin/products" className="text-base capitalize">
          <li className="px-7 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-card-list mr-2 inline-block text-lg"></i>{" "}
            products
          </li>
        </Link>
        <Link to="/admin/orders" className="text-base capitalize">
          <li className="px-7 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-bag-check mr-2 inline-block text-lg"></i> orders
          </li>
        </Link>
        <Link to="/admin/customers" className="text-base capitalize">
          <li className="px-7 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-people-fill mr-2 inline-block text-lg"></i>{" "}
            customers
          </li>
        </Link>
        <Link to="/admin/categories" className="text-base capitalize">
          <li className="px-7 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-bar-chart mr-2 inline-block text-lg"></i>{" "}
            categories
          </li>
        </Link>
        <li className="px-9 transition-all py-3 text-white flex items-center">
          <button
            className="py-2 px-4 bg-red-600 text-white rounded-md capitalize hover:bg-red-800 "
            onClick={adminLogout}
          >
            logout
          </button>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
