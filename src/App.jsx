import { useState, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "./routers";
import { useGlobalContext } from "./contexts/GlobalContext";
import PublicLayout from "./components/common/public-layout";
import PrivateLayout from "./components/common/private-layout";
import "./App.css";

const Components = {};

PublicRoutes.concat(PrivateRoutes).forEach((route) => {
  Components[route.component] = lazy(() =>
    import(`./pages/${route.component}`)
  );
});

function App() {
  const { user } = useGlobalContext();

  console.log(user, "user");

  return (
    <Routes>
      {PublicRoutes.map((route, index) => {
        const Component = Components[route.component];
        return (
          <Route
            key={index}
            {...route}
            element={
              <PublicLayout>
                <Component />
              </PublicLayout>
            }
          />
        );
      })}
      {PrivateRoutes.map((route, index) => {
        const Component = Components[route.component];
        return (
          <Route
            key={index}
            {...route}
            element={
              <PrivateLayout>
                <Component />
              </PrivateLayout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
