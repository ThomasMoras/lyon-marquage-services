// __tests__/prisma-singleton.test.ts
// Comme on ne peut pas utiliser le vrai PrismaClient dans les tests,
// créons un mock simple pour tester le comportement du singleton

// Mock de PrismaClient
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: class MockPrismaClient {
      constructor() {}
    },
  };
});

describe("PrismaClient singleton", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("should return the same instance when imported multiple times", async () => {
    const { default: prisma1 } = await import("@/lib/prisma");
    const { default: prisma2 } = await import("@/lib/prisma");

    // Si c'est le même objet, ils devraient avoir la même référence en mémoire
    expect(prisma1).toBe(prisma2);
  });

  test("should maintain state across imports", async () => {
    const { default: prisma1 } = await import("@/lib/prisma");

    // Ajouter une propriété de test
    (prisma1 as any)._testProperty = "test value";

    // Importer à nouveau
    const { default: prisma2 } = await import("@/lib/prisma");

    // Vérifier que la propriété existe sur la deuxième référence
    expect((prisma2 as any)._testProperty).toBe("test value");
  });
});
