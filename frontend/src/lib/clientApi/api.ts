import { client } from './client';

export type TSignInDto = {
  username: string;
  password: string;
};

export type TSignUpDto = {
  username: string;
  password: string;
};

export type TFindMoviesDto = {
  query: string;
  page?: number;
};

export type TGetMovieByIdDto = {
  id: number;
};

export type TWatchMovieParamsDto = {
  id: number;
};

export type TWatchMovieBodyDto = {
  rating?: number | null;
};

export type TGetUserMoviesQueryDto = {
  page?: number;
  limit?: number;
};

export type TGetSessionsQueryDto = {
  page?: number;
  limit?: number;
};

export type TDeleteSessionByIdParamsDto = {
  sessionId: string;
};

export type TPaginatedResponse<Item> = {
  meta: {
    page: number;
    totalItems: number;
    totalPages: number;
  };
  data: Item[];
};

export type TResponse<Data> = {
  data: Data;
};

export type TUserResponse = TResponse<{
  username: string;
  id: string;
  sessionId: string;
}>;

export type TUserMovie = {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
  releaseDate: string | null;
  userWatchedAt: string;
  userRating: number | null;
};

export type TUserMoviesReponse = TPaginatedResponse<TUserMovie>;

export type TDetailedMovie = {
  id: number;
  budget: number;
  originalLanguage: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  revenue: number;
  runtime: number;
  status: string;
  title: string;
  tagline: string;
  genres: string[];
  userWatchedAt: string | null;
  userRating: number | null;
};

export type TGetMovieByIdResponse = TResponse<TDetailedMovie>;

export type TSearchMovie = {
  id: number;
  userRating: number | null;
  userWatchedAt: string | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
  title: string;
};

export type TFindMovieResponse = TPaginatedResponse<TSearchMovie>;

const stringifyQuery = (params: Record<string, string | number | boolean>) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlParams.append(key, String(value));
  });

  return urlParams.toString();
};

export const clientApi = {
  auth: {
    signIn: (body: TSignInDto) =>
      client.post('/auth/sign-in', body).then((r) => r.data),
    signUp: (body: TSignUpDto) =>
      client.post('/auth/sign-up', body).then((r) => r.data),
    refresh: () => client.post(`/auth/refresh`).then((r) => r.data),
    signOut: () => client.post(`/auth/sign-out`).then((r) => r.data),
    me: () => client.get<TUserResponse>(`/auth/me`).then((r) => r.data),
  },
  movies: {
    find: (query: TFindMoviesDto) =>
      client
        .get<TFindMovieResponse>(`/movies?${stringifyQuery(query)}`)
        .then((r) => r.data),
    getById: (params: TGetMovieByIdDto) =>
      client
        .get<TGetMovieByIdResponse>(`/movies/${params.id}`)
        .then((r) => r.data),
    watch: (params: TWatchMovieParamsDto, body: TWatchMovieBodyDto) =>
      client.post(`/movies/${params.id}/watch`, body).then((r) => r.data),
    unwatch: (params: TWatchMovieParamsDto) =>
      client.delete(`/movies/${params.id}/watch`).then((r) => r.data),
    getUserMovies: (query: TGetUserMoviesQueryDto) =>
      client
        .get<TUserMoviesReponse>(`/movies/my?${stringifyQuery(query)}`)
        .then((r) => r.data),
  },
  sessions: {
    get: (query: TGetSessionsQueryDto) =>
      client.get(`/sessions?${stringifyQuery(query)}`).then((r) => r.data),
    deleteById: (params: TDeleteSessionByIdParamsDto) =>
      client.delete(`/sessions/${params.sessionId}`).then((r) => r.data),
    deleteAll: () => client.delete(`/sessions`).then((r) => r.data),
  },
};
