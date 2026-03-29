import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
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
    tags: [
      {
        name: "Auth",
        description:
          "User authentication, sessions, and security (including 2FA)",
      },
      {
        name: "Finance",
        description:
          "Wallet management, wallet-to-wallet transactions, and financial settings",
      },
      {
        name: "Payroll",
        description:
          "Employee management, timesheets, time-off requests, and expense tracking",
      },
      {
        name: "General",
        description:
          "General endpoints like Dashboard, Company, and KYB status",
      },
    ],
  },

  apis: ["./src/app/api/**/*.ts", "./src/server/validations/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
