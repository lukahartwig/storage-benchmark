import { sql } from "@vercel/postgres";
import { kv } from "@vercel/kv";
import { Redis } from "ioredis";
import postgres from "postgres";
import { revalidatePath, unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

const pg = postgres(process.env.POSTGRES_URL! + "?sslmode=require");
const redis = new Redis(process.env.KV_URL_TLS!);

async function VercelPostgres() {
  const t0 = performance.now();
  await sql`SELECT 1`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>@vercel/postgres</h2>
      <pre>
        <code>SELECT 1;</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function Postgres() {
  const t0 = performance.now();
  await pg`SELECT 1`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>postgres</h2>
      <pre>
        <code>SELECT 1;</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function VercelKv() {
  const t0 = performance.now();
  await kv.ping();
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>@vercel/kv</h2>
      <pre>
        <code>PING</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}

async function Ioredis() {
  const t0 = performance.now();
  await redis.ping();
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <h2>ioredis</h2>
      <pre>
        <code>PING</code>
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
      <form>
        <button
          formAction={async () => {
            "use server";
            revalidatePath("/");
          }}
        >
          Invalidate
        </button>
      </form>
    </div>
  );
}
