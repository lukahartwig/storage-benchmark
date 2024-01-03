import { createData } from "@/lib/data";
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";

export async function VercelPostgres() {
  unstable_noStore();
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
