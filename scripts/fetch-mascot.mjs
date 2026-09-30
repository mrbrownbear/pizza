import { mkdir, access, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const target = new URL('../public/assets/mascot/pizza-bros-mascot.glb', import.meta.url);

try {
  await access(target, constants.F_OK);
  console.log('Premium Pizza Bros mascot already localized.');
  process.exit(0);
} catch {}

const source = process.env.PIZZA_BROS_MASCOT_URL;
if (!source) {
  console.warn('PIZZA_BROS_MASCOT_URL is not set. Build will continue with the bundled fallback mascot.');
  process.exit(0);
}

await mkdir(new URL('../public/assets/mascot/', import.meta.url), { recursive: true });

try {
  const res = await fetch(source);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = new Uint8Array(await res.arrayBuffer());
  if (data.byteLength < 1000000) throw new Error('Downloaded mascot is unexpectedly small.');
  await writeFile(target, data);
  console.log(`Localized premium Pizza Bros mascot (${(data.byteLength / 1048576).toFixed(1)} MB).`);
} catch (error) {
  console.warn('Premium mascot localization failed. Build continues with the bundled fallback.', error.message);
}
