import { createData } from "@/lib/data";
import { kv } from "@vercel/kv";
import { unstable_noStore } from "next/cache";

export async function VercelKv() {
  unstable_noStore();
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
