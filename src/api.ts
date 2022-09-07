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
    await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`)
  ).json();
  return response;
};
