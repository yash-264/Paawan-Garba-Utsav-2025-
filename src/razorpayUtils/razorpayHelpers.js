import logoImage from "../assets/logo.png";


export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export const openRazorpay = async (amount, participantData, onSuccess, onFailure) => {
  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

 
  const prefill = {
    name: participantData.name || "",
    contact: participantData.mobile || "",
  };


  const options = {
    key: "rzp_test_RJxRnys2WOTuA5", 
    amount: amount * 100, 
    currency: "INR",
    name: "Paawan Garba Utsav 2025 ",
    description: "Garba Pass Booking",
    image: logoImage || "",
    handler: function (response) {
      console.log("Payment Success:", response);
      onSuccess(response);
    },
    prefill: prefill,
    notes: {
      groupSize: participantData.groupSize || 1,
    },
    theme: {
      color: "#B5838D",
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Razorpay error:", err);
    onFailure(err);
  }
};
