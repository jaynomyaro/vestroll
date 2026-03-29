import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createSwaggerSpec } from "@/server/swagger-config";

export async function GET() {
  const swaggerJsonPath = path.join(process.cwd(), "public", "swagger.json");

  try {
    const swaggerJson = await readFile(swaggerJsonPath, "utf8");
    return NextResponse.json(JSON.parse(swaggerJson));
  } catch {
    return NextResponse.json(createSwaggerSpec());
  }
}
