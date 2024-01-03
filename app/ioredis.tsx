import { createData } from "@/lib/data";
import { Redis } from "ioredis";
import { unstable_noStore } from "next/cache";

const redis = new Redis(process.env.KV_URL_TLS!);

export async function Ioredis() {
  unstable_noStore();
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
