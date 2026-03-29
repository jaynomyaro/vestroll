import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vestroll API Documentation",
      version: "1.0.0",
      description: "API documentation for the Vestroll project",
    },
    servers: [
      {
        url: "/api",
        description: "Standard API base",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    "./src/app/api/**/*.ts",
    "!./src/app/api/**/*.test.ts",
    "!./src/app/api/**/*.spec.ts",
  ],
};

export function createSwaggerSpec() {
  return swaggerJSDoc(swaggerOptions);
}

export const swaggerSpec = createSwaggerSpec();
