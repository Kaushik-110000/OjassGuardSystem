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
import Error from "./components/Error.jsx";
import LandingPage from "./components/Home.jsx";
function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  return !loading ? (
    <>
      <Container>
        {location.pathname === "/" && <LandingPage />}
        <Outlet />
      </Container>
    </>
  ) : null;
}

export default App;
