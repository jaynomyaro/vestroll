import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSwaggerSpec } from "../src/server/swagger-config";

async function generateSwaggerJson() {
  const outputPath = path.join(process.cwd(), "public", "swagger.json");
  const swaggerSpec = createSwaggerSpec();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(swaggerSpec, null, 2)}\n`, "utf8");

  console.log(`Generated Swagger spec at ${outputPath}`);
}

generateSwaggerJson().catch((error) => {
  console.error("Failed to generate Swagger spec.", error);
  process.exitCode = 1;
});
