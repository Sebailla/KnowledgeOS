import { mkdir, statfs } from 'node:fs/promises';
const root = process.env.LOCAL_LIBRARY_ROOT ?? '/var/lib/knowledgeos/local-library';
await mkdir(root, { recursive: true });
async function status() {
  const fs = await statfs(root);
  console.log(JSON.stringify({ event: 'local-library.maintenance', root, availableBytes: Number(fs.bavail) * Number(fs.bsize), at: new Date().toISOString() }));
}
await status();
setInterval(() => void status(), 60 * 60 * 1000);
