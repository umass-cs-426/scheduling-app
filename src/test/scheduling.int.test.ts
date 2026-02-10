import { InMemorySchedulingRepo } from "../modules/scheduling/repository/InMemorySchedulingRepo";
import SchedulingService from "../modules/scheduling/service/SchedulingService";


describe("Scheduling API (integration)", () => {
    let service: SchedulingService;

    beforeEach(async () => {
        const repo = new InMemorySchedulingRepo();
        service = new SchedulingService(repo);
    });

    test("create event, list events, fetch event", async () => {
        const createRes = await service.createEvent({
            title: "Office Hours Planning",
            timezone: "America/New_York",
            startsAt: "2026-02-01T14:00:00.000Z",
            endsAt: "2026-02-01T16:00:00.000Z"
        });

        expect(createRes.ok).toBe(true);
        if (!createRes.ok) {
            return;
        }

        const eventId = createRes.value.id;

        const listRes = await service.listEvents();
        expect(listRes.ok).toBe(true);
        if (!listRes.ok) {
            return;
        }

        expect(Array.isArray(listRes.value)).toBe(true);
        expect(listRes.value.length).toBeGreaterThan(0);

        const detailRes = await service.getEvent(eventId);
        expect(detailRes.ok).toBe(true);
        if (!detailRes.ok) {
            return;
        }

        expect(detailRes.value.id).toBe(eventId);
    });

    test("unknown event returns 404", async () => {
        const res = await service.getEvent("does-not-exist");
        expect(res.ok).toBe(false);
        if (!res.ok) {
            expect(res.error.code).toBe("NOT_FOUND");
        }
    });

    test("validation rejects bad time interval", async () => {
        const createRes = await service.createEvent({
            title: "Bad Event",
            timezone: "America/New_York",
            startsAt: "2026-02-01T16:00:00.000Z",
            endsAt: "2026-02-01T14:00:00.000Z"
        });

        expect(createRes.ok).toBe(false);
        if (!createRes.ok) {
            expect(createRes.error.code).toBe("VALIDATION_ERROR");
        }
    });
});
