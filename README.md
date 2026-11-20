# Financial Videos (Shorts / Reels)

Data-driven vertical (1080×1920, 25s) finance videos built with [Remotion](https://remotion.dev).
Each video is generated from a single JSON file — swap the data, re-render, publish.

## Scenes
1. **Hook** – ticker badge + attention-grabbing question (3s)
2. **Price action** – animated price chart with live counter and % change (7s)
3. **Key numbers** – stat cards (market cap, P/E, growth…) (6s)
4. **Takeaways** – numbered bullet points (6s)
5. **Call to action** (3s)

A disclaimer stays on screen the whole time.

## Usage
```bash
npm install
npm run studio     # live preview + edit props in the browser
npm run render     # -> out/short.mp4 using data/sample.json
npm run still      # -> out/thumbnail.png
```

Make a new video:
```bash
cp data/sample.json data/tsla.json   # edit the values
npx remotion render FinancialShort out/tsla.mp4 --props=data/tsla.json
```

## Data format (`data/*.json`)
| Field | Description |
|---|---|
| `ticker`, `companyName` | Shown on hook & CTA |
| `hook` | Opening headline |
| `currency` | Prefix for prices, e.g. `$`, `₹` |
| `prices` | Array of closing prices (oldest → newest) |
| `periodLabel` | e.g. "Last 12 months" |
| `stats` | `[{ "label", "value" }]` – 3 recommended |
| `takeaways` | 3 short bullet strings |
| `cta`, `disclaimer` | Closing text |

Scene durations and colours live in `src/theme.ts`.

> `data/sample.json` uses a fictional company — always verify real figures before publishing.
