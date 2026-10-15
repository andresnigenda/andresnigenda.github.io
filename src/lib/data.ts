import { getEntry } from "astro:content";

export async function requiredEntry<Collection extends "experienceData" | "profileData" | "siteData">(
  collection: Collection,
  id: string,
) {
  const entry = await getEntry(collection, id);

  if (!entry) {
    throw new Error(`Missing required data entry: ${collection}/${id}`);
  }

  return entry;
}
