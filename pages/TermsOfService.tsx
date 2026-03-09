import React from 'react';
import { FileText, CheckCircle, AlertTriangle, ShieldAlert, CreditCard } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Introduction */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  By booking a vehicle with B&MC CAR RENTAL Tacloban, you agree to comply with and be bound by the following terms and conditions. These terms apply to all rentals in Tacloban City, Leyte, and Samar.
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">2. Driver Eligibility</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                  <li>Renters must possess a valid Professional or Non-Professional Driver's License.</li>
                  <li>A valid government-issued ID is required for identity verification.</li>
                  <li>We reserve the right to refuse service to anyone who appears intoxicated or unable to operate a vehicle safely.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Booking & Payment */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <CreditCard size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">3. Booking & Fees</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                  <li>A reservation fee of <strong>₱500</strong> is required to secure your booking. This fee is non-refundable but deductible from the total rental cost.</li>
                  <li>Full payment is expected upon vehicle pickup or delivery.</li>
                  <li>Rental days are calculated on a 24-hour cycle. Exceeding the return time may incur additional hourly charges or a full day's rate.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cancellation */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">4. Cancellation Policy</h2>
                <ul className="list-disc list-inside space-y-3 text-slate-600 text-sm">
                  <li>
                    <strong>Non-Refundable Cancellations:</strong> The reservation fee is non-refundable if the cancellation is made for reasons other than extreme weather conditions, documented health emergencies, or proven flight cancellations.
                  </li>
                  <li>
                    <strong>24-Hour Notice:</strong> Any cancellation made less than 24 hours before the scheduled pickup time for reasons not listed above will result in the total forfeiture of the reservation fee.
                  </li>
                  <li>
                    <strong>Rescheduling:</strong> If you need to change your dates, please contact us immediately. We will do our best to accommodate your new schedule based on vehicle availability.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Liability */}
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">5. Vehicle Use & Liability</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                  <li>The vehicle must strictly be used within the agreed service areas (Leyte and Samar).</li>
                  <li>Illegal activities, transporting prohibited goods, or subleasing the vehicle is strictly prohibited.</li>
                  <li>The renter is responsible for any damage to the vehicle caused by negligence, as well as traffic violations incurred during the rental period.</li>
                  <li>In case of accidents, the renter must notify B&MC CAR RENTAL Tacloban immediately.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Questions? Contact us at <strong>0926 841 6776</strong> or <strong>carrentalbmc@gmail.com</strong></p>
        </div>
      </div>
    </div>
  );
};