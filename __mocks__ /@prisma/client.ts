let instanceCount = 0;

export class PrismaClient {
  constructor() {
    instanceCount++;
  }

  static getInstanceCount() {
    return instanceCount;
  }

  $connect() {
    return Promise.resolve();
  }

  $disconnect() {
    return Promise.resolve();
  }
}

export const getInstanceCount = () => instanceCount;
