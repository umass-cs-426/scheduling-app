import request from "supertest";
import AppBuilder from "../AppBuilder";


describe("Scheduling API (integration)", () => {
    const app = AppBuilder.build().getExpress();

    beforeEach(async () => {
        // Reset database before each test
        // We made this accessible as a route for testing purposes only.
        await request(app).post("/api/reset").expect(200);
    });

    test("create event, submit availability, list availability, data survives across requests", async () => {
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

        // 2) Submit availability
        const availRes = await request(app)
            .post(`/api/events/${eventId}/availability`)
            .send({
                userId: "alice",
                availableStart: "2026-02-01T14:30:00.000Z",
                availableEnd: "2026-02-01T15:15:00.000Z",
                note: "Prefer earlier"
            })
            .expect(200);

        expect(availRes.body.eventId).toBe(eventId);
        expect(availRes.body.userId).toBe("alice");

        // 3) List availability
        const listRes = await request(app).get(`/api/events/${eventId}/availability`).expect(200);

        expect(listRes.body.event.id).toBe(eventId);
        expect(Array.isArray(listRes.body.availability)).toBe(true);
        expect(listRes.body.availability.length).toBe(1);

        // This is the key class 1 claim: state survived across independent HTTP requests.
        expect(listRes.body.availability[0].userId).toBe("alice");
    });

    test("unknown event returns 404", async () => {
        const res = await request(AppBuilder.build().getExpress()).get("/api/events/does-not-exist/availability").expect(404);
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
