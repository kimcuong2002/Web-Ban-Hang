import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TwitterPicker } from "react-color";
import ReactQuill from "react-quill";
import toast, { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import Spinner from "../../components/Spinner";
import Colors from "../../components/Colors";
import { BsArrowLeftShort } from "react-icons/bs";
import { useAllCategoriesQuery } from "../../redux/services/categoryService";
import { useCProductMutation } from "../../redux/services/productService";
import { setSuccess } from "../../redux/reducers/globalReducer";
import { set, useForm } from "react-hook-form";
import ListImagePreview from "../../components/ListImagePreview";
import {validate} from "../../utils/validate";

const CreateProduct = ({ onSubmit }) => {
  const { data = [], isFetching } = useAllCategoriesQuery();
  const [description, setDescription] = useState("");
  const [state, setState] = useState({
    name: "",
    price: 0,
    discount: 0,
    stock: 0,
    category: "",
  });
  // console.log(data)
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

  const [colorList, setColorList] = useState([])
  const [sizeList, setSizeList] = useState([]);
  const [listImagePreview, setListImagePreview] = useState([])
  const [files, setFiles] = useState(null)

  const [errorVali, setErrorVali] = useState({
    size: '',
    color: '',
    desc: '', 
    img: ''
  })

  const saveColors = (color) => {
    const filtered = colorList.filter((clr) => clr !== color.hex);
    setColorList([...filtered, color.hex]);
    setErrorVali({...errorVali, color: ''});
  };
  const deleteColor = (color) => {
    const filtered = colorList.filter((clr) => clr !== color);
    setColorList([...filtered]);
    setErrorVali({...errorVali, color: 'Colors is required'})
  };
  const chooseSize = (sizeObject) => {
    let result = sizeList;
    if(result.includes(sizeObject)) {
      result = result.filter((size) => size.name !== sizeObject.name);
    } else {
      result = [...result, sizeObject]
      
    }
    setSizeList([...result]);
    setErrorVali({...errorVali, size: ''})
  };
  const [createNewProduct, response] = useCProductMutation();
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
    
    const result = validate(sizeList, colorList, description, listImagePreview)
    console.log(result)
    setErrorVali({...errorVali, ...result})
    if(result.size || result.color || result.desc || result.img) {
      return;
    }
    console.log('data', data)
    
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
          className="w-full p-3"
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
                        value: 0,
                        message: "Discount is not valid",
                      },
                      max: {
                        value: 100,
                        message: "Discount is not valid"
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
                  max: {
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
                onChangeComplete={(color) => saveColors(color)}
              />
              {errorVali.color && (
                <span className="text-err text-red-700">
                  {errorVali.color}
                </span>
              )}
            </div>

            <div className="w-full md:w-6/12 p-3"></div>
            <div className="w-full md:w-6/12 px-3">
              <Colors colors={colorList} deleteColor={deleteColor} />
            </div>

            <div className="w-full px-3">
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
                      className={sizeList.includes(size) ? 'size-active' : 'size'}
                      name="size"
                      onClick={() => chooseSize(size)}
                    >
                      {size.name}
                    </div>
                  ))}
                </div>
              )}
              {errorVali.size && (
                <span className="text-err text-red-700">
                  {errorVali.size}
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
              <ListImagePreview images={listImagePreview} />
              <div className="flex items-center justify-center w-[150px]">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-7 h-7 mb-1 text-gray-400"
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
                    
                  </div>
                  <input multiple accept="image/*" id="dropzone-file" type="file" className="hidden" onChange={(e) => {
                    let result = listImagePreview;
                    for(let i = 0; i < e.target.files.length; i++) {
                      result = [...result, URL.createObjectURL(e.target.files[i])]
                    }
                    setFiles(e.target.files)
                    setListImagePreview(result)
                  }} />
                </label>
              </div>
              {errorVali.img && (
                <span className="text-err text-red-700">
                  {errorVali.img}
                </span>
              )}
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
                value={description}
                onChange={(value)=> {setDescription(value), setErrorVali({...errorVali, desc: ''})}}
                placeholder="Description..."
              />
              {errorVali.desc && (
                <span className="text-err text-red-700">
                  {errorVali.desc}
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
      </div>
    </Wrapper>
  );
};
export default CreateProduct;
