import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

const ZONES_KEY = 'wellqr:zones';
const INDEXES_KEY = 'wellqr:indexes';

// GET — read zones and rotation indexes
export async function GET() {
  try {
    const [zones, indexes] = await Promise.all([
      redis.get(ZONES_KEY),
      redis.get(INDEXES_KEY),
    ]);

    return NextResponse.json({
      zones: zones || { top: [], bottom: [], left: [], right: [] },
      indexes: indexes || { top: 0, bottom: 0, left: 0, right: 0 },
    });
  } catch (error) {
    console.error('Redis GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load zones' },
      { status: 500 }
    );
  }
}

// POST — save zones and/or indexes
export async function POST(request) {
  try {
    const body = await request.json();
    const ops = [];

    if (body.zones !== undefined) {
      ops.push(redis.set(ZONES_KEY, body.zones));
    }
    if (body.indexes !== undefined) {
      ops.push(redis.set(INDEXES_KEY, body.indexes));
    }

    await Promise.all(ops);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Redis POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save zones' },
      { status: 500 }
    );
  }
}
