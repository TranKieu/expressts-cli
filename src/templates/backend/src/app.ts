import "reflect-metadata";
import { ExpressServer } from "./server/express-server";

// Controllers
import { CONTROLLERS } from "./controllers/index";
import { Environment } from "./environment";
import { createConnection } from "typeorm";

// Sử dụng ormconfig.json nên func này để trống
createConnection()
  .then(async (connection) => {
    const server = new ExpressServer(CONTROLLERS);
    server.setup(Environment.getPort());
    handleExit(server);
  })
  .catch((error) => console.log("TypeORM connection error: ", error));

function handleExit(server: ExpressServer) {
  process.on("uncaughtException", (err: Error) => {
    console.error("uncaught Exception", err);
    shutdown(1, server);
  });

  process.on("unhandledRejection", (reason: {} | null | undefined) => {
    console.error("Unhandled Rejection at promise", reason);
    shutdown(2, server);
  });

  process.on("SIGINT", () => {
    console.error("SIGINT");
    shutdown(128 + 2, server);
  });

  process.on("SIGTERM", () => {
    console.error("SIGTERM");
    shutdown(128 + 2, server);
  });

  process.on("exit", () => {
    console.info("Exiting");
  });
}

/** Useful exitCodes
 * 1 - Catchall for general
 * 2 - Misuse of shell builtins (according to Bash documentation)
 * 126 - Command invoked cannot execute
 * 127 - "command not found"
 * 128 - Invalid argument to exit
 * 128+n - Fatal error signal "n"
 * 130 - Script terminated by Control-C
 */
function shutdown(exitCode: number, server: ExpressServer) {
  Promise.resolve()
    .then(() => server.shutdownServer())
    .then(() => {
      console.info("Shutdown complete");
      process.exit(exitCode);
    })
    .catch((err) => {
      console.error("Error during shutdown", err);
      process.exit(1);
    });
}
