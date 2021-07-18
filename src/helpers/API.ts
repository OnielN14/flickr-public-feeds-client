import axios from 'axios'

type FeedParams = {
  request_id?: string;
  per_page?: number;
  page?: number;
  tags?: string;
}

export type FeedResultResponse = {
  data: API.Feed.FeedItem[];
  page: number;
  perPage: number;
  total: number;
  totalPage: number;
}

export type FeedResponse = {
  id: string;
  result: FeedResultResponse;
}

export async function fetchFeed(params?: FeedParams) {
  const { data } = await axios.get(`${process.env.REACT_APP_FEED_API}/api/feed`, { params })

  return data as FeedResponse
}