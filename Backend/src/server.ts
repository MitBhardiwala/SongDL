import app from "./app.js";
import { PORT, DOWNLOAD_DIR } from "./config/env.js";
import fs from "fs";

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});