import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = (globalThis.prismaGlobal ?? prismaClientSingleton()) as PrismaClientType;

export * from '@prisma/client';
export * from './inventory';
export * from './pricing';
export * from './sync';
export * from './orders';
export * from './search';

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
