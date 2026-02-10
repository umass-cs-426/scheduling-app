import { AppRouter } from "./app/router";
import SchedulingModule from "./modules/scheduling/SchedulingModule";

// A factory function to build the app.
//
// This is the only place in the app where we have to know about the 
// implementation of the repo. This is the only place where we have to change
// if we want to switch the repo or service implementation.
//
// This is a common pattern in code called dependency injection or inversion of control, which 
// makes the code more testable.
export default class AppBuilder {
    static build(): AppRouter {
        const schedulingModule = SchedulingModule.build();
        return new AppRouter({ modules: [schedulingModule] });
    }
}
