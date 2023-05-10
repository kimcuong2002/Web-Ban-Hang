import { React, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FiLogIn } from "react-icons/fi";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { userToken, user } = useSelector((state) => state.authReducer);
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const navbarAdmin = window.location.href;

  return (
    <div
      className={`navbar flex justify-center items-center py-2 shadow bg-[#212121] text-white ${
        navbarAdmin.includes("admin") && "hidden"
      }`}
    >
      <div className="container w-4/5 flex justify-between">
        {/* Logo */}
        <Link
          onClick={closeMobileMenu}
          className="logo flex justify-center items-center"
          to=""
        >
          <img className="w-14" src={logo} alt="Hoàng Long Technology" />
          <h2 className="hidden md:block text-base uppercase">
            Hoàng Long Technology
          </h2>
        </Link>

        {/* List menu */}
        <div className="menu flex justify-center items-center">
          <div
            className="flex items-center content-center cursor-pointer lg:hidden"
            onClick={handleClick}
          >
            {click ? <FaTimes size={40} /> : <FaBars size={40} />}
          </div>
          <ul
            className={
              click
                ? "navbar-nav flex flex-col absolute left-0 top-16 pt-3 bg-[#212121] z-10 w-screen h-screen gap-3 text-center transition-all duration-500 lg:transition-none lg:relative lg:flex-row lg:content-center lg:items-center lg:gap-5 lg:w-full lg:h-full lg:top-0 lg:left-0 lg:pt-0"
                : "navbar-nav flex flex-col absolute left-[-100%] top-16 pt-3 bg-[#212121] z-10 w-screen h-screen gap-3 text-center transition-all duration-500 lg:transition-none lg:relative lg:flex-row lg:content-center lg:items-center lg:gap-5 lg:w-full lg:h-full lg:top-0 lg:left-0 lg:pt-0 z-0"
            }
          >
            <Link to="" onClick={closeMobileMenu}>
              <li className="active nav-item cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                Home
              </li>
            </Link>
            <Link to="products" onClick={closeMobileMenu}>
              <li className="nav-item cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                Product
              </li>
            </Link>
            {/* <Link to="contact" onClick={closeMobileMenu}>
              <li className="nav-item cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                Contact
              </li>
            </Link> */}
            <Link
              to="cart"
              className="flex justify-center"
              onClick={closeMobileMenu}
            >
              <li className="nav-item cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                <TiShoppingCart size={26} />
              </li>
            </Link>

            {userToken ? (
              <Link
                to="profile"
                className="flex justify-center"
                onClick={closeMobileMenu}
              >
                <li className="nav-item flex gap-2 cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                  <FaRegUserCircle size={24} />
                </li>
              </Link>
            ) : (
              <Link
                to="login"
                className="flex justify-center"
                onClick={closeMobileMenu}
              >
                <li className="nav-item flex gap-1 cursor-pointer py-1.5 pl-2 duration-100 hover:text-green-200 active:text-gray-200">
                  Sign In
                  <FiLogIn size={26} />
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
