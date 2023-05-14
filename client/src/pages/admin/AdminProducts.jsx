import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { clearMessage, setSuccess } from "../../redux/reducers/globalReducer";
import Wrapper from "./Wrapper";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../../redux/services/productService";
import { useForm } from "react-hook-form";
import { useAllCategoriesQuery } from "../../redux/services/categoryService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import ModalEditProduct from "../../components/ModalEditroduct";
import { validate } from "../../utils/validate";
const AdminProducts = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const [updateProduct, myResponse] = useUpdateProductMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!myResponse.isSuccess) {
      myResponse?.error?.data?.errors.map((err) => {
        toast.error(err.msg);
      });
    }
  }, [myResponse?.error?.data?.errors]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (myResponse?.isSuccess) {
      dispatch(setSuccess(myResponse?.data?.msg));
      navigate("/admin/products");
    }
  }, [myResponse?.isSuccess]);

  const categories = useAllCategoriesQuery();
  const [state, setState] = useState({
    name: "",
    price: 0,
    discount: 0,
    stock: 0,
    category: "",
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
  const [colorList, setColorList] = useState([])
  const [sizeList, setSizeList] = useState([]);
  const [description, setDescription] = useState("");
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
    setErrorVali({...errorVali, color: ""})
  };
  const deleteColor = (color) => {
    const filtered = colorList.filter((clr) => clr !== color);
    setColorList([...filtered]);
    setErrorVali({...errorVali, color: "Colors is required"})
  };
  const chooseSize = (sizeObject) => {
    let result = sizeList;
    if (result.includes(sizeObject)) {
      result = result.filter((size) => size.name !== sizeObject.name)
    } else {
      result = [...result, sizeObject]
    }
    setSizeList([...result]);
    setErrorVali({...errorVali, size: ""})
  };


  const products = useGetProductsQuery(page);
  // console.log(data);
  const { success } = useSelector((state) => state.globalReducer);
  const [delProduct, response] = useDeleteProductMutation();
  const [openModal, setOpenModal] = useState(false);

  const deleteProduct = (id) => {
    if (window.confirm("Are you really want to delete this product?")) {
      delProduct(id);
    }
  };
  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
    }
  }, [response?.data?.message]);
  useEffect(() => {
    if (success) {
      toast.success(success);
    }
    return () => {
      dispatch(clearMessage());
    };
  }, []);

  const handleSubmitProduct = (data) => {
    const result = validate(sizeList, colorList, description, listImagePreview)
    setErrorVali({...errorVali, ...result})
    if(result.size || result.color || result.desc || result.img) {
      return;
    }
    console.log('data', data)
    
  }
  return (
    <div className="relative" >
      <Wrapper>
        <ScreenHeader>
          <Link to="/admin/create-product" className="btn-dark">
            <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700">
              Create
            </button>
          </Link>

          <Toaster position="top-right" />
        </ScreenHeader>

        {openModal && (
          <Modal setOpen={setOpenModal}>
            <ModalEditProduct
              setOpen={setOpenModal}
              colorList={colorList}
              sizes={sizes}
              sizeList={sizeList}
              setSizeList={setSizeList}
              saveColors={saveColors}
              deleteColor={deleteColor}
              chooseSize={chooseSize}
              description={description}
              setDescription={setDescription}
              dataC={categories?.data}
              isFetchingC={categories?.isFetching}
              handleSubmit={handleSubmit(handleSubmitProduct)}
              errors={errors}
              validate={register}
              myResponse={myResponse}
              listImagePreview={listImagePreview}
              setListImagePreview={setListImagePreview}
              files={files}
              setFiles={setFiles}
              errorVali={errorVali}
              setErrorVali={setErrorVali}
            />
          </Modal>
        )}

        {success && <div className="alert-success">{success}</div>}
        {!products?.isFetching ? (
          products.data?.products?.length > 0 ? (
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left uppercase">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      name
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      price
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      stock
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      image
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      edit
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.data?.products?.map((product) => (
                    <tr className="odd:bg-gray-800" key={product.id}>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {product.name}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        ${product.price}.00
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {product.stock}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <img
                          src={`/${import.meta.env.VITE_PATH_IMAGE}/products/${product.images[0]
                            }`}
                          alt="image name"
                          className="w-20 h-20 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <a
                          onClick={() => { setOpenModal(true) }}
                          className="btn btn-warning"
                          data-modal-target="popup-modal"
                          data-modal-toggle="popup-modal"
                        >
                          edit
                        </a>
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <span
                          className="btn btn-danger cursor-pointer"
                          onClick={() => deleteProduct(product.id)}
                        >
                          delete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                page={parseInt(page)}
                perPage={products.data.perPage}
                count={products.data.count}
                path="admin/products"
              />
            </div>
          ) : (
            "No products!"
          )
        ) : (
          <Spinner />
        )}
      </Wrapper>
    </div>
  );
};
export default AdminProducts;
