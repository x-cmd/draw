import { writeFileSync } from 'node:fs';
import { renderArchFromUrl } from './src/render/arch.js';

const Q = 'n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network';

const u = new URL(`https://x-cmd.com/draw/arch2?${Q}`);
const { svg } = renderArchFromUrl(u, false, undefined, {});
writeFileSync(process.env.OUT ?? '/tmp/home-nosbus.svg', svg);
console.log('viewBox', /viewBox="([^"]+)"/.exec(svg)?.[1]);
