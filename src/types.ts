export type Stat = { label: string; value: string };

export type VideoProps = {
  ticker: string;
  companyName: string;
  hook: string;
  currency: string;
  prices: number[];
  periodLabel: string;
  stats: Stat[];
  takeaways: string[];
  cta: string;
  disclaimer: string;
};
