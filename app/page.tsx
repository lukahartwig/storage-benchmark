import { sql } from "@vercel/postgres";
import { neonConfig } from "@neondatabase/serverless";
import { kv } from "@vercel/kv";
import { Redis } from "ioredis";
import postgres from "postgres";
import { createData } from "@/lib/data";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

const pg = postgres(process.env.POSTGRES_URL! + "?sslmode=require");
const redis = new Redis(process.env.KV_URL_TLS!, {
  lazyConnect: true,
});

neonConfig.fetchConnectionCache = true;

async function VercelPostgres() {
  const data = createData();
  const t0 = performance.now();
  await sql`INSERT INTO packages VALUES (${data.name + "-vp"}, ${
    data.version
  }, ${data.publishSize}, ${data.installSize}, ${data.publishFiles}, ${
    data.installFiles
  })`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>@vercel/postgres</h2>
      <pre>
        <code>INSERT INTO packages VALUES (?, ?, ?, ?, ?, ?)</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function Postgres() {
  const data = createData();
  const t0 = performance.now();
  await pg`INSERT INTO packages VALUES (${data.name + "-pg"}, ${
    data.version
  }, ${data.publishSize}, ${data.installSize}, ${data.publishFiles}, ${
    data.installFiles
  })`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>postgres</h2>
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
      <h2>@vercel/kv</h2>
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
      <h2>ioredis</h2>
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
      <Postgres />
      <VercelKv />
      <Ioredis />
    </div>
  );
}
