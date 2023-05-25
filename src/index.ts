import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import app from "./server/app.js";

const debug = createDebug("boulderlab-api:root");

const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  debug(`Listening on ${chalk.green(`http://localhost:${port}`)}`);
});
