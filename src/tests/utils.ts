import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { apiUrl } from "./mocks/handlers";

export const simulatePostError = (path: string) => {
  server.use(http.post(`${apiUrl}/${path}`, () => HttpResponse.error()));
};

export const simulateGetError = (path: string) => {
  server.use(http.get(`${apiUrl}/${path}`, () => HttpResponse.error()));
};
