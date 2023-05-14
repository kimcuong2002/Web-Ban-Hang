import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { useCreateCustomerMutation } from "../../redux/services/authService";
import { setSuccess } from "../../redux/reducers/globalReducer";
import { BsArrowLeftShort } from "react-icons/bs";
import ImagesPreview from "../../components/ImagesPreview";
import { showError } from "../../utils/ShowError";
import { useForm } from "react-hook-form";
import initialavatar from "../../assets/img/initialavatar.jpg";

const CreateCustomer = ({ onSubmit }) => {
  const [error, setErrors] = useState([]);
  const [state, setState] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    admin: false,
  });
  const [preview, setPreview] = useState([]);

  const [saveCustomer, data] = useCreateCustomerMutation();

  const [previewAvatar, setPreviewAvatar] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [errorAvatar, setErrorAvatar] = useState("");

  useEffect(() => {
    return () => {
      previewAvatar && URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const handleChooseAvatar = (e) => {
    const file = e.target.files[0];
    setPreviewAvatar(URL.createObjectURL(file));
    setAvatar(file);
    setErrorAvatar("");
  };

  // const errors = data?.error?.data?.errors ? data?.error?.data?.errors : [];

  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      setState({ ...state, [e.target.name]: e.target.files[0] });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ ...preview, [e.target.name]: reader.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const submitCustomer = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (data.isError) {
      setErrors(data?.error?.data?.errors);
    }
  }, [data?.error?.data]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data?.isSuccess) {
      dispatch(setSuccess(data?.data?.msg));
      navigate("/admin/customers");
    }
  }, [data?.isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitCustomer = (data) => {
    if (!previewAvatar) {
      return setErrorAvatar("Please choose avatar");
    }
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", avatar);
    formData.append("admin", data.admin);
    saveCustomer(formData);
  };

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/admin/customers" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2">
            <BsArrowLeftShort size={24} />
            Customers List
          </button>
        </Link>
      </ScreenHeader>
      <form
        className="w-full md:w-full"
        onSubmit={handleSubmit(handleSubmitCustomer)}
      >
        <div className="flex flex-wrap">
          <div className="w-full md:w-6/12 p-3">
            <label
              htmlFor="Username"
              className="label block mb-2 text-sm text-gray-400"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              className={`text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 text-white outline-none ${
                showError(error, "username")
                  ? "border-red-600 placeholder-red-300"
                  : "border-gray-600 placeholder-gray-400"
              }`}
              placeholder="Username..."
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-err text-red-700">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="w-full md:w-6/12 p-3">
            <label
              htmlFor="Password"
              className="label block mb-2 text-sm text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              className={`text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 text-white outline-none ${
                showError(error, "password")
                  ? "border-red-600 placeholder-red-300"
                  : "border-gray-600 placeholder-gray-400"
              }`}
              placeholder="Password..."
              {...register("password", {
                required: "Password is not required",
                minLength: {
                  value: 6,
                  message: "Password is not valid",
                },
              })}
            />{" "}
            {errors.password && (
              <span className="text-err text-red-700">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="w-full p-3">
            <label
              htmlFor="Fullname"
              className="label block mb-2 text-sm text-gray-400"
            >
              Fullname
            </label>
            <input
              type="text"
              name="fullname"
              className={`text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 text-white outline-none ${
                showError(error, "fullname")
                  ? "border-red-600 placeholder-red-300"
                  : "border-gray-600 placeholder-gray-400"
              }`}
              placeholder="Fullname..."
              {...register("fullname", {
                required: "Fullname is not required",
              })}
            />
            {errors.fullname && (
              <span className="text-err text-red-700">
                {errors.fullname.message}
              </span>
            )}
          </div>
          <div className="w-full md:w-8/12 p-3">
            <label
              htmlFor="Email"
              className="label block mb-2 text-sm text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
              placeholder="Email..."
              {...register("email", {
                required: "Email is not required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email is not valid",
                },
              })}
            />
            {errors.email && (
              <span className="text-err text-red-700">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="w-full md:w-4/12 p-3">
            <label
              htmlFor="Role"
              className="label block mb-2 text-sm text-gray-400"
            >
              Role
            </label>
            <div className="w-full text-sm font-medium border rounded bg-gray-700 border-gray-600 text-white">
              <div className="w-full rounded border-gray-600">
                <div className="flex items-center pl-3">
                  <input
                    id="vue-checkbox"
                    type="checkbox"
                    value=""
                    className="outline-none w-5 h-5 rounded bg-gray-600 border-gray-500"
                  />
                  <label
                    htmlFor="vue-checkbox"
                    className="w-full py-2.5 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Admin
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="my-[50px] flex flex-col justify-center items-center">
            {previewAvatar ? (
              <img
                src={previewAvatar}
                alt=""
                className="h-[200px] w-[200px] rounded-[50%] object-cover mb-[10px]"
              />
            ) : (
              <div>
                <img
                  src={initialavatar}
                  alt=""
                  className="h-[200px] w-[200px] rounded-[50%] object-cover mb-[10px]"
                />
              </div>
            )}
            <input
              type="file"
              onChange={handleChooseAvatar}
              className="mt-[10px]
                file:bg-gradient-to-b file:from-blue-500 file:to-blue-600
                file:px-3 file:py-1 file:m-5
                file:border-none
                file:rounded-full
                file:text-white
                file:cursor-pointer
                file:shadow-lg file:shadow-blue-600/50
                
                bg-gradient-to-br from-gray-600 to-gray-700
                text-white/80
                rounded-full
                cursor-pointer 
                shadow-xl shadow-gray-700/60
                "
            />
            {errorAvatar && (
              <div className="h-[50px]">
                <p className="text-md text-red-500 pl-5">{errorAvatar}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mb-3 mx-3">
          <button>
            <input
              type="submit"
              value={data.isLoading ? "loading..." : "Create Customer"}
              disabled={data.isLoading ? true : false}
              className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
            />
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default CreateCustomer;
