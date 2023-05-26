import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import app from "./server/app.js";
import connectToDatabase from "./database/connectToDatabase.js";

const debug = createDebug("boulderlab-api:root");

const port = process.env.PORT ?? 4000;

const mongoDbConnection = process.env.MONGODB_CONECTION;

if (!mongoDbConnection) {
  debug("missing environment variables");
  process.exit(1);
}

try {
  await connectToDatabase(mongoDbConnection);
  debug("Connected to Database");
} catch (error: unknown) {
  debug(`Error connecting DataBase: ${(error as Error).message}`);
}

app.listen(port, () => {
  debug(`Listening on ${chalk.green(`http://localhost:${port}`)}`);
});
