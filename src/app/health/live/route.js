export async function GET() {
  return Response.json({
    status: "alive",
    message: "Application is alive",
    timestamp: new Date().toISOString(),
  });
}