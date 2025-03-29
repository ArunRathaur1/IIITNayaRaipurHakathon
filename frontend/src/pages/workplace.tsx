import React from "react";
import { useState } from "react";
import ShowData from '../components/ShowData';
import ApplyForm from '../components/ApplyForm'
import Navbar from "@/components/Navbar";
export default function Workplace() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen" style={{position:'relative',top:"100px"}}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveComponent("showdata")}
                className={`px-4 py-2 rounded ${
                  activeComponent === "showdata"
                    ? "bg-blue-500"
                    : "hover:bg-gray-700"
                }`}
              >
                Show Data
              </button>
              <button
                onClick={() => setActiveComponent("apply")}
                className={`px-4 py-2 rounded ${
                  activeComponent === "apply"
                    ? "bg-blue-500"
                    : "hover:bg-gray-700"
                }`}
              >
                Apply
              </button>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="container mx-auto mt-8">
          {activeComponent === "showdata" && <ShowData />}
          {activeComponent === "apply" && <ApplyForm />}
          {!activeComponent && (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome</h2>
              <p>Please select an option from the navbar above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
