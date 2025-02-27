import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchGET(url: string, headers: { Authorization: string } | null = null) {
  try {
    const response = !headers
      ? await fetch(url)
      : await fetch(url, {
        method: "GET",
        headers: headers
      });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return null;
  }
}
