import AppBuilder from "./AppBuilder";
import { logger } from "./shared/logger";

// The server class is a simple class that starts the server.
class Server {
    static start() {
        const port = Number(process.env.PORT ?? 3000);

        const app = AppBuilder.build().getExpress();

        logger.info(`Database URL: ${process.env.DATABASE_URL}`);

        app.listen(port, () => {
            logger.info(`Listening on http://localhost:${port}`);
        });
    }
}

// This is the main entry point of the application.
Server.start();
