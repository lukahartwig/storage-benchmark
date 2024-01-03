import { VercelPostgres } from "./vercel-postgres";
import { VercelKv } from "./vercel-kv";
import { Ioredis } from "./ioredis";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <VercelPostgres />
      <VercelKv />
      <Ioredis />
    </div>
  );
}
