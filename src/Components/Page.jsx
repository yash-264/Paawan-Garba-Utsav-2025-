// src/App.jsx
import { useRef } from "react";
import garbaImage from "../assets/garba.jpg";
import Lighting from "./Lighting";

export default function Page() {
  const formRef = useRef(null);

  return (
    <div className="font-sans text-gray-800">
      {/* Decorative Lights */}
      <Lighting />

      {/* Header */}
      <header className="bg-[#800000] pb-4 pt-0 shadow-md text-center relative z-10">
        <h1 className="text-4xl text-white pt-0 font-d">
          Utsav Unlimited
        </h1>
      </header>

      {/* Offer Banner (Marquee Style) */}
      <div className="bg-[#F8EDEB] text-[#7D5A5A] py-2 font-semibold overflow-hidden relative">
        <div className="whitespace-nowrap animate-marquee font-b">
          <span className="mx-10">⚡ Limited Seats Available! Book Now!</span>
          <span className="mx-10">💃 Group Discount for 5+ Members!</span>
          <span className="mx-10">🎶 Live DJ & Special Performances!</span>
          <span className="mx-10">✨ Hurry! Early Bird Offer Ends Soon!</span>
        </div>
      </div>

      {/* Home Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center"
      >
        {/* Background image with opacity overlay */}
        <div className="absolute inset-0">
          <img
            src={garbaImage}
            alt="Garba Background"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 font-c text-[#FAF3E0] drop-shadow-lg">
            Join the Biggest Garba Night!
          </h2>
          <a href="">
            <button className="bg-[#EFD9CE] text-[#7A5C58] px-6 py-3 rounded-lg shadow-md hover:bg-[#e6c7b8] transition font-c">
              Book Now
            </button>
          </a>
        </div>
      </section>

      {/* Booking Form Section */}
      <section
        ref={formRef}
        className="min-h-screen flex justify-center items-center bg-[#F7F5EB] py-10"
      >
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border border-[#E6D5C3]">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A7727D] font-a">
            Book Your Garba Entry
          </h2>
          <form className="space-y-4 font-l">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                placeholder="Enter your age"
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Mobile
              </label>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Gender
              </label>
              <select
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                required
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Group Size */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Group Size (1–10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Enter group size"
                className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#B5838D] text-white py-3 rounded-lg font-semibold hover:bg-[#6D6875] transition shadow-md"
            >
              Submit Booking
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
