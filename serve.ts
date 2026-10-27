import app from "./src/app.ts";
import { APP_PORT, APP_NAME } from "./src/configs/env.config.ts";

app.listen(APP_PORT, () => {
	console.log(`${APP_NAME} is running on port ${APP_PORT}`);
});
