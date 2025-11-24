type ISODateString = string;

export interface KidsVideoItem {
  _id: string;
  youtubeId: string;
  title: string;
  description: string;
  keyExtractor: string;
  channelTitle: string;
  thumbnail: string;         // URL
  channelThumbnail: string;  // URL
  duration: number;          // milliseconds (e.g., 187000)
  durationSec: number;       // seconds (e.g., 187)
  primaryLanguage: string;   // e.g., "hy"
  languageVideo: string;     // e.g., "hy"
  categoryIds: number[];     // e.g., [2]
  mocAgeIds: number[];       // e.g., [2]
  viewCount: number;
  likeCount: number;
  subscriberCount: number;
  publishedAtVideo: ISODateString; // "2022-01-05T00:30:09Z"
  publishedAt: ISODateString;      // "2025-09-25T08:04:17.497Z"
  randDaily: number;
  randDay: ISODateString;          // "2025-09-25"
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface IKidsVideosResponse {
  hasMore: boolean;
  nextCursor: string;
  items: KidsVideoItem[];
  success: boolean
}

export interface IGetVideoSearchTitleResponse {
  hasMore: boolean;
  nextCursor: string;
  items: KidsVideoItem[];
  success: boolean
}
