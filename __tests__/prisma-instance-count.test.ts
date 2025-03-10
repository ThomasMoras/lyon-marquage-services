// Définir un compteur local au lieu d'essayer d'accéder à une fonction exportée
let instanceCount = 0;

// Mock du module @prisma/client
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: class MockPrismaClient {
      constructor() {
        instanceCount++;
      }

      $connect() {
        return Promise.resolve();
      }
      $disconnect() {
        return Promise.resolve();
      }
    },
  };
});

describe("PrismaClient instance count", () => {
  beforeEach(() => {
    jest.resetModules();
    instanceCount = 0;
  });

  test("should create only one instance regardless of imports", async () => {
    // Importer plusieurs fois
    await import("@/lib/prisma");
    await import("@/lib/prisma");
    await import("@/lib/prisma");

    // Vérifier qu'une seule instance a été créée
    expect(instanceCount).toBe(1);
  });
});
