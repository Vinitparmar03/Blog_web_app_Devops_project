import { PrismaClient } from "@prisma/client";
import { dbQueryDuration } from "./metrics";

const prismaClient = new PrismaClient();

export const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = process.hrtime.bigint();

        try {
          return await query(args);
        } finally {
          const end = process.hrtime.bigint();

          const duration =
            Number(end - start) / 1_000_000_000;

          dbQueryDuration
            .labels(model ?? "unknown", operation)
            .observe(duration);
        }
      },
    },
  },
});

export default prisma;
