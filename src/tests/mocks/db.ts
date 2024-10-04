import { faker } from "@faker-js/faker";
import { factory, primaryKey } from "@mswjs/data";

export const db = factory({
  event: {
    id: primaryKey(faker.database.mongodbObjectId),
    name: () =>
      `${faker.music.genre()} ${faker.helpers.arrayElement([
        "Concert",
        "Festival",
        "Show",
      ])}`,
    entranceFee: () =>
      +faker.commerce.price({
        min: 2000,
        max: 10000,
      }),
    location: faker.location.city,
    organiser: faker.company.name,
    eventDate: () => Math.floor(faker.date.soon({ days: 30 }).getTime() / 1000),
  },
});
