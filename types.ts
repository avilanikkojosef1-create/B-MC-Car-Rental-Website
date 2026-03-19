export interface Car {
  id: string;
  name: string;
  category: 'Hatchback' | 'Sedan' | 'MPV' | 'SUV' | 'Compact SUV' | 'Van' | 'L300' | 'Pickup';
  pricePerDay: number;
  excessHourRate: number;
  seats: number | string;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Unleaded' | 'Diesel';
  imageUrl: string;
  features: string[];
  carWashFee?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  contact_number: string;
  facebook_account?: string;
  pickup_location: string;
  start_date: string;
  duration: string;
  car_type: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  special_requests?: string;
  created_at: string;
}