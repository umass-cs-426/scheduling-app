import AppBuilder from "./AppBuilder";

// The server class is a simple class that starts the server.
class Server {
    static start() {
        const port = Number(process.env.PORT ?? 3000);

        const app = AppBuilder.build().getExpress();

        console.log(`Database URL: ${process.env.DATABASE_URL}`);

        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`);
        });
    }
}

// This is the main entry point of the application.
Server.start();
