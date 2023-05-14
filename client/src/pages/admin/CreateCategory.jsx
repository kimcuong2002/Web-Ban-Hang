import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { useCreateMutation } from "../../redux/services/categoryService";
import { setSuccess } from "../../redux/reducers/globalReducer";
import ReactQuill from "react-quill";

import { BsArrowLeftShort, BsLaptop } from "react-icons/bs";
import ImagesPreview from "../../components/ImagesPreview";
import laptop from "../../assets/img/laptop.jpg";

const CreateCategory = () => {
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [errorAvatar, setErrorAvatar] = useState("");
  const [value, setValue] = useState("");
  const [state, setState] = useState({
    name: "",
    image: "",
  });
  const [preview, setPreview] = useState([]);

  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const [saveCategory, data] = useCreateMutation();
  const errors = data?.error?.data?.errors ? data?.error?.data?.errors : [];

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

  const submitCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", value);
    formData.append("image", state.image);
    saveCategory(formData);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data?.isSuccess) {
      dispatch(setSuccess(data?.data?.message));
      navigate("/admin/categories");
    }
  }, [data?.isSuccess]);

  useEffect(() => {
    return () => {
      previewAvatar && URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const handleChooseAvatar = (e) => {
    const file = e.target.files[0];
    setPreviewAvatar(URL.createObjectURL(file));
    setErrorAvatar("");
  };

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/admin/categories" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2">
            <BsArrowLeftShort size={24} />
            Category List
          </button>
        </Link>
      </ScreenHeader>
      <form className="w-full md:w-full" onSubmit={submitCategory}>
        {errors.length > 0 &&
          errors.map((error, key) => (
            <p className="alert-danger mx-3" key={key}>
              {error.msg}
            </p>
          ))}
        <div className="p-3">
          <label
            htmlFor="Category's name"
            className="label block mb-2 text-sm text-gray-400"
          >
            Category's name
          </label>
          <input
            type="text"
            name="name"
            className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
            placeholder="Category Name..."
            value={state.name}
            onChange={handleInput}
          />
        </div>
        <div className="w-full p-3">
          <label
            htmlFor="description"
            className="label block mb-2 text-sm text-gray-400"
          >
            Description
          </label>
          <ReactQuill
            theme="snow"
            name="description"
            id="description"
            value={value}
            onChange={setValue}
            placeholder="Description..."
          />
        </div>
        <div className="w-full p-3">
          <label
            htmlFor="images"
            className="label block mb-2 text-sm text-gray-400"
          >
            Image
          </label>
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
                  src={laptop}
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
        <div className="mb-3">
          <input
            type="submit"
            value={data.isLoading ? "loading..." : "Create Category"}
            disabled={data.isLoading ? true : false}
            className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
          />
        </div>
      </form>
    </Wrapper>
  );
};
export default CreateCategory;
