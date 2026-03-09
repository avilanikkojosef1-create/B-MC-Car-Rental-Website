import { Car } from './types';

// ==========================================
// HOW TO UPDATE CAR IMAGES:
// 1. Upload your photo to a hosting site (Imgur, AWS, etc).
// 2. Copy the direct image link (starts with http/https).
// 3. Paste the link into the 'imageUrl' field below.
//
// NOTE FOR GOOGLE DRIVE:
// Ensure the file is shared as "Anyone with the link".
// Use the ID format: https://lh3.googleusercontent.com/d/YOUR_FILE_ID
// ==========================================

export const CAR_FLEET: Car[] = [
  {
    id: 'wigo-at',
    name: 'Toyota Wigo',
    imageUrl: 'https://lh3.googleusercontent.com/d/1fpFh95hx19jaiWIWkcmyoBFCsbEmRNIv', 
    category: 'Hatchback',
    pricePerDay: 1488,
    excessHourRate: 200,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Fuel Efficient', 'Compact'],
    carWashFee: 200
  },
  {
    id: 'vios-mt',
    name: 'Toyota Vios (Manual)',
    imageUrl: 'https://lh3.googleusercontent.com/d/1986tcnqcPDwwWw2cuqkSS4_-9gvmfqPv',
    category: 'Sedan',
    pricePerDay: 1688,
    excessHourRate: 200,
    seats: 5,
    transmission: 'Manual',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Economical', 'Classic Sedan'],
    carWashFee: 200
  },
  {
    id: 'vios-at',
    name: 'Toyota Vios (Automatic)',
    imageUrl: 'https://lh3.googleusercontent.com/d/1NSOqYlUkAWsWGBnA13Bq5QlTERw0HCVE',
    category: 'Sedan',
    pricePerDay: 1688,
    excessHourRate: 200,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025/2026 Model', 'Comfort', 'Bluetooth'],
    carWashFee: 200
  },
  {
    id: 'rush-at',
    name: 'Toyota Rush',
    imageUrl: 'https://lh3.googleusercontent.com/d/1HLDxcZc8m9gIuax2mPlC1TFZbrwKWcFy',
    category: 'Compact SUV',
    pricePerDay: 2488,
    excessHourRate: 300,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2019 Model', 'High Ground Clearance', '7 Seater'],
    carWashFee: 250
  },
  {
    id: 'livina-at',
    name: 'Nissan Livina',
    imageUrl: 'https://lh3.googleusercontent.com/d/1nzLfAtMQb5_iYILq1Pu4tc1NOZFf5-LJ',
    category: 'MPV',
    pricePerDay: 2488,
    excessHourRate: 250,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Family Friendly', 'Stylish'],
    carWashFee: 250
  },
  {
    id: 'avanza-at',
    name: 'Toyota Avanza',
    imageUrl: 'https://lh3.googleusercontent.com/d/1qiT_c3E6JWD0SyihoKUWOPDY5axiaHQL',
    category: 'MPV',
    pricePerDay: 2488,
    excessHourRate: 250,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Versatile', 'Reliable'],
    carWashFee: 250
  },
  {
    id: 'xpander-at',
    name: 'Mitsubishi Xpander',
    // Updated
    imageUrl: 'https://lh3.googleusercontent.com/d/1955hgvX70kKXwqiqFSmZ_bAPxcOX4FZz',
    category: 'MPV',
    pricePerDay: 2488,
    excessHourRate: 250,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Spacious', 'Modern Design'],
    carWashFee: 250
  },
  {
    id: 'innova-at',
    name: 'Toyota Innova',
    imageUrl: 'https://lh3.googleusercontent.com/d/11zgskbquS5q_XIwBETJ96nIBiD1bp7zA',
    category: 'MPV',
    pricePerDay: 2888,
    excessHourRate: 250,
    seats: "7-8",
    transmission: 'Automatic',
    fuelType: 'Unleaded',
    features: ['2025 Model', 'Premium Comfort', 'Dual AC'],
    carWashFee: 300
  },
  {
    id: 'montero-at',
    name: 'Mitsubishi Montero',
    imageUrl: 'https://lh3.googleusercontent.com/d/15Q9xM1lEGwn9sPiTf1kOjbYXVCRX-Wem',
    category: 'SUV',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: "7-8",
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Powerful', 'Luxury Interior'],
    carWashFee: 300
  },
  {
    id: 'terra-at',
    name: 'Nissan Terra',
    imageUrl: 'https://lh3.googleusercontent.com/d/1fgyp3QKnrJrv6vG57tG5nbaSujoDbS1k',
    category: 'SUV',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: "7-8",
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Intelligent Mobility', 'Off-road Ready'],
    carWashFee: 300
  },
  {
    id: 'urvan-mt',
    name: 'Nissan Urvan',
    imageUrl: 'https://lh3.googleusercontent.com/d/1h-GiuOD6ttkaVmLWWDpblnXT_MfOoFpb',
    category: 'Van',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: 15,
    transmission: 'Manual',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Group Travel', 'Strong AC'],
    carWashFee: 300
  },
  {
    id: 'triton-at',
    name: 'Mitsubishi Triton',
    imageUrl: 'https://lh3.googleusercontent.com/d/1HyJJXZjUQtmAYC2AXscgk1qkGzDon97J',
    category: 'Pickup',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: "5-6",
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Cargo Bed', '4x4 Capable'],
    carWashFee: 300
  },
  {
    id: 'navarra-at',
    name: 'Nissan Navarra',
    imageUrl: 'https://lh3.googleusercontent.com/d/1JLO6WZz9Wnwc0zGLXUEe41YxMdpq839k',
    category: 'Pickup',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: "5-6",
    transmission: 'Automatic',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Smart Ride', 'Tough'],
    carWashFee: 300
  },
  {
    id: 'l300-mt',
    name: 'Mitsubishi L300',
    imageUrl: 'https://lh3.googleusercontent.com/d/1HQC_muQfJv1ha_ZeajxiYQzKQZvaS_S9',
    category: 'L300',
    pricePerDay: 3488,
    excessHourRate: 300,
    seats: "11-17",
    transmission: 'Manual',
    fuelType: 'Diesel',
    features: ['2025 Model', 'Heavy Duty', 'Maximum Capacity'],
    carWashFee: 300
  }
];

export const APP_NAME = "B&MC CAR RENTAL Tacloban";