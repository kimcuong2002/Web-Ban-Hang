import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { setSuccess } from "../../redux/reducers/globalReducer";
import {
  useFetchCategoryQuery,
  useUpdateCategoryMutation,
} from "../../redux/services/categoryService";
import Spinner from "../../components/Spinner";
import { BsArrowLeftShort } from "react-icons/bs";
import ImagesPreview from "../../components/ImagesPreview";
import ReactQuill from "react-quill";

const UpdateCategory = () => {
  const [value, setValue] = useState("");
  const [state, setState] = useState({
    name: "",
    image: "",
  });
  const [preview, setPreview] = useState([]);

  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

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

  const { id } = useParams();
  const { data, isFetching } = useFetchCategoryQuery(id);
  //   console.log("category data: ", data);
  useEffect(() => {
    data?.category && setState({ name: data?.category?.name });
    setValue(data?.category?.description);
  }, [data?.category]);
  const [saveCategory, response] = useUpdateCategoryMutation();
  //   console.log(response);
  const errors = response?.error?.data?.errors
    ? response?.error?.data?.errors
    : [];

  const updateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", value);
    if (state.image !== undefined) {
      formData.append("image", state.image);
    }
    saveCategory({ formData, id });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (response?.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
      navigate("/admin/categories");
    }
  }, [response?.isSuccess]);

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
      {!isFetching ? (
        <form className="w-full md:w-full" onSubmit={updateSubmit}>
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
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  name="image"
                  onChange={imageHandle}
                />
              </label>
            </div>
          </div>
          <div className="mb-3">
            <ImagesPreview url={preview.image} heading="Image" />
          </div>
          <div className="mb-3 m-3">
            <input
              type="submit"
              value={data.isLoading ? "loading..." : "Update"}
              disabled={data.isLoading ? true : false}
              className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
            />
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};
export default UpdateCategory;
