import request from "supertest";
import AppBuilder from "../AppBuilder";


describe("Scheduling API (integration)", () => {
    const app = AppBuilder.build().getExpress();

    beforeEach(async () => {
        // Reset database before each test
        // We made this accessible as a route for testing purposes only.
        await request(app).post("/api/reset").expect(200);
    });

    test("create event, list events, fetch event", async () => {
        // 1) Create event
        const createRes = await request(app)
            .post("/api/events")
            .send({
                title: "Office Hours Planning",
                timezone: "America/New_York",
                startsAt: "2026-02-01T14:00:00.000Z",
                endsAt: "2026-02-01T16:00:00.000Z"
            })
            .expect(201);

        expect(createRes.body.id).toBeDefined();
        const eventId = createRes.body.id as string;

        // 2) List events
        const listRes = await request(app).get("/api/events").expect(200);
        expect(Array.isArray(listRes.body)).toBe(true);

        // 3) Fetch event
        const detailRes = await request(app).get(`/api/events/${eventId}`).expect(200);
        expect(detailRes.body.id).toBe(eventId);
    });

    test("unknown event returns 404", async () => {
        const res = await request(AppBuilder.build().getExpress()).get("/api/events/does-not-exist").expect(404);
        expect(res.body.error.code).toBe("NOT_FOUND");
    });

    test("validation rejects bad time interval", async () => {
        const createRes = await request(AppBuilder.build().getExpress())
            .post("/api/events")
            .send({
                title: "Bad Event",
                timezone: "America/New_York",
                startsAt: "2026-02-01T16:00:00.000Z",
                endsAt: "2026-02-01T14:00:00.000Z"
            })
            .expect(400);

        expect(createRes.body.error.code).toBe("VALIDATION_ERROR");
    });
});
