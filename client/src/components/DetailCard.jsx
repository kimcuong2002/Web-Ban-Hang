import { useState, useEffect, useMemo } from 'react';
import currency from 'currency-formatter';
import { motion } from 'framer-motion';
import h2p from 'html2plaintext';
import htmlParser from 'html-react-parser';
import toast, { Toaster } from 'react-hot-toast';
import { BsCheck2 } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Quantity from './Quantity';
import { addCart, setTotal } from '../redux/reducers/cartReducer';
import { discount } from '../utils/discount';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from '../components/Pagination';
import {
  useCreateCartMutation,
  useUpdateCartMutation,
} from '../redux/services/cartService';
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
} from '../redux/services/reviewServices';
import Comment from './Comment';
import StarIcon from './StarIcon';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const DetailsCard = ({ product }) => {
  const [sizeState, setSizeState] = useState(
    product?.sizes?.length > 0 && product.sizes[0]
  );
  const [colorState, setColorState] = useState(
    product?.colors?.length > 0 && product.colors[0]
  );
  const [image, setImage] = useState(
    product.images[0] ? product.images[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [idCart, setIdCart] = useState('');
  const [page, setPage] = useState(1);
  const [sumStar, setSumStar] = useState(0);
  const [comment, setComment] = useState({
    rating: 0,
    content: '',
  });
  const [errorComment, setErrorComment] = useState('');

  const limit = useMemo(() => {
    return 5;
  }, []);
  const reviews = useGetReviewsQuery({
    page: page,
    productId: product.id,
    limit: limit,
  });
  const [createReview, responseReview] = useCreateReviewMutation();

  const inc = () => {
    setQuantity(quantity + 1);
  };
  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { user, userToken } = useSelector((state) => state.authReducer);
  const { cart } = useSelector((state) => state.cartReducer);
  const [createCart, res] = useCreateCartMutation();
  const [updateCart, response] = useUpdateCartMutation();

  const navigate = useNavigate();

  const discountPrice = discount(product.price, product.discount);
  let desc = h2p(product.description);
  desc = htmlParser(desc);
  const dispatch = useDispatch();
  const addToCart = () => {
    const {
      ['colors']: colors,
      ['sizes']: sizes,
      ['createdAt']: createdAt,
      ['updatedAt']: updatedAt,
      ...newProduct
    } = product;
    newProduct['size'] = sizeState;
    newProduct['color'] = colorState;
    newProduct['quantity'] = quantity;
    newProduct['category'] = product.category.id;
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    const checkItem = cartItems.find(
      (item) =>
        item.id === newProduct.id &&
        item.size === newProduct.size &&
        item.color === newProduct.color
    );

    if (cartItems.lenght === 0) {
      dispatch(addCart(newProduct));
      cartItems.push(newProduct);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      toast.success(`${newProduct.name} successfully added to cart`);
      createCart({
        userId: user?.id,
        cart: [newProduct],
      });
    } else {
      if (!checkItem) {
        dispatch(addCart(newProduct));
        cartItems.push(newProduct);
        const id = localStorage.getItem('cartId');
        if (idCart) {
          updateCart({ id: idCart, body: { cart: cartItems } });
        } else {
          if (id) {
            updateCart({ id: id, body: { cart: cartItems } });
          } else {
            createCart({
              userId: user?.id,
              cart: cartItems,
            });
          }
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        toast.success(`${newProduct.name} successfully added to cart`);
      } else {
        toast.error(`${newProduct.name} is already in cart`);
        return;
      }
    }
  };

  const handleComment = () => {
    if (userToken) {
      if (comment.rating === 0 || !comment.content) {
        return setErrorComment('Vui lòng chọn sao và nội dung bình luận')
      }
      createReview({
        rating: comment.rating,
        message: comment.content,
        product: product?.id,
        user: user?.id,
      });
    } else {
      navigate('/login');
    }
  };

  const handleChooseSumStar = (item) => {
    if (item === sumStar) {
      setComment({ ...comment, rating: 0 });
      return setSumStar(0);
    }
    setComment({ ...comment, rating: item });
    setSumStar(item);
  };

  useEffect(() => {
    if (responseReview?.isSuccess) {
      reviews.refetch();
      handleChooseSumStar(0);
      setComment({ rating: 0, content: '' });
      setErrorComment('')
      setPage(1);
      toast.success('You review product successfully!');
    }
  }, [responseReview?.isSuccess]);

  useEffect(() => {
    if (cart.length !== 0) {
      setIdCart('');
      dispatch(setTotal(0));
    }
  }, [cart]);

  useEffect(() => {
    if (res?.isSuccess) {
      setIdCart(res?.data?.cart.id);
      localStorage.setItem('cartId', res?.data?.cart.id);
    }
  }, [res?.isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap -mx-5"
    >
      <Toaster />
      <div className="w-full order-2 md:order-1 md:w-6/12 p-5">
        {product.images.length > 0 && (
          <>
            <div className="flex flex-wrap -mx-1">
              <div className="sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[300px] lg:h-[300px] object-cover mx-auto">
                <img
                  src={`../${
                    import.meta.env.VITE_PATH_IMAGE
                  }/products/${image}`}
                  alt="image"
                  className="w-full object-cover"
                />
              </div>

              <Swiper
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide className='swiper-slide-detail-cart' key={index} onClick={() => setImage(image)}>
                    <img
                      src={`../${
                        import.meta.env.VITE_PATH_IMAGE
                      }/products/${image}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}
      </div>
      <div className="w-full order-1 md:order-2 md:w-6/12 p-5">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">
          {product.name}
        </h1>
        <div className="flex gap-7 items-start my-5">
          <span className="text-2xl font-bold text-gray-900">
            {' '}
            {currency.format(discountPrice, { code: 'USD' })}
          </span>
          <span className="text-xl line-through text-yellow-500">
            {currency.format(product.price, { code: 'USD' })}
          </span>
        </div>

        {product.sizes.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-3">
              sizes
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.sizes.map((size) => (
                <div
                  className={`p-2 m-1 border border-gray-300 rounded cursor-pointer ${
                    sizeState === size && 'bg-green-600'
                  }`}
                  key={size}
                  onClick={() => setSizeState(size)}
                >
                  <span
                    className={`text-sm font-semibold uppercase  ${
                      sizeState === size ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {product.colors.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
              colors
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setColorState(color)}
                  className={`border border-gray-300 rounded m-1 p-1 cursor-pointer ${
                    colorState === color && 'border-green-600'
                  }`}
                >
                  <span
                    className="min-w-[40px] min-h-[40px] rounded flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {colorState === color && (
                      <BsCheck2 className="text-white" size={20} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex -mx-3 items-center">
          <div className="w-full sm:w-6/12 p-3">
            <Quantity quantity={quantity} inc={inc} dec={dec} />
          </div>
          <button
            className="uppercase w-full sm:w-6/12 p-3 text-center rounded-md border border-gray-300 m-1 cursor-pointer hover:bg-green-700 hover:text-white"
            onClick={addToCart}
          >
            add to cart
          </button>
        </div>
        <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
          description
        </h3>
        <div className="mt-4 leading-[27px] description">{desc}</div>
      </div>
      <div className="w-full order-3 px-5 items-center">
        <div className="">
          <p>Rating</p>
          <div className=" flex justify-start">
            {[1, 2, 3, 4, 5].map((item) => (
              <StarIcon
                key={item}
                click={() => handleChooseSumStar(item)}
                size="1.5rem"
                color={item <= sumStar ? 'orange' : 'gray'}
              />
            ))}
          </div>
          <p className="italic font-sans flex justify-start">
            Rating: {sumStar}/5
          </p>
        </div>
        {!reviews?.isFetching ? (
          <>
            <Comment
              setComment={setComment}
              comment={comment}
              onComment={handleComment}
              setErrorComment={setErrorComment}
              errorComment={errorComment}
              comments={reviews.data?.reviews}
              colorIcon={'orange'}
            />
            <Pagination
              page={parseInt(page)}
              perPage={limit}
              count={reviews.data?.count}
              click={(p) => setPage(p)}
            />
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </motion.div>
  );
};

export default DetailsCard;
