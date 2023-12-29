import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "./routers";
import PublicLayout from "./components/common/public-layout";
import PrivateLayout from "./components/common/private-layout";
import "./App.css";

const Components = {};

PublicRoutes.concat(PrivateRoutes).forEach((route) => {
  Components[route.component] = lazy(() => // lazy cho phép ứng dụng chỉ tải thành phần cần thiết khi cần sử dụng
    import(`./pages/${route.component}`)
  );
});
function App() {
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
