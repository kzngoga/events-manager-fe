import { convertDateForInput, convertDateForTable } from "../../helpers/date";
import {} from "vitest";

describe("convertDateForInput()", () => {
  const validDateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  it("Should receive a timestamp & return a date with YYYY-MM-dd format", () => {
    const dateString = "2022-05-14";
    const timestamp = new Date(dateString).getTime();
    const result = convertDateForInput(timestamp);

    expect(result).toBe(dateString);
  });

  it("Should return an invalid date when invalid timestamp is passed", () => {
    const timestamp = Number.MAX_SAFE_INTEGER;
    const result = convertDateForInput(timestamp);

    expect(result).not.toMatch(validDateRegex);
  });
});

describe("convertDateForTable()", () => {
  const validDateRegex = /^([1-9]|[12]\d|3[01])\/([1-9]|1[0-2])\/(\d{4})$/;

  it("Should receive a timestamp & return a date with d/M/YYYY format", () => {
    const dateString = "2022-05-14";
    const timestamp = new Date(dateString).getTime();

    const result = convertDateForTable(timestamp);

    expect(result).toBe("14/5/2022");
  });

  it("Should return an invalid date when invalid timestamp is passed", () => {
    const timestamp = Number.MAX_SAFE_INTEGER;

    const result = convertDateForTable(timestamp);

    expect(result).not.toMatch(validDateRegex);
  });
});
