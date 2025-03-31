import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "../database/database.sqlite");
const INIT_SCRIPT = path.join(__dirname, "../database/init.sql");

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");

        // Load and execute init.sql to ensure tables exist
        const schema = fs.readFileSync(INIT_SCRIPT, "utf8");
        db.exec(schema, (err) => {
            if (err) {
                console.error("Error setting up database schema:", err.message);
            } else {
                console.log("Database schema initialized successfully.");
            }
        });
    }
});

export default db;
