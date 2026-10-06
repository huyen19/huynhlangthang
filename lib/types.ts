export interface ItineraryDay {
  day: string;
  items: string[];
}

export interface Tour {
  slug: string;
  name: string;
  tag: string;
  duration: string;
  difficulty: string;
  price: string;
  shortDesc: string;
  image: string;
  gallery: string[];
  introTitle: string;
  introText: string;
  leaderTip: string;
  priceNote: string;
  itinerary: ItineraryDay[];
}

export interface CharityEvent {
  date: string;
  title: string;
  images: string[];
  text: string;
  result: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sold: number;
  category: string;
  colors: string[];
  image: string;
}

export interface Category {
  name: string;
  code: string;
}
