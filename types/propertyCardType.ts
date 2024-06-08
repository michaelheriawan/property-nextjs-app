interface PropertyLocation {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

interface PropertyRates {
  weekly?: number;
  monthly?: number;
  nightly?: number;
}

export interface Property {
  _id: string;
  images: string[]; // Assuming you're taking the first image or handling image selection separately
  type: string;
  name: string;
  rates: PropertyRates;
  beds: number;
  baths: number;
  square_feet: number;
  location: PropertyLocation;
  description: string;
  amenities: string[];
}

export interface PropertyCardProps {
  property: Property;
}
