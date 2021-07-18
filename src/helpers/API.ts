import axios from 'axios'

type FeedParams = {
  request_id?: number;
  per_page?: number;
  page?: number;
  tags?: string;
}

type FeedResponse = {
  id: string;
  result: {
    data: API.Feed.FeedItem[];
    page: number;
    perPage: number;
    total: number;
    totalPage: number;
  }
}

export async function fetchFeed(params?: FeedParams) {
  const { data } = await axios.get(`${process.env.REACT_APP_FEED_API}/api/feed`, { params })

  return data as FeedResponse
}