import { useDispatch, useSelector } from "react-redux";
// import logo from "../../files/logo.svg";
// import Logout from "../../files/Logout.svg";
import { useNavigate } from "react-router";
import { logOut as storeLogout } from "../store/authSlice";
import authService from "../backend/auth.config.js";
function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userName = useSelector((state) => state.auth.userData?.userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogOut = () => {
    authService.logout().then(() => {
      dispatch(storeLogout());
    });
  };
  return (
    <header className="bg-white shadow-md py-3 px-6 mb-1 flex justify-between items-center border-b border-gray-300 w-full sm:px-4 sm:px-10">
      <img
        // src={logo}
        alt="Logo"
        className="h-8 w-25 sm:w-30"
      />

      <div className="text-blue-500 font-semibold sm:text-sm">
        {authStatus ? (
          <div className="flex">
            <img
              // src={Logout}
              alt="Logout"
              className="fill-blue-500 mr-3"
              onClick={handleLogOut}
            />
            <span>Hello, {userName}</span>
          </div>
        ) : (
          <div>
            <a onClick={() => navigate("/login")} className="mx-1">
              Login
            </a>
            <a onClick={() => navigate("/register")} className="mx-1">
              Register
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
