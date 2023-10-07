import { useContext, createContext, useState, useEffect } from "react";
import { Spin } from "antd";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState({ role: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
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
