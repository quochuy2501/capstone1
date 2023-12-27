import { Suspense } from "react";
import LoadingLazyComponent from "../loading-page";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import { Navigate } from "react-router-dom";

const PrivateLayout = ({ children }) => {
  const { user } = useGlobalContext();

  return (
    <Suspense fallback={<LoadingLazyComponent />}>
      {user.role ? children : <Navigate to="/sign-in" />}
    </Suspense>
  );
};

export default PrivateLayout;