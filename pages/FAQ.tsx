import React from 'react';
import { HelpCircle, Phone } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "1. What are the requirements to rent a car?",
      answer: (
        <>
          To rent from B&MC CAR RENTAL Tacloban, you must be at least 17 years old and provide:
          <ul className="list-disc list-inside mt-2 ml-1 text-slate-700">
            <li>A valid Driver’s License.</li>
            <li>One (1) valid ID.</li>
          </ul>
        </>
      )
    },
    {
      question: "2. Is there a security deposit?",
      answer: "No. We do not require a security deposit to rent our vehicles."
    },
    {
      question: "3. What is your fuel policy?",
      answer: "We follow a \"Full-to-Full\" policy. The vehicle will be released to you with a full tank, and it must be returned with a full tank. If returned with less fuel, a refueling fee will apply."
    },
    {
      question: "4. What is your Cancellation Policy?",
      answer: "The reservation fee is non-refundable unless the cancellation is due to extreme weather, documented health emergencies, or proven flight cancellations. Cancellations for other reasons made less than 24 hours before your schedule will forfeit the fee."
    },
    {
      question: "5. Can I reschedule my booking?",
      answer: "Yes, as long as a vehicle is available for your new dates. Please contact us at 0926 841 6776 as soon as possible to request a change."
    },
    {
      question: "6. Do you offer Self-Drive or Chauffeur services?",
      answer: "We offer both! You can choose the freedom of Self-Drive or hire one of our professional Chauffeurs if you’d prefer to sit back and relax."
    },
    {
      question: "7. Are there mileage limits?",
      answer: "No. We do not have mileage limits, so you are free to drive as much as you need during your rental period."
    },
    {
      question: "8. What happens if I have an accident or the car breaks down?",
      answer: "Your safety is our priority. In case of an emergency, contact our 24/7 support line immediately at 0926 841 6776. Do not attempt to repair the vehicle yourself or negotiate a private settlement with third parties without informing us first."
    },
    {
      question: "9. Can I bring pets or smoke inside the car?",
      answer: "To keep our fleet fresh for all clients, smoking is strictly prohibited inside the vehicle. Small pets are allowed but must be in a carrier; otherwise, a professional cleaning fee may apply upon return."
    },
    {
      question: "10. Do you offer airport pickup/drop-off?",
      answer: "Yes! We can arrange for the vehicle to be delivered or picked up at the Daniel Z. Romualdez (Tacloban) Airport. Please let us know your flight details in advance."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">Everything you need to know about renting with B&MC CAR RENTAL Tacloban.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                 <HelpCircle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                 {faq.question}
              </h3>
              <div className="text-slate-600 leading-relaxed pl-8">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a href="tel:09268416776" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                <Phone size={20} />
                Call us at 0926 841 6776
            </a>
        </div>
      </div>
    </div>
  );
};