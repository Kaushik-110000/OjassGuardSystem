import { useNavigate } from "react-router-dom";
// import logo from "../files/logomain.svg";

function Homedesign() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
        <img
          // src={logo}
          alt="Recoz Logo"
          className="w-50 md:w-80 mb-6 animate-fadeIn "
        />
        <h1 className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-lg animate-slideIn">
          Recoz
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mt-2 text-center max-w-lg animate-fadeInSlow">
          Recognize. Create. Showcase.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-3 text-lg md:text-xl bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105 animate-bounce"
        >
          Lets Recoz
        </button>
      </div>
    </div>
  );
}

export default Homedesign;
