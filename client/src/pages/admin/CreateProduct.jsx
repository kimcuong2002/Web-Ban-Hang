import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TwitterPicker } from "react-color";
import { v4 as uuidv4 } from "uuid";
import ReactQuill from "react-quill";
import toast, { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import Spinner from "../../components/Spinner";
import Colors from "../../components/Colors";
import SizesList from "../../components/SizesList";
import ImagesPreview from "../../components/ImagesPreview";
import { BsArrowLeftShort } from "react-icons/bs";
import { useAllCategoriesQuery } from "../../redux/services/categoryService";
import { useCProductMutation } from "../../redux/services/productService";
import { setSuccess } from "../../redux/reducers/globalReducer";
import { useForm } from "react-hook-form";

const CreateProduct = ({ onSubmit }) => {
  const { data = [], isFetching } = useAllCategoriesQuery();
  const [value, setValue] = useState("");
  const [state, setState] = useState({
    name: "",
    price: 0,
    discount: 0,
    stock: 0,
    category: "",
    colors: [],
    images: [],
  });
  const [sizes] = useState([
    { name: "xsm" },
    { name: "sm" },
    { name: "md" },
    { name: "lg" },
    { name: "xl" },
    { name: "1 year" },
    { name: "2 years" },
    { name: "3 years" },
    { name: "4 years" },
    { name: "5 years" },
  ]);
  const [sizeList, setSizeList] = useState([]);
  const [preview, setPreview] = useState([]);

  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      setState({ ...state, [e.target.name]: e.target.files });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ ...preview, [e.target.name]: reader.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const saveColors = (color) => {
    const filtered = state.colors.filter((clr) => clr.color !== color.hex);
    setState({
      ...state,
      colors: [...filtered, { color: color.hex, id: uuidv4() }],
    });
  };
  const deleteColor = (color) => {
    const filtered = state.colors.filter((clr) => clr.color !== color.color);
    setState({ ...state, colors: filtered });
  };
  const chooseSize = (sizeObject) => {
    const filtered = sizeList.filter((size) => size.name !== sizeObject.name);
    setSizeList([...filtered, sizeObject]);
  };
  const deleteSize = (name) => {
    const filtered = sizeList.filter((size) => size.name !== name);
    setSizeList(filtered);
  };
  const [createNewProduct, response] = useCProductMutation();
  //   console.log("Your response", response);
  const createPro = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("data", JSON.stringify(state));
    // formData.append("sizes", JSON.stringify(sizeList));
    // formData.append("description", value);
    // formData.append("images", state.images);
    console.log("state: ", state);
    createNewProduct(state);
  };
  useEffect(() => {
    if (!response.isSuccess) {
      response?.error?.data?.errors.map((err) => {
        toast.error(err.msg);
      });
    }
  }, [response?.error?.data?.errors]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (response?.isSuccess) {
      dispatch(setSuccess(response?.data?.msg));
      navigate("/admin/products");
    }
  }, [response?.isSuccess]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleSubmitProduct = (data) => {
    console.log(data);
  };
  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/admin/products" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2">
            <BsArrowLeftShort size={24} />
            Products list
          </button>
        </Link>
      </ScreenHeader>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-wrap -mx-3">
        <form
          className="w-full xl:w-8/12 p-3"
          onSubmit={handleSubmit(handleSubmitProduct)}
        >
          <div className="flex flex-wrap">
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="Product's name"
                className="label block mb-2 text-sm text-gray-400"
              >
                Product's name
              </label>
              <input
                type="text"
                name="name"
                className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                id="name"
                placeholder="Product Name..."
                {...register("name", { required: "Name is required!" })}
              />
              {errors.name && (
                <span className="text-err text-red-700">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="price"
                className="label block mb-2 text-sm text-gray-400"
              >
                Price
              </label>
              <input
                name="price"
                className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                id="price"
                placeholder="Price..."
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 100000,
                    message: "Price is not valid!",
                  },
                  pattern: {
                    value: /^\d*[1-9]\d*$/,
                    message: "Price is not valid!",
                  },
                })}
              />
              {errors.price && (
                <span className="text-err text-red-700">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="discount"
                className="label block mb-2 text-sm text-gray-400"
              >
                Discount
              </label>
              <div className=" justify-center items-center gap-3">
                <div className="flex">
                  <input
                    type="number"
                    name="discount"
                    className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                    id="discount"
                    placeholder="discount..."
                    {...register("discount", {
                      min: {
                        value: 10000,
                        message: "Discount is not valid",
                      },
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Discount is not valid.",
                      },
                    })}
                  />
                  <div className="text-2xl text-gray-400">%</div>
                </div>
                {errors.discount && (
                  <span className="text-err text-red-700">
                    {errors.discount.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="stock"
                className="label block mb-2 text-sm text-gray-400"
              >
                Stock
              </label>
              <input
                type="number"
                name="stock"
                className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                id="stock"
                placeholder="stock..."
                {...register("stock", {
                  required: "Stock is required",
                  min: {
                    value: 10000,
                    message: "Stock is not valid",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Stock is not valid.",
                  },
                })}
              />
              {errors.stock && (
                <span className="text-err text-red-700">
                  {errors.stock.message}
                </span>
              )}
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="categories"
                className="label block mb-2 text-sm text-gray-400"
              >
                Categories
              </label>
              {!isFetching ? (
                data?.categories?.length > 0 && (
                  <>
                    <select
                      name="category"
                      id="categories"
                      className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                      // data-te-select-init
                      {...register("category", {
                        required: "Please choose category",
                      })}
                    >
                      <option value="">Choose category</option>
                      {data?.categories?.map((category) => (
                        <option value={category.id} key={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="text-err text-red-700">
                        {errors.category.message}
                      </span>
                    )}
                  </>
                )
              ) : (
                <Spinner />
              )}
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="colors"
                className="label block mb-2 text-sm text-gray-400"
              >
                Choose colors
              </label>
              <TwitterPicker
                onChangeComplete={saveColors}
                name="color"
                {...register("color", {
                  required: "Please choose color",
                })}
              />
              {errors.color && (
                <span className="text-err text-red-700">
                  {errors.color.message}
                </span>
              )}
            </div>

            <div className="w-full p-3">
              <label
                htmlFor="sizes"
                className="label block mb-2 text-sm text-gray-400"
              >
                Choose sizes
              </label>
              {sizes.length > 0 && (
                <div className="flex flex-wrap -mx-3">
                  {sizes.map((size) => (
                    <div
                      key={size.name}
                      className="size"
                      name="size"
                      onClick={() => chooseSize(size)}
                      {...register("size", {
                        required: "Please choose size",
                      })}
                    >
                      {size.name}
                    </div>
                  ))}
                </div>
              )}
              {errors.size && (
                <span className="text-err text-red-700">
                  {errors.size.message}
                </span>
              )}
            </div>
            <div className="w-full p-3">
              <label
                htmlFor="images"
                className="label block mb-2 text-sm text-gray-400"
              >
                Images
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
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
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
                id="description"
                value={value}
                onChange={setValue}
                placeholder="Description..."
                {...register("description", {
                  required: "Oh, Product's description! Can not be left blank.",
                })}
              />
              {errors.description && (
                <span className="text-err text-red-700">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="w-full px-3 mt-3">
              <button>
                <input
                  type="submit"
                  value={response.isLoading ? "loading..." : "Save Product"}
                  disabled={response.isLoading ? true : false}
                  className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
                />
              </button>
            </div>
          </div>
        </form>
        <div className="w-full xl:w-4/12 p-3">
          <div className="mb-3">
            <Colors colors={state.colors} deleteColor={deleteColor} />
          </div>
          <div className="mb-3">
            <SizesList list={sizeList} deleteSize={deleteSize} />
          </div>
          <div className="mb-3">
            <ImagesPreview url={preview.images} heading="Images" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default CreateProduct;
