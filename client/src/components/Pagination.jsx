import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ page, count, perPage, path, theme, click }) => {

  const totalLinks = Math.ceil(count / perPage);
  let startLoop = page;
  let diff = totalLinks - page;
  if (diff <= 3) {
    startLoop = totalLinks - 3;
  }
  let endLoop = startLoop + 3;
  if (startLoop <= 0) {
    startLoop = 1;
  }
  const links = () => {
    const allLinks = [];
    for (let i = startLoop; i <= endLoop; i++) {
      allLinks.push(
        <li key={i} className={`pagination-li mr-1 px-2 py-1 rounded cursor-pointer ${
          theme === "light" ? "pagination-link-light" : "pagination-link"
        }  ${page === i && "bg-indigo-500 text-white"}`} onClick={() => {
          if(!path) {
            click(i);
          }
        }}>
          {path && !click && <Link
            className={`px-2 py-1 rounded ${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }  ${page === i && "bg-indigo-500 text-white"}`}
            to={`/${path}/${i}`}
          >
            {i}
          </Link>}
          {!path && click && i}
        </li>,
      );
    }
    return allLinks;
  };
  const next = () => {
    if (page < totalLinks) {
      return (
        <li className="pagination-li">
          <Link
            className={`${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }`}
            to={`/${path}/${page + 1}`}
          >
            <IoIosArrowForward />
          </Link>
        </li>
      );
    }
  };
  const prev = () => {
    if (page > 1) {
      return (
        <li className="pagination-li">
          <Link
            className={`${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }`}
            to={`/${path}/${page - 1}`}
          >
            <IoIosArrowBack />
          </Link>
        </li>
      );
    }
  };
  return (
    count > perPage && (
      <ul className="flex mt-5 justify-center items-center">
        {prev()}
        {links()}
        {next()}
      </ul>
    )
  );
};
export default Pagination;
