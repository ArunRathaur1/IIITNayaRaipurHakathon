import React from "react";
import { useNavigate } from "react-router-dom";

const UpdateCrop: React.FC = () => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    // ✅ Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const options = {
        key: "rzp_test_X5Z3WEj29Kjeew", // Razorpay test key
        amount: 100 * 100, // ₹100 in paise
        currency: "INR",
        name: "Crop Payment",
        description: "Pay ₹100 to update crop",
        handler: (response: any) => {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          navigate("/"); // ✅ Redirect to home page after payment
        }
      };

      // ✅ Ensure Razorpay exists before calling it
      if ((window as any).Razorpay) {
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        alert("Razorpay SDK failed to load. Please try again.");
      }
    };
    document.body.appendChild(script);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Update Your Crop</h2>
        <p style={styles.description}>
          To update your crop details, please make a secure payment of ₹100.
        </p>
        <button onClick={handlePayment} style={styles.button}>
          Pay ₹100
        </button>
        <p style={styles.note}>
          After payment, your crop will be updated automatically.
        </p>
      </div>
    </div>
  );
};

// ✅ Styles for improved UI
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#fff", // White background
  },
  box: {
    textAlign: "center",
    background: "#f8f9fa", // Light grey box
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    background: "#007BFF", // Blue button
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  note: {
    fontSize: "14px",
    color: "#666",
    marginTop: "15px",
  },
};

export default UpdateCrop;
