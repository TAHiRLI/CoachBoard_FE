import { dirname, join } from "path";
import { readFile, writeFile } from "fs/promises";

import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get package.json path
const packageJsonPath = join(__dirname, "package.json");

try {
  // Get the latest commit message
  const commitMessage = execSync("git log -1 --pretty=%B").toString().trim();

  // Read package.json
  const packageJsonData = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonData);

  // Split version into parts (major.minor.patch)
  let [major, minor, patch] = packageJson.version.split(".").map(Number);

  // Determine version bump type based on commit message
  if (commitMessage.includes("BREAKING CHANGE")) {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (commitMessage.startsWith("feat:")) {
    minor += 1;
    patch = 0;
  } else if (commitMessage.startsWith("fix:")) {
    patch += 1;
  } else {
    console.log("No version change needed.");
    process.exit(0);
  }

  // Update the version in package.json
  packageJson.version = `${major}.${minor}.${patch}`;

  // Write back to package.json
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf8");

  console.log(`Version updated to: ${packageJson.version}`);

  // Auto-commit the version bump
  execSync(`git add package.json && git commit -m "Bump version to ${packageJson.version}"`, {
    stdio: "inherit",
  });

} catch (error) {
  console.error("Error updating version:", error);
}