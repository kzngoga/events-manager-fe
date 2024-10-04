import { http, HttpResponse } from "msw";
import { db } from "./db";

export const apiUrl = process.env.VITE_API_URL;

export const handlers = [
  //   ...db.event.toHandlers("rest"),
  http.post(`${apiUrl}/events/new`, () => {
    // Create a new entity for the "post" model.
    const newPost = db.event.create();

    // Respond with a mocked response.
    return HttpResponse.json(newPost, { status: 201 });
  }),
  http.get(`${apiUrl}/events/all`, () => {
    const allEvents = db.event.getAll();

    // Respond with a mocked response.
    return HttpResponse.json({ data: allEvents }, { status: 200 });
  }),
  http.put(`${apiUrl}/events/update/:id`, ({ params, request }) => {
    const updated = db.event.update({
      where: { id: { equals: params?.id as string } },
      data: request.body as never,
    });

    // Respond with a mocked response.
    return HttpResponse.json(updated, { status: 201 });
  }),
  http.delete(`${apiUrl}/events/delete/:id`, ({ params }) => {
    db.event.delete({
      where: { id: { equals: params?.id as string } },
    });

    // Respond with a mocked response.
    return HttpResponse.json({ status: 201 });
  }),
];
