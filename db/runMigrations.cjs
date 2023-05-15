const { execSync } = require("child_process");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("pgtypedconfig.json"));

// Construct the connection string
const connectionString = `postgres://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.dbName}`;

// Run the migrations command with the connection string
execSync(
  `pg-migrations apply --database ${connectionString} --directory migrations`,
  {
    stdio: "inherit",
  }
);
