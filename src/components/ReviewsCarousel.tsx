import { getGoogleReviews } from '@/app/actions/get-reviews';
import ReviewsCarouselClient from './ReviewsCarouselClient';

export default async function ReviewsCarousel() {
  const data = await getGoogleReviews();

  // Graceful degradation: render nothing if no API key or fetch failed
  if (!data || data.reviews.length === 0) {
    return null;
  }

  return (
    <ReviewsCarouselClient
      reviews={data.reviews}
      averageRating={data.averageRating}
      totalRatings={data.totalRatings}
    />
  );
}
