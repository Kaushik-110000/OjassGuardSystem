import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { RegisterUser } from "./components/index.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/user/register",
        element: <RegisterUser />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
