import { useRef } from "react";
import Lighting from "./Lighting";
import { saveParticipant } from "../firebase/helpers/firestoreHelpers";
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

    // Card size: 85mm x 54mm
    const doc = new jsPDF("l", "mm", [54, 85]);

    // BACKGROUND
    // doc.setFillColor(255, 245, 230);
    // doc.rect(0, 0, 85, 54, "F");
    doc.addImage(garbaImage, "JPEG", 0, 0, 85, 54);

    // SEMI-TRANSPARENT OVERLAY (to darken background for better text visibility)
    doc.setFillColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setGState(new doc.GState({ opacity: 0.7 })); 
    doc.rect(0, 0, 85, 54, "F");
    doc.setGState(new doc.GState({ opacity: 1 })); // reset opacity for rest

    // HEADER STRIP
    doc.setFillColor(128, 0, 0);
    doc.rect(0, 0, 85, 10, "F");
    doc.addImage(logoImage, "PNG", 2, 1.5, 7, 7);
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Utsav Unlimited Garba Night", 42.5, 6.5, { align: "center" });

    // EVENT BANNER
    // doc.addImage(garbaImage, "JPEG", 2, 11, 81, 10);

    // TITLE
    doc.setFontSize(10.5);
    doc.setTextColor(255, 230, 230);
    doc.text("ENTRY PASS", 42.5, 15, { align: "center" });

    // PARTICIPANT DETAILS
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    let y = 25;
    doc.text(`PID: ${participantId}`, 4, y); y += 4;
    doc.text(`Name: ${data.name}`, 4, y); y += 4;
    doc.text(`Mobile: ${data.mobile}`, 4, y); y += 4;
    doc.text(`Group Size: ${data.groupSize}`, 4, y); y += 4;
    doc.text(`Payment ID: ${paymentId}`, 4, y);

    // QR CODE
    // QR CODE
doc.addImage(qrDataUrl, "PNG", 62, 28, 16, 16); // smaller QR, shifted slightly up
doc.setFontSize(5);
doc.setTextColor(255, 255, 255);
doc.text("Scan to Verify", 70, 47, { align: "center" }); // placed below QR



    // Return blob for preview
    const pdfBlob = doc.output("blob");
    return URL.createObjectURL(pdfBlob);
  } catch (err) {
    console.error("Error generating card pass:", err);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    name: form.name.value,
    age: form.age.value,
    mobile: form.mobile.value,
    gender: form.gender.value,
    groupSize: parseInt(form.groupSize.value, 10),
  };

  const pricePerPerson = 200;
  const totalAmount = data.groupSize * pricePerPerson;

  openRazorpay(
    totalAmount,
    data,
    async (paymentResponse) => {
      try {
        // Save participant to Firestore
        const participantId = await saveParticipant({
          ...data,
          paymentId: paymentResponse.razorpay_payment_id,
          amountPaid: totalAmount,
          isUsed: false,
        });

        // Generate Pass & get preview URL
        const passUrl = await generatePass(
          participantId,
          data,
          paymentResponse.razorpay_payment_id,
          totalAmount
        );

        // Open PDF in new tab for preview
        const previewWindow = window.open(passUrl, "_blank");

        // Trigger auto-download after small delay
        const link = document.createElement("a");
        link.href = passUrl;
        link.download = `GarbaPass_${participantId}.pdf`;
        link.click();

        form.reset();
      } catch (err) {
        console.error(err);
      }
    },
    (err) => {
      console.error(err);
    }
  );
};


  return (
    <div className="font-sans text-gray-800">
      <Lighting />
      <header className="bg-[#800000] pb-4 pt-0 shadow-md text-center relative z-10">
        <h1 className="text-4xl text-white pt-0 font-d">Utsav Unlimited</h1>
      </header>

      <div className="bg-[#F8EDEB] text-[#7D5A5A] py-2 font-semibold overflow-hidden relative">
        <div className="whitespace-nowrap animate-marquee font-b">
          <span className="mx-10">⚡ Limited Seats Available! Book Now!</span>
          <span className="mx-10">💃 Group Discount for 5+ Members!</span>
          <span className="mx-10">🎶 Live DJ & Special Performances!</span>
          <span className="mx-10">✨ Hurry! Early Bird Offer Ends Soon!</span>
        </div>
      </div>

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

      <section
        id="booking"
        ref={formRef}
        className="min-h-screen flex justify-center items-center bg-[#F7F5EB] py-10"
      >
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border border-[#E6D5C3]">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A7727D] font-a">
            Book Your Garba Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 font-l">
            {/* form fields same as before */}
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">
                Name
              </label>
              <input type="text" name="name" required className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"/>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">Age</label>
              <input type="number" name="age" required min="5" max="100" className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"/>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">Mobile</label>
              <input type="tel" name="mobile" required className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"/>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">Gender</label>
              <select name="gender" required className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#7D5A5A]">Group Size</label>
              <input type="number" name="groupSize" min="1" max="10" required className="w-full border border-[#E6D5C3] rounded-lg px-4 py-2"/>
            </div>

            <button type="submit" className="w-full bg-[#B5838D] text-white py-3 rounded-lg font-semibold hover:bg-[#6D6875] transition shadow-md">
              Submit Booking
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
