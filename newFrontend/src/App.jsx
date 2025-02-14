import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  login as storeLogin,
  logOut as storeLogout,
} from "./store/authSlice.js";
import Header from "./components/Header.jsx";
import { Outlet, useLocation } from "react-router-dom";
import authservice from "./backend/auth.config.js";
import Container from "./container/Container.jsx";
import Homedesign from "./components/Homedesign.jsx";
function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   authservice
  //     .checkRefresh()
  //     .then((res) => {
  //       if (res.status == 200) {
  //         authservice
  //           .refreshTokens()
  //           .then(() => {
  //             authservice
  //               .getCurrentUser()
  //               .then((res) => {
  //                 if (res?._id) {
  //                   dispatch(storeLogin({ userData: res }));
  //                   navigate(`/${res.userName}`);
  //                 } else {
  //                   dispatch(storeLogout());
  //                 }
  //               })
  //               .catch(() => {
  //                 dispatch(storeLogout());
  //                 navigate("/");
  //               })
  //               .finally(() => setLoading(false));
  //           })
  //           .catch(() => {
  //             dispatch(storeLogout());
  //             navigate("/");
  //           });
  //       } else {
  //         dispatch(storeLogout());
  //       }
  //     })
  //     .catch(() => {
  //       dispatch(storeLogout());
  //       navigate("/");
  //     });
  // }, []);

  return !loading ? (
    <Container>
      <Header />
      {location.pathname === "/" && <Homedesign />}
      <Outlet />
    </Container>
  ) : null;
}

export default App;
