import "@testing-library/jest-dom/vitest";
import { server } from "./mocks/server";

beforeAll(() =>
  server.listen({
    onUnhandledRequest(request) {
      console.log("Unhandled %s %s", request.method, request.url);
    },
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
