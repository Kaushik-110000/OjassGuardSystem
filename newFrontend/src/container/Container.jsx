/* eslint-disable react/prop-types */
function Container({ children }) {
  return (
    <div className="flex flex-col w-screen h-fit overflow-x-hidden justify-center items-center">
      {children}
    </div>
  );
}

export default Container;
