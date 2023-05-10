import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../../redux/reducers/authReducer";
import { useAuthLoginMutation } from "../../redux/services/authService";
import { FaLock, FaUser } from "react-icons/fa";
import { showError } from "../../utils/ShowError";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const [login, response] = useAuthLoginMutation();
  const errors = response?.error?.data?.errors
    ? response?.error?.data?.errors
    : [];
  const adminLoginFunction = (e) => {
    e.preventDefault();
    login(state);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (response.isSuccess) {
      localStorage.setItem("admin-token", response?.data?.token);
      dispatch(setAdminToken(response?.data?.token));
      navigate("/admin/products");
    }
  }, [response.isSuccess]);

  return (
    <form
      method="POST"
      className="flex items-center justify-center flex-col overflow-hidden px-20 login-form my-20"
      onSubmit={adminLoginFunction}
    >
      <h2 className="text-4xl text-gray-600 m-3 font-bold capitalize">Admin</h2>

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
          onChange={handleInputs}
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
          onChange={handleInputs}
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
    </form>
  );
};
export default AdminLogin;
