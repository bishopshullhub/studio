"use server";

export interface GoogleReview {
  authorName: string;
  authorPhoto: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface PlaceReviewsResult {
  reviews: GoogleReview[];
  averageRating: number;
  totalRatings: number;
}

export async function getGoogleReviews(): Promise<PlaceReviewsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Google Places API error:", res.status);
      return null;
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result) {
      console.error("Google Places API bad status:", data.status);
      return null;
    }

    const result = data.result;
    const reviews: GoogleReview[] = (result.reviews || [])
      .filter((r: { rating: number; text: string }) => r.rating >= 4 && r.text?.trim()) // Only show 4-5 star reviews with text
      .map((r: {
        author_name: string;
        profile_photo_url: string;
        rating: number;
        text: string;
        relative_time_description: string;
      }) => ({
        authorName: r.author_name,
        authorPhoto: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
      }));

    return {
      reviews,
      averageRating: result.rating ?? 0,
      totalRatings: result.user_ratings_total ?? 0,
    };
  } catch (err) {
    console.error("Failed to fetch Google reviews:", err);
    return null;
  }
}
