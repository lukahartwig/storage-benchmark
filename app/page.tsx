import { sql } from "@vercel/postgres";
import { kv } from "@vercel/kv";
import { Redis } from "ioredis";
import { createData } from "@/lib/data";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

const redis = new Redis(process.env.KV_URL_TLS!);

async function VercelPostgres() {
  const data = createData();
  const t0 = performance.now();
  await sql`INSERT INTO packages VALUES (${data.name}, ${data.version}, ${data.publishSize}, ${data.installSize}, ${data.publishFiles}, ${data.installFiles})`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>Vercel Postgres</h2>
      <pre>
        <code>INSERT INTO packages VALUES (?, ?, ?, ?, ?, ?)</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function VercelKv() {
  const data = createData();
  const t0 = performance.now();
  const { name, version, ...payload } = data;
  const value = JSON.stringify(payload);
  await kv.hset(name, { version, value });
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>Vercel KV</h2>
      <pre>
        <code>
          HSET {name} version {version} value {value}
        </code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function Ioredis() {
  const data = createData();
  const t0 = performance.now();
  const { name, version, ...payload } = data;
  const value = JSON.stringify(payload);
  await redis.hset(name, version, value);
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>Vercel KV + ioredis</h2>
      <pre>
        <code>
          HSET {name} version {version} value {value}
        </code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

export default function Home() {
  unstable_noStore();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <VercelPostgres />
      <VercelKv />
      <Ioredis />
    </div>
  );
}
