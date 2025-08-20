import React from "react";
import { Loader2 } from "lucide-react"; // optional spinner icon

const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      
      {/* Spinner */}
      <div className="flex items-center justify-center mb-6 animate-spin">
        <Loader2 className="w-12 h-12 text-purple-600" />
      </div>

      {/* Loading Text */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
        Loading...
      </h1>
      <p className="text-gray-500 text-center px-4 sm:px-0">
        Please wait while we prepare your data
      </p>

      {/* Animated Dots */}
      <div className="flex mt-4 space-x-2">
        <span className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-0"></span>
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default Loading;
