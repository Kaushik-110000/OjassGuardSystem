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
  UserDashboard,
} from "./components/index.js";
import Error from "./components/Error.jsx";
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
        path: "/guard/:username",
        element: <UserDashboard />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
