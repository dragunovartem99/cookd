import { describe, expect, it } from "vitest";

import { fitWithin, MAX_SIDE } from "./image";

describe("fitWithin", () => {
	it("leaves a small photo alone", () => {
		expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
	});

	it("shrinks a landscape photo to the limit, keeping its shape", () => {
		expect(fitWithin(4000, 3000)).toEqual({ width: MAX_SIDE, height: 1125 });
	});

	it("shrinks a portrait photo by its longer side", () => {
		expect(fitWithin(3000, 4000)).toEqual({ width: 1125, height: MAX_SIDE });
	});

	it("takes another limit", () => {
		expect(fitWithin(200, 100, 100)).toEqual({ width: 100, height: 50 });
	});
});
