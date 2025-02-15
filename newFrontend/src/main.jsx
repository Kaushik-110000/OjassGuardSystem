import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import {
  RegisterUser,
  RegisterGuard,
  LoginUser,
  LoginGuard,
  Map,
  GuardDashboard,
  AdminDashboard,
  UserDashboard,
  Complains,
} from "./components/index.js";
import Error from "./components/Error.jsx";
import Liveloc from "./components/Liveloc.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/user/register",
        element: <RegisterUser />,
      },
      {
        path: "/guard/register",
        element: <RegisterGuard />,
      },
      {
        path: "/user/login",
        element: <LoginUser />,
      },
      {
        path: "/user/u/:username",
        element: <UserDashboard />,
      },
      {
        path: "/guard/login",
        element: <LoginGuard />,
      },
      {
        path: "/guard/g/:username",
        element: <GuardDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/locatemap",
        element: <Map />,
      },
      {
        path: "/liveloc",
        element: <Liveloc />,
      },
      {
        path: "/complains/:guardId",
        element: <Complains />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
