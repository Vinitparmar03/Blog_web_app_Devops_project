import "server-only";

import client from "prom-client";

const globalForMetrics = globalThis as unknown as {
  prometheusRegistry?: client.Registry;
  articlesCreated?: client.Counter;
  articlesDeleted?: client.Counter;
  dbQueryDuration?: client.Histogram;
};

export const register =
  globalForMetrics.prometheusRegistry ??
  new client.Registry();

if (!globalForMetrics.prometheusRegistry) {
  client.collectDefaultMetrics({
    register,
  });

  globalForMetrics.prometheusRegistry = register;
}

export const articlesCreated =
  globalForMetrics.articlesCreated ??
  new client.Counter({
    name: "nextjs_articles_created_total",
    help: "Total number of articles successfully created",
    registers: [register],
  });

export const articlesDeleted =
  globalForMetrics.articlesDeleted ??
  new client.Counter({
    name: "nextjs_articles_deleted_total",
    help: "Total number of articles successfully deleted",
    registers: [register],
  });

export const dbQueryDuration =
  globalForMetrics.dbQueryDuration ??
  new client.Histogram({
    name: "nextjs_db_query_duration_seconds",
    help: "Duration of Prisma database queries in seconds",
    labelNames: ["model", "operation"],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [register],
  });

globalForMetrics.articlesCreated = articlesCreated;
globalForMetrics.articlesDeleted = articlesDeleted;
globalForMetrics.dbQueryDuration = dbQueryDuration;