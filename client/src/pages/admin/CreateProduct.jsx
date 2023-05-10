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

const CreateProduct = () => {
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
        <form className="w-full xl:w-8/12 p-3" onSubmit={createPro}>
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
                onChange={handleInput}
                value={state.name}
                required
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, Product's name!</span> Cannot
                be left blank.
              </p>
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="price"
                className="label block mb-2 text-sm text-gray-400"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                id="price"
                placeholder="Price..."
                onChange={handleInput}
                value={state.price}
                required
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, Price!</span> Cannot be left
                blank.
              </p>
            </div>
            <div className="w-full md:w-6/12 p-3">
              <label
                htmlFor="discount"
                className="label block mb-2 text-sm text-gray-400"
              >
                Discount
              </label>
              <div className="flex justify-center items-center gap-3">
                <input
                  type="number"
                  name="discount"
                  className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                  id="discount"
                  placeholder="discount..."
                  onChange={handleInput}
                  value={state.discount}
                />
                <div className="text-2xl text-gray-400">%</div>
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
                onChange={handleInput}
                value={state.stock}
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, Stock!</span> Cannot be left
                blank.
              </p>
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
                      data-te-select-init
                      onChange={handleInput}
                      value={state.category}
                    >
                      <option value="">Choose category</option>
                      {data?.categories?.map((category) => (
                        <option value={category.id} key={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oh, Category!</span> Cannot
                      be left blank.
                    </p>
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
              <TwitterPicker onChangeComplete={saveColors} />
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
                      onClick={() => chooseSize(size)}
                    >
                      {size.name}
                    </div>
                  ))}
                </div>
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
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="images"
                    onChange={imageHandle}
                    multiple
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, Category!</span> Cannot be
                left blank.
              </p>
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
              />
            </div>
            <div className="w-full px-3 mt-3">
              <input
                type="submit"
                value={response.isLoading ? "loading..." : "Save Product"}
                disabled={response.isLoading ? true : false}
                className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
              />
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
