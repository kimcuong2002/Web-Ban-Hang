import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Private = ({ children }) => {
  const { adminToken } = useSelector((state) => state.authReducer);
  return adminToken ? children : <Navigate to="/login" />;
};
export default Private;
