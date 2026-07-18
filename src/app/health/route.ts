export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({
    status: 'ok',
    service: 'gatepoint',
    timestamp: new Date().toISOString(),
  });
}
