import Spinner from "../components/Spinner";
import Colors from "../components/Colors";
import { TwitterPicker } from "react-color";
import ReactQuill from "react-quill";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ListImagePreview from "../components/ListImagePreview";

function ModalEditProduct ({
        setOpen,
        colorList,
        sizes,
        sizeList,
        saveColors,
        deleteColor,
        chooseSize,
        description,
        setDescription,
        dataC,
        isFetchingC,
        errors,
        validate,
        handleSubmit,
        myResponse,
        listImagePreview,
        setListImagePreview,
        setFiles, 
        errorVali,
        setErrorVali
    }) {  

    return(
        <div className="relative bg-slate-300 ml-64 px-2 w-[70%] h-[90%] overflow-auto modal_container z-20">
            <div className="p-3 ">
                <div className="flex justify-between text-slate-800 font-bold text-[30px] uppercase">
                <p>EDIT PRODUCTS</p>
                <AiOutlineCloseCircle
                    onClick={() => setOpen(false)}
                    className="rounded-[100%] border-cyan-500 text-cyan-500 hover:bg-red-400 hover:text-black cursor-pointer"
                />
                </div>
                <hr className="mt-2"></hr>
                <div className="mt-4">
                    <form 
                        className="w-full"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-6/12 pr-6">
                                <label
                                    htmlFor="Product's name"
                                    className="label block mb-1 text-sm text-gray-700"
                                >
                                    Product's name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                                    id="name"
                                    placeholder="Product Name..."
                                    {...validate("name", { required: "Name is required!" })}
                                />
                                {errors.name && (
                                    <span className="text-err text-red-700">
                                    {errors.name.message}
                                    </span>
                                )}
                            </div>
                            <div className="w-full md:w-6/12 pl-6">
                                <label
                                    htmlFor="price"
                                    className="label block mb-1 text-sm text-gray-700"
                                >
                                    Price
                                </label>
                                <input
                                    name="price"
                                    className="text-sm rounded border focus:border-green-700 focus:border-2 block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                                    id="price"
                                    placeholder="Price..."
                                    {...validate("price", {
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
                            <div className="w-full md:w-6/12 py-3 pr-6">
                                <label
                                    htmlFor="discount"
                                    className="label block mb-1 text-sm text-gray-700"
                                >
                                    Discount
                                </label>
                                <div className=" justify-center items-center gap-3">
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="discount"
                                            className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                                            id="discount"
                                            placeholder="discount..."
                                            {...validate("discount", {
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
                                        <div className="text-2xl text-gray-700">%</div>
                                    </div>
                                    {errors.discount && (
                                    <span className="text-err text-red-700">
                                        {errors.discount.message}
                                    </span>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-6/12 pt-3 pl-6">
                                <label
                                    htmlFor="stock"
                                    className="label block mb-1 text-sm text-gray-700"
                                >
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                                    id="stock"
                                    placeholder="stock..."
                                    {...validate("stock", {
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
                            <div className="w-full md:w-6/12 pr-6">
                                <label
                                    htmlFor="categories"
                                    className="label block mb-1 text-sm text-gray-700"
                                >
                                    Categories
                                </label>
                                {!isFetchingC ? (
                                    dataC?.categories?.length > 0 && (
                                    <>
                                        <select
                                        name="category"
                                        id="categories"
                                        className="w-full text-sm rounded border focus:border-green-700 focus:border-2 block p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none"
                                        // data-te-select-init
                                        {...validate("category", {
                                            required: "Please choose category",
                                        })}
                                        >
                                        <option value="">Choose category</option>
                                        {dataC?.categories?.map((category) => (
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

                            <div className="w-full md:w-6/12 pl-6">
                                <label
                                    htmlFor="colors"
                                    className="label block mb-2 text-sm text-gray-700"
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

                            <div className="w-full md:w-6/12 pr-6">
                            </div>
                            <div className="w-full md:w-6/12 pl-6">
                                <Colors colors={colorList} deleteColor={deleteColor} />
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="sizes"
                                    className="label block text-sm text-gray-700"
                                >
                                    Choose sizes
                                </label>
                                {sizes.length > 0 && (
                                    <div className="flex flex-wrap px-16 mb-3">
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
                                    className="label block mb-2 text-sm text-gray-700"
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
                            <div className="w-full p-3 text-black">
                                <label
                                    htmlFor="description"
                                    className="label block mb-2 text-sm text-gray-700"
                                >
                                    Description
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    id="description"
                                    value={description}
                                    onChange={(value)=>{setDescription(value), setErrorVali({...errorVali, desc: ""})}}
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
                                    value={myResponse.isLoading ? "loading..." : "Save Product"}
                                    disabled={myResponse.isLoading ? true : false}
                                    className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700 flex justify-center items-center gap-2 hover:cursor-pointer"
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalEditProduct;
