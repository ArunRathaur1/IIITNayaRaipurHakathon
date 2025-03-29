import React, { useEffect, useState } from "react";

export default function ShowData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://iiitnayaraipurhakathon.onrender.com/api/work/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-8">
        Work Listings
      </h1>

      {error && (
        <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400">Loading listings...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center bg-gray-800 rounded-xl p-8 shadow-lg">
          <p className="text-xl text-gray-400">
            No work listings available at the moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:bg-gray-750 border border-gray-700 hover:border-blue-500"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-blue-400 mb-2">
                  {item.title}
                </h2>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-3">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 my-4">
                <div className="flex items-center">
                  <span className="text-blue-400 mr-2">💰</span>
                  <span>${item.payment}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 mr-2">📍</span>
                  <span>{item.location.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 mr-2">⏱️</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 mr-2">📞</span>
                  <span className="truncate">{item.contactInfo}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-gray-300 font-semibold mb-2">
                  Requirements:
                </h3>
                <p className="text-gray-400">{item.requirements}</p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  Apply Now
                </button>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
