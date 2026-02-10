import type { Express } from "express";
import type { AppModule } from "../../app/Module";
import SchedulingController from "./controller/SchedulingController";
import SchedulingPageController from "./controller/SchedulingPageController";
import SchedulingService from "./service/SchedulingService";
import { InMemorySchedulingRepo } from "./repository/InMemorySchedulingRepo";
import SchedulingRoutesBuilder from "./routes/SchedulingRoutesBuilder";
import SchedulingUiRoutesBuilder from "./routes/SchedulingUiRoutesBuilder";

export default class SchedulingModule implements AppModule {
  static build(): SchedulingModule {
    const repo = new InMemorySchedulingRepo();
    const service = new SchedulingService(repo);
    const controller = new SchedulingController(service);
    const pageController = new SchedulingPageController(service);
    return new SchedulingModule(controller, pageController);
  }

  private constructor(
    private readonly controller: SchedulingController,
    private readonly pageController: SchedulingPageController
  ) {}

  register(app: Express): void {
    app.use("/api", SchedulingRoutesBuilder.build(this.controller));
    app.use("/", SchedulingUiRoutesBuilder.build(this.pageController));
  }
}
