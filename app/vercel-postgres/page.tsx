import { createData } from "@/lib/data";
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function VercelPostgresPage() {
  unstable_noStore();
  const data = createData();
  const t0 = performance.now();
  await sql`INSERT INTO packages VALUES (${data.name}, ${data.version}, ${data.publishSize}, ${data.installSize}, ${data.publishFiles}, ${data.installFiles})`;
  const t1 = performance.now();
  const delta = t1 - t0;

  return (
    <div>
      <pre>
        <code>INSERT INTO packages VALUES (?, ?, ?, ?, ?, ?)</code>
      </pre>
      <p>Took {delta}ms</p>
    </div>
  );
}
