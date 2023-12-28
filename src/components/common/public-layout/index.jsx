import { Suspense } from "react";
import LoadingLazyComponent from "../loading-page";
import { useGlobalContext } from "../../../contexts/GlobalContext";
import { Navigate } from "react-router-dom";

const PublicLayout = ({ children }) => {
  const { user } = useGlobalContext();

  return (
    <Suspense fallback={<LoadingLazyComponent />}>
      {/* {!user.role ? children : <Navigate to="/" />} */}
      {user.role ? <Navigate to="/" />: children }
    </Suspense>
  );
};

export default PublicLayout;