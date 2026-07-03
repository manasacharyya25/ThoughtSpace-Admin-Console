export type PexelsPhotoResult = {
  id: number;
  alt: string;
  photographer: string;
  previewUrl: string;
  imageUrl: string;
  credit: string;
  creditUrl: string;
};

export type PexelsSearchResponse = {
  photos: PexelsPhotoResult[];
  page: number;
  totalResults: number;
  hasMore: boolean;
};

type PexelsApiPhoto = {
  id: number;
  alt: string;
  photographer: string;
  photographer_url: string;
  url: string;
  src: {
    medium?: string;
    large?: string;
    large2x?: string;
  };
};

type PexelsApiSearchResponse = {
  page: number;
  per_page: number;
  total_results: number;
  photos: PexelsApiPhoto[];
};

export function mapPexelsPhoto(photo: PexelsApiPhoto): PexelsPhotoResult {
  const imageUrl =
    photo.src.large2x ?? photo.src.large ?? photo.src.medium ?? photo.url;

  const photographer = photo.photographer?.trim() || "Unknown";

  return {
    id: photo.id,
    alt: photo.alt?.trim() || photographer,
    photographer,
    previewUrl: photo.src.medium ?? photo.src.large ?? imageUrl,
    imageUrl,
    credit: photographer,
    creditUrl: photo.photographer_url,
  };
}

export async function searchPexelsPhotos(
  apiKey: string,
  query: string,
  page = 1
): Promise<PexelsSearchResponse> {
  const params = new URLSearchParams({
    query: query.trim(),
    per_page: "20",
    page: String(page),
    orientation: "landscape",
  });

  const response = await fetch(
    `https://api.pexels.com/v1/search?${params.toString()}`,
    {
      headers: { Authorization: apiKey },
      next: { revalidate: 0 },
    }
  );

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Invalid Pexels API key"
        : `Pexels search failed (${response.status})`;
    throw new Error(message);
  }

  const data = (await response.json()) as PexelsApiSearchResponse;

  return {
    photos: data.photos.map(mapPexelsPhoto),
    page: data.page,
    totalResults: data.total_results,
    hasMore: data.page * data.per_page < data.total_results,
  };
}
