
import { LandListing } from "@/types/landselling";

// Local storage key
const STORAGE_KEY = "agri-aide-land-listings";

// Save all listings to local storage
export const saveListings = (listings: LandListing[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    console.log(`Saved ${listings.length} listings to local storage`);
  } catch (error) {
    console.error("Error saving listings to local storage:", error);
  }
};

// Get all listings from local storage
export const getListings = (): LandListing[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as LandListing[];
    }
  } catch (error) {
    console.error("Error retrieving listings from local storage:", error);
  }
  return [];
};

// Save a single listing to local storage
export const saveListing = (listing: LandListing): void => {
  try {
    const existingListings = getListings();
    const updatedListings = [...existingListings, listing];
    saveListings(updatedListings);
    console.log(`Listing ${listing.id} saved successfully`);
  } catch (error) {
    console.error("Error saving listing to local storage:", error);
  }
};

// Delete a listing from local storage
export const deleteListing = (listingId: string): void => {
  try {
    const existingListings = getListings();
    const updatedListings = existingListings.filter(
      (listing) => listing.id !== listingId
    );
    saveListings(updatedListings);
    console.log(`Listing ${listingId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting listing from local storage:", error);
  }
};
