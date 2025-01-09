export function convertRatingToStars(rating: string): string {
  const fullStars = Math.floor(Number(rating));
  const halfStar = Number(rating) % 1 !== 0 ? '½' : '';
  return '★'.repeat(fullStars) + halfStar;
}
