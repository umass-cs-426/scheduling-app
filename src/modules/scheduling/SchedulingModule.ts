import type { Express } from "express";
import type { AppModule } from "../../app/Module";
import SchedulingController from "./controller/SchedulingController";
import SchedulingRoutesBuilder from "./routes/SchedulingRoutesBuilder";

export default class SchedulingModule implements AppModule {
  constructor(private readonly controller: SchedulingController) {}

  register(app: Express): void {
    app.use("/api", SchedulingRoutesBuilder.build(this.controller));
  }
}
