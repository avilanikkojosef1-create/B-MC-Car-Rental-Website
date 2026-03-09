import React from 'react';
import { Lock, Eye, Server, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">Your privacy is important to us.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-10">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              When you book a vehicle with B&MC CAR RENTAL Tacloban, we collect personal information necessary to process your reservation and ensure the security of our fleet. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Full Name</li>
              <li>Contact Information (Phone Number, Email Address)</li>
              <li>Government-issued Identification (Driver's License, Passport, etc.)</li>
              <li>Trip Details (Pickup/Dropoff locations, Dates)</li>
            </ul>
          </section>

          <div className="h-px bg-slate-100"></div>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Server className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>To process and confirm your vehicle reservation.</li>
              <li>To communicate with you regarding your booking or any changes.</li>
              <li>To verify your identity and eligibility to drive.</li>
              <li>To ensure the safety and security of our vehicles.</li>
            </ul>
          </section>

          <div className="h-px bg-slate-100"></div>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Data Protection</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We take the security of your personal data seriously. Your information is stored securely and is only accessible to authorized personnel of B&MC CAR RENTAL Tacloban. We do not sell, trade, or rent your personal identification information to others. We may only disclose your information if required by law or to protect our rights and property.
            </p>
          </section>

          <div className="h-px bg-slate-100"></div>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with us, please contact us at:
            </p>
            <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-900">B&MC CAR RENTAL Tacloban</p>
              <p className="text-slate-600">Brgy 74 Nula tula Tacloban City, Tacloban City, Philippines, 6500</p>
              <p className="text-slate-600">Email: carrentalbmc@gmail.com</p>
              <p className="text-slate-600">Phone: 0926 841 6776</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};