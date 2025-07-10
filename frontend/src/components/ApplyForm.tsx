import React, { useState } from "react";

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    payment: "",
    location: "",
    duration: "",
    category: "",
    requirements: "",
    contactInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      console.log(formData)
      const response = await fetch(
        "https://iiit-naya-raipur-hakathon.vercel.app/api/work/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            location: formData.location.split(","),
          }),
        }
      );

      if (response.ok) {
        setFormMessage({
          type: "success",
          text: "Work listing created successfully!",
        });
        setFormData({
          title: "",
          description: "",
          payment: "",
          location: "",
          duration: "",
          category: "",
          requirements: "",
          contactInfo: "",
        });
      } else {
        setFormMessage({
          type: "error",
          text: "Failed to create work listing",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormMessage({
        type: "error",
        text: "Error connecting to server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: "title",
      label: "Job Title",
      placeholder: "Enter a clear job title",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Describe the job in detail",
      type: "textarea",
    },
    {
      name: "payment",
      label: "Payment",
      placeholder: "Payment amount or range",
      type: "text",
    },
    {
      name: "location",
      label: "Location",
      placeholder: "Enter locations separated by commas",
      type: "text",
    },
    {
      name: "duration",
      label: "Duration",
      placeholder: "Expected duration of the job",
      type: "text",
    },
    {
      name: "category",
      label: "Category",
      placeholder: "Job category",
      type: "text",
    },
    {
      name: "requirements",
      label: "Requirements",
      placeholder: "Required skills and qualifications",
      type: "textarea",
    },
    {
      name: "contactInfo",
      label: "Contact Information",
      placeholder: "How applicants should contact you",
      type: "text",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 rounded-xl shadow-2xl mt-10 border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
        Create Work Listing
      </h2>

      {formMessage.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            formMessage.type === "success"
              ? "bg-green-800/50 text-green-200 border border-green-700"
              : "bg-red-800/50 text-red-200 border border-red-700"
          }`}
        >
          {formMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div
              key={field.name}
              className={`${field.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              <label
                htmlFor={field.name}
                className="block font-medium text-sm mb-2 text-blue-300"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-600 bg-gray-800/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500 min-h-24"
                  required
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-600 bg-gray-800/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Create Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
