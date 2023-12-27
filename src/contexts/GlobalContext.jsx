import { useContext, createContext, useState, useEffect } from "react";
import { Spin } from "antd";
import useAxios from "../hooks/useAxios";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    role: "",
    address: "",
    email: "",
    fullName: "",
    phone: "",
    district: "",
    ward: "",
  });

  const [districtsCxt, setDistrictsCxt] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { api } = useAxios();

  const getUser = async (needLoading = true) => {
    if (needLoading) {
      setIsLoading(true);
    }
    try {
      const { data } = await api.get("/me");
      console.log(data, "me");
      setUser({
        ...user,
        id: String(data.user.id),
        role: String(data.user.id_role),
        email: data.user.email || "",
        address: data.user.address || "",
        district: data.user.id_district || "",
        ward: data.user.id_ward || "",
        phone: data.user.phone || "",
        fullName: data.user.full_name || "",
      });
    } catch (error) {
      console.log(error);
    }
    if (needLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        getUser,
        districtsCxt,
        setDistrictsCxt,
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        children
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default GlobalContextProvider;
