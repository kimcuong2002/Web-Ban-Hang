import { toast } from "react-toastify";

function useToastify() {
  const handleOpenToastify = (status, content, duration) => {
    if (status === "success") {
      return toast.success(content, {
        position: "top-right",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    if (status === "error") {
      return toast.error(content, {
        position: "top-right",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return { handleOpenToastify };
}

export default useToastify;
