
export interface LandListing {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: [number, number]; // [latitude, longitude]
}

export const getGoogleMapsUrl = (coords: [number, number]): string => {
  return `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
};
