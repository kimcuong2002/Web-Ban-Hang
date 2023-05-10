import { Virtual } from "swiper";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAllCategoriesQuery } from "../redux/services/categoryService";
import Skeleton from "./skeleton/Skeleton";
import Thumbnail from "./skeleton/Thumbnail";

const Categories = () => {
  const { data, isFetching } = useAllCategoriesQuery();
  return isFetching ? (
    <div className="flex flex-wrap -mx-4 mb-10">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          className="w-6/12 sm:w-4/12 md:w-3/12 lg:w-[20%] xl:w-2/12 p-4"
          key={item}
        >
          <Skeleton>
            <Thumbnail height="150px" />
          </Skeleton>
        </div>
      ))}
    </div>
  ) : (
    data?.categories.length > 0 && (
      <Swiper
        modules={[Virtual]}
        spaceBetween={20}
        slidesPerView={4}
        virtual
        className="w-full mb-10 py-3 px-2"
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1080: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
      >
        {data.categories.map((category, index) => {
          return (
            <SwiperSlide
              className="w-full overflow-hidden rounded-lg relative shadow transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
              key={index}
              virtualIndex={index}
            >
              <Link
                to={`/products/${category.name}`}
                className="text-white text-base font-medium capitalize"
              >
                <div className="w-full h-[150px] rounded-lg overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_PATH_IMAGE}/categories/${
                      category.image
                    }`}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center p-4">
                  {category.name}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    )
  );
};

export default Categories;
