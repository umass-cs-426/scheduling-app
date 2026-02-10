import type { Express } from "express";
import type { AppModule } from "../../app/Module";
import SchedulingController from "./controller/SchedulingController";
import SchedulingService from "./service/SchedulingService";
import { InMemorySchedulingRepo } from "./repository/InMemorySchedulingRepo";
import SchedulingRoutesBuilder from "./routes/SchedulingRoutesBuilder";

export default class SchedulingModule implements AppModule {
  static build(): SchedulingModule {
    const repo = new InMemorySchedulingRepo();
    const service = new SchedulingService(repo);
    const controller = new SchedulingController(service);
    return new SchedulingModule(controller);
  }

  private constructor(private readonly controller: SchedulingController) {}

  register(app: Express): void {
    app.use("/api", SchedulingRoutesBuilder.build(this.controller));
  }
}
