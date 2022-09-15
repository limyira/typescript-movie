const API_KEY = "ed7cc781de8a69497322e6e92a6ad3c8";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: object;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoives {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const getMoives = async () => {
  const response = await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
  return response;
};

export const popularMovie = async () => {
  const response = await (
    await fetch(
      `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=1&region=US`
    )
  ).json();
  return response;
};

export interface ILatestTvResults {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: object;
  id: number;
  name: string;
  origin_country: object;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ILatestTv {
  page: number;
  results: ILatestTvResults[];
  total_pages: number;
  total_results: number;
}

export const LatestTv = async () => {
  const response = await (
    await await fetch(
      "https://api.themoviedb.org/3/tv/top_rated?api_key=ed7cc781de8a69497322e6e92a6ad3c8&language=en-US&page=1"
    )
  ).json();
  return response;
};

export interface IPopularTv {
  page: number;
  results: ILatestTvResults[];
  total_pages: number;
  total_results: number;
}

export const popularTv = async () => {
  const response = await (
    await await fetch(
      "https://api.themoviedb.org/3/tv/popular?api_key=ed7cc781de8a69497322e6e92a6ad3c8&language=en-US&page=1"
    )
  ).json();
  return response;
};

export const MultiSearch = async (keyword: string | number) => {
  const response = await (
    await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=ed7cc781de8a69497322e6e92a6ad3c8&language=en-US&query=${keyword}&page=1&include_adult=false`
    )
  ).json();
  return response;
};
