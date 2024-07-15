const Indicator = ({ index }: { index: number }) => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-3 h-3 rounded-full bg-gray-300 mx-1"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300 mx-1"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300 mx-1"></div>
      </div>
      <div className="flex justify-center items-center">
        <div
          className={`w-3 h-3 rounded-full ${
            index > 0 ? "bg-gray-500" : "bg-gray-300"
          } mx-1`}
        ></div>
        <div
          className={`w-3 h-3 rounded-full ${
            index > 1 ? "bg-gray-500" : "bg-gray-300"
          } mx-1`}
        ></div>
        <div
          className={`w-3 h-3 rounded-full ${
            index > 2 ? "bg-gray-500" : "bg-gray-300"
          } mx-1`}
        ></div>
      </div>
    </div>
  );
};

export default Indicator;
