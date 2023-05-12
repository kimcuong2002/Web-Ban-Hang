/**
 * Import Icons
 */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUserToken, setAdminToken } from "../redux/reducers/authReducer";

import { useUserLoginMutation } from "../redux/services/authService";
import { useForm } from "../hooks/Form";
import { showError } from "../utils/ShowError";

import {
  FaUser,
  FaLock,
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaLinkedinIn,
} from "react-icons/fa";
import useToastify from "../hooks/useToatify";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const { state, onChange } = useForm({
    username: "",
    password: "",
  });
  const toast = useToastify();
  const [loginUser, response] = useUserLoginMutation();
  const onSubmit = (e) => {
    e.preventDefault();
    loginUser(state);
  };
  useEffect(() => {
    if (response.isError) {
      toast.handleOpenToastify("error", "Login failed!", 2000);
      setErrors(response?.error?.data?.errors);
    }
  }, [response?.error?.data]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (response.isSuccess) {
      toast.handleOpenToastify("success", "Login successfully!", 2000);
      if (response.data?.admin) {
        localStorage.setItem("admin-token", response?.data?.token);
        dispatch(setAdminToken(response?.data?.token));
        navigate("/admin/products");
      } else {
        localStorage.setItem("userToken", response?.data?.token);
        dispatch(setUserToken(response?.data?.token));
        navigate("/");
      }
    }
  }, [response.isSuccess]);

  return (
    <form
      method="POST"
      onSubmit={onSubmit}
      className="flex items-center justify-center flex-col overflow-hidden px-20 login-form my-20"
    >
      <h2 className="text-4xl text-gray-600 m-3 font-bold capitalize">
        Sign in
      </h2>

      {showError(errors, "user") && (
        <div className="max-w-sm w-full flex gap-2 relative">
          <span className="w-full text-center rounded-md font-medium text-md bg-red-700 text-white p-3">
            {showError(errors, "user")}
          </span>
        </div>
      )}

      <div className="max-w-sm w-full bg-[#f0f0f0] mt-3 h-[55px] rounded-full flex gap-2 px-6 relative input-field">
        <div className="flex justify-center items-center mr-2">
          <FaUser
            className="text-center text-[#acacac]"
            size="1.2rem"
            style={{ transition: "0.5s" }}
          />
        </div>
        <input
          type="text"
          name="username"
          id="username"
          className="w-full bg-transparent outline-none border-none leading-4 font-semibold text-lg text-[#333] placeholder:text-#aaa placeholder:font-medium"
          placeholder="Username..."
          value={state.username}
          onChange={onChange}
        />
      </div>
      {showError(errors, "username") && (
        <div className="max-w-sm w-full mt-1 ml-5 font-medium flex text-sm text-red-800 dark:text-red-400">
          <span className="error">* {showError(errors, "username")}</span>
        </div>
      )}
      <div className="max-w-sm w-full bg-[#f0f0f0] mt-5 h-[55px] rounded-full flex gap-2 px-6 relative input-field">
        <div className="flex justify-center items-center mr-2">
          <FaLock
            className="text-center text-[#acacac]"
            size="1.2rem"
            style={{ transition: "0.5s" }}
          />
        </div>
        <input
          type="password"
          name="password"
          id="password"
          className="w-full bg-transparent outline-none border-none leading-4 font-semibold text-lg text-[#333] placeholder:text-#aaa placeholder:font-medium"
          placeholder="Password..."
          value={state.password}
          onChange={onChange}
        />
      </div>
      {showError(errors, "password") && (
        <div className="max-w-sm w-full mt-1 ml-5 font-medium flex text-sm text-red-800 dark:text-red-400">
          <span className="error">* {showError(errors, "password")}</span>
        </div>
      )}

      <input
        type="submit"
        value={`${response.isLoading ? "Loading..." : "sign in"}`}
        className="w-40 bg-gray-800 border-none outline-none h-[49px] rounded-full text-white uppercase font-semibold mb-2 mt-5 cursor-pointer solid hover:bg-[#242424]"
        disabled={response.isLoading ? true : false}
      />
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register">
          <b>Register</b>
        </Link>
      </p>
      <p className="py-3 text-base">Or Sign in with social platforms</p>
      <div className="flex justify-center items-center">
        <a
          href="#"
          className="text-[#333] h-11 w-11 flex justify-center items-center mx-2 rounded-[50%] border-solid border-2 border-[#333] hover:text-[#5995fd] hover:border-[#4481eb]"
          style={{ transition: "0.5s" }}
        >
          <FaFacebookF className="text-center" size="1.2rem" />
        </a>
        <a
          href="#"
          className="text-[#333] h-11 w-11 flex justify-center items-center mx-2 rounded-[50%] border-solid border-2 border-[#333] hover:text-[#5995fd] hover:border-[#4481eb]"
          style={{ transition: "0.5s" }}
        >
          <FaTwitter className="text-center" size="1.2rem" />
        </a>
        <a
          href="#"
          className="text-[#333] h-11 w-11 flex justify-center items-center mx-2 rounded-[50%] border-solid border-2 border-[#333] hover:text-[#5995fd] hover:border-[#4481eb]"
          style={{ transition: "0.5s" }}
        >
          <FaGoogle className="text-center" size="1.2rem" />
        </a>
        <a
          href="#"
          className="text-[#333] h-11 w-11 flex justify-center items-center mx-2 rounded-[50%] border-solid border-2 border-[#333] hover:text-[#5995fd] hover:border-[#4481eb]"
          style={{ transition: "0.5s" }}
        >
          <FaLinkedinIn className="text-center" size="1.2rem" />
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
