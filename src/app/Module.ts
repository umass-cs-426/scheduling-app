import type { Express } from "express";

export interface AppModule {
  register(app: Express): void;
}
