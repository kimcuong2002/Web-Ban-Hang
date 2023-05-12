import React from "react";

const Modal = ({ children, setOpen }) => {
  return (
    <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-[100vh] z-9 flex justify-center items-center">
      <a
        className="fixed top-0 left-0 w-full h-[100vh] z-10"
        onClick={() => setOpen(false)}
      ></a>
      {children}
    </div>
  );
};

export default Modal;
