import { useRef } from "react";
import Lighting from "./Lighting";
import {
  saveParticipant,
  getSittingCount,
} from "../firebase/helpers/firestoreHelpers";
import { openRazorpay } from "../razorpayUtils/razorpayHelpers";
import garbaImage from "../assets/garba.jpg";
import logoImage from "../assets/logo.png";

import QRCode from "qrcode";
import jsPDF from "jspdf";

export default function Page() {
  const formRef = useRef(null);

  const generatePass = async (participantId, data, paymentId, totalAmount) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(participantId);

      const doc = new jsPDF("l", "mm", [54, 85]);

      // BACKGROUND
      doc.addImage(garbaImage, "JPEG", 0, 0, 85, 54);

      // DARK OVERLAY
      doc.setFillColor(0, 0, 0);
      doc.setDrawColor(0, 0, 0);
      doc.setGState(new doc.GState({ opacity: 0.7 }));
      doc.rect(0, 0, 85, 54, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));

      // HEADER STRIP
      doc.setFillColor(128, 0, 0);
      doc.rect(0, 0, 85, 10, "F");
      doc.addImage(logoImage, "PNG", 2, 1.5, 7, 7);
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Paawan Garba Utsav 2025", 42.5, 6.5, { align: "center" });

      doc.setFontSize(5.2);
      doc.setTextColor(200, 200, 200);
      doc.text(
        "Venue: Shree D Sadan Dharmpal Ji Ka Bada Shahdol MP",
        42.5,
        12,
        { align: "center" }
      );

      // TITLE
      doc.setFontSize(10.5);
      doc.setTextColor(255, 230, 230);
      doc.text("ENTRY PASS", 42.5, 17, { align: "center" });

      // EVENT DATE
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("Date: 23 & 24 September", 42.5, 21, { align: "center" });

      // PARTICIPANT DETAILS
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      let y = 25;
      doc.text(`Name: ${data.name}`, 4, y);
      y += 4;
      doc.text(`Mobile: ${data.mobile}`, 4, y);
      y += 4;
      doc.text(`No. of People: ${data.numberOfPeople}`, 4, y);
      y += 4;
      doc.text(`Pass Type: ${data.passType}`, 4, y);

      // QR CODE
      doc.addImage(qrDataUrl, "PNG", 62, 28, 16, 16);
      doc.setFontSize(5);
      doc.setTextColor(255, 255, 255);
      doc.text("Scan to Verify", 70, 47, { align: "center" });

      const pdfBlob = doc.output("blob");
      return URL.createObjectURL(pdfBlob);
    } catch (err) {
      console.error("Error generating pass:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      name: form.name.value,
      mobile: form.mobile.value,
      passType: form.passType.value,
      numberOfPeople: parseInt(form.numberOfPeople.value, 10),
    };

    try {
      // Sitting seats availability check
      if (data.passType === "Sitting") {
        let currentSittingCount = 0;
        try {
          currentSittingCount = await getSittingCount();
        } catch (err) {
          console.error("Error fetching sitting count:", err);
        }

        if ((currentSittingCount || 0) + data.numberOfPeople > 500) {
          alert(
            "Sorry! Sitting seats are full. Please choose Standing pass or reduce number of people."
          );
          return; // Stop booking
        }
      }

      // Price logic
      const pricePerPerson = data.passType === "Sitting" ? 100 : 50;
      const totalAmount = data.numberOfPeople * pricePerPerson;

      // Open Razorpay
      openRazorpay(
        totalAmount,
        data,
        async (paymentResponse) => {
          try {
            const participantId = await saveParticipant({
              ...data,
              paymentId: paymentResponse.razorpay_payment_id,
              amountPaid: totalAmount,
              isUsed: false,
            });

            const passUrl = await generatePass(
              participantId,
              data,
              paymentResponse.razorpay_payment_id,
              totalAmount
            );

            window.open(passUrl, "_blank");

            const link = document.createElement("a");
            link.href = passUrl;
            link.download = `GarbaPass_${participantId}.pdf`;
            link.click();

            form.reset();
          } catch (err) {
            console.error(err);
            alert("Error saving participant or generating pass.");
          }
        },
        (err) => {
          console.error("Razorpay error:", err);
          alert("Payment failed. Please try again.");
        }
      );
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <Lighting />

      {/* HEADER */}
      <header className="bg-[#800000] pb-4 pt-0 shadow-md text-center relative z-10">
        <h1 className="text-4xl text-white pt-0 font-d">
          Paawan Garba Utsav 2025
        </h1>
      </header>

      {/* MARQUEE */}
      <div className="bg-[#F8EDEB] text-[#7D5A5A] py-2 font-semibold overflow-hidden relative">
        <div className="whitespace-nowrap animate-marquee font-b">
          <span className="mx-10">⚡ Limited Seats Available! Book Now!</span>
          <span className="mx-10">
            💃 Venue: Shree D Sadan Dharmpal Ji Ka Bada Shahdol MP
          </span>
          <span className="mx-10">🎶 Live DJ & Special Performances!</span>
          <span className="mx-10">✨ Date: 23 & 24 September</span>
        </div>
      </div>

      {/* HERO / BG IMAGE */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <img
            src={garbaImage}
            alt="Garba Background"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 font-c text-[#FAF3E0] drop-shadow-lg">
            Join the Biggest Garba Night!
          </h2>
          <a href="#booking">
            <button className="bg-[#EFD9CE] text-[#7A5C58] px-6 py-3 rounded-lg shadow-md hover:bg-[#e6c7b8] transition font-c">
              Book Now
            </button>
          </a>
        </div>
      </section>

      {/* BOOKING FORM & PRICING */}
      <section
        id="booking"
        ref={formRef}
        className="min-h-screen flex flex-col md:flex-row justify-center items-center gap-20 bg-[#F7F5EB] py-10 px-4"
      >
        {/* Booking Form */}
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border border-[#E6D5C3]">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A7727D] font-a">
            Book Your Garba Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 font-l">
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Pass Type
              </label>
              <select
                name="passType"
                required
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"
              >
                <option value="">Select</option>
                <option>Sitting</option>
                <option>Standing</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                required
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                No. of People
              </label>
              <input
                type="number"
                name="numberOfPeople"
                min="1"
                max="10"
                required
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B5838D] text-white py-3 rounded-lg font-semibold hover:bg-[#6D6875] transition shadow-md"
            >
              Submit Booking
            </button>
          </form>
        </div>

        {/* Pricing Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm border border-[#E6D5C3] text-center">
          <h3 className="text-3xl font-bold text-[#7D5A5A] mb-4 font-q">
            Pass Rates
          </h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-[#F8EDEB] transition">
              <p className="font-semibold text-[#7A5C58]">Sitting</p>
              <p className="text-2xl font-bold text-[#A7727D]">₹100/-</p>
            </div>
            <div className="p-4 border rounded-lg bg-[#F8EDEB] transition">
              <p className="font-semibold text-[#7A5C58]">Standing</p>
              <p className="text-2xl font-bold text-[#A7727D]">₹50/-</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
