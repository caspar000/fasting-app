# Fasting zones: research notes

The zones in `src/core/constants/zones.ts` come from this file. It covers water fasting in healthy adults from 0 to 120 hours. The DOIs were checked against Crossref in October 2026.

The old zones put Ketosis at 14h and Deep Ketosis at 18h. Human data doesn't support that: blood beta-hydroxybutyrate (BHB) reaches the usual 0.5 mmol/L ketosis threshold at about 40 to 48h.

## Zones used in the app

| Zone | Starts | Soft edge | Basis |
|---|---|---|---|
| Fed | 0h | 0 to 5h | The meal is still being absorbed and liver glycogen is rising (Taylor 1996) |
| Early Fast | 5h | 4 to 6h | Liver glycogen peaks and starts falling, and insulin drops |
| Fat Mobilization | 12h | 12 to 18h | Fat release from fat tissue rises fastest between 12 and 24h, and most of the insulin drop happens by 24h (Klein 1993) |
| Ketones Rising | 24h | 20 to 30h | Gluconeogenesis supplies 67% of glucose at 22h and 93% at 42h (Landau 1996). BHB climbs from about 0.1 toward 0.4 |
| Ketosis | 40h | 32 to 48h | BHB is 0.39 at about 38h and 1.64 at about 62h, so 0.5 is crossed at about 40 to 48h (Cahill 1966) |
| Deep Ketosis | 64h | 56 to 72h | BHB is about 1.5 or higher, RER is 0.72 at 72h, glucagon peaks on day 3 and insulin levels off |

The ring's color stops at the 120h value, the length of the longest protocol.

## Timeline

| Hours | What happens | Evidence | Source |
|---|---|---|---|
| 0 to ~5h | The meal is absorbed. Liver glycogen peaks about 5.3h after a mixed meal | Human, controlled | Taylor 1996 |
| ~5 to 12h | Insulin falls. Glucose comes from liver glycogen plus gluconeogenesis. RER is 0.80 at 12h, a mix of carbohydrate and fat | Human, controlled | Webber & Macdonald 1994 |
| 12 to 24h | Fat release speeds up. 60% of the rise in lipolysis between 12h and 72h happens between 12h and 24h. 70% of the insulin drop happens within 24h | Human tracer study, n=6 | Klein 1993 |
| 14 to 42h | Gluconeogenesis takes over glucose production: 47% at 14h, 67% at 22h, 93% at 42h | Human isotope and MR studies | Landau 1996, Rothman 1991 |
| ~24 to 48h | Liver glycogen is largely used up. Timing depends on prior carbohydrate intake and exercise. Anton puts the "metabolic switch" at 12 to 36h | Human biopsy study, review | Nilsson & Hultman 1973, Anton 2018 |
| 36 to 72h | RER falls from 0.80 (12h) to 0.76 (36h) to 0.72 (72h), so fat becomes the main fuel. Resting metabolic rate rises at 36h | Human, controlled, n=29 | Webber & Macdonald 1994 |
| Ketones | BHB is 0.02 to 0.07 mmol/L after an overnight fast, 0.39 at ~38h, 1.64 at ~62h, 2.24 at ~86h, 2.87 at ~110h and about 4.0 on day 6. No clean human value exists for 16h or 24h; interpolation gives 0.1 to 0.3 | Human, small n | Cahill 1966, Kolnes 2025 |
| 24 to 48h | Growth hormone rises about 5-fold over a 2-day fast, while IGF-I falls | Human, men only, n of 6 to 9 | Ho 1988, Hartman 1992 |
| Up to ~72h | Glucagon roughly doubles and peaks on day 3. Insulin settles at about 8 µU/ml from day 3 | Human, controlled | Marliss 1970, Cahill 1966 |
| 24 to 84h | Noradrenaline about doubles by day 4. Resting energy use rises about 14% from day 1 to day 3 | Human, n=11 | Zauner 2000 |
| 72h and later | The blood proteome changes broadly only after about 3 days | Human, n=12 | Pietzner 2024 |
| 72 to 120h | Protein sparing starts but is far from complete. The brain runs mostly on ketones only after weeks. Over 7 days, 13 adults lost 4.6 kg lean mass (including water and glycogen) and 1.4 kg fat | Human | Cahill 2006, Owen 1967, Kolnes 2025 |

## Names left out on purpose

- **Autophagy.** The popular 16h, 24h and 48h figures come from mouse and yeast work. Human data is limited to markers in muscle or blood, such as a roughly 30% rise in muscle LC3B-II after 72h in 8 people (Vendelbo 2014). A mouse loses a large share of its body weight in 48h, so mouse hours don't carry over.
- **Fat Burn at 4h.** The body burns fat all the time, and RER is still 0.80 at 12h. The rise in fat release starts around 12h.
- **Ketosis before about 40h.** BHB is around 0.1 mmol/L at 12 to 18h.
- **Growth hormone boost.** The rise is real, but IGF-I falls, so it shouldn't suggest muscle gain.
- **Immune reset, stem cells, detox.** Mouse-only or no support.
- **A zone at 96h.** Nothing new starts there; BHB just keeps climbing.

## Caveats

- Boundaries shift by about ±12h or more. Prior low-carb eating moves everything earlier, and exercise during the fast uses up glycogen faster.
- Most hour-level data comes from groups of 6 to 29 people, often young men.
- Cahill 1966 sampled once a day, so its hours are approximate. Finger-stick ketone meters also disagree with lab assays.
- Several findings (Rothman, Landau, Klein, Ho, Marliss, Zauner, Webber) were taken from abstracts. The Cahill 1966 and Kolnes 2025 figures come from the full papers.
- For people with diabetes or on insulin or sulfonylureas, these timelines and their safety limits are different. The app isn't medical advice.

## Sources

- Taylor 1996. J Clin Invest. [10.1172/JCI118379](https://doi.org/10.1172/JCI118379)
- Webber & Macdonald 1994. Br J Nutr. [10.1079/BJN19940150](https://doi.org/10.1079/BJN19940150)
- Klein 1993. Am J Physiol. [10.1152/ajpendo.1993.265.5.E801](https://doi.org/10.1152/ajpendo.1993.265.5.E801)
- Landau 1996. J Clin Invest. [10.1172/JCI118803](https://doi.org/10.1172/JCI118803)
- Rothman 1991. Science. [10.1126/science.1948033](https://doi.org/10.1126/science.1948033)
- Nilsson & Hultman 1973. Scand J Clin Lab Invest. [10.3109/00365517309084355](https://doi.org/10.3109/00365517309084355)
- Anton 2018. Obesity. [10.1002/oby.22065](https://doi.org/10.1002/oby.22065)
- Cahill 1966. J Clin Invest. [10.1172/JCI105481](https://doi.org/10.1172/JCI105481)
- Kolnes 2025. Nat Commun. [10.1038/s41467-024-55418-0](https://doi.org/10.1038/s41467-024-55418-0)
- Owen 1967. J Clin Invest. [10.1172/JCI105650](https://doi.org/10.1172/JCI105650)
- Ho 1988. J Clin Invest. [10.1172/JCI113450](https://doi.org/10.1172/JCI113450)
- Hartman 1992. J Clin Endocrinol Metab. [10.1210/jcem.74.4.1548337](https://doi.org/10.1210/jcem.74.4.1548337)
- Marliss 1970. J Clin Invest. [10.1172/JCI106445](https://doi.org/10.1172/JCI106445)
- Zauner 2000. Am J Clin Nutr. [10.1093/ajcn/71.6.1511](https://doi.org/10.1093/ajcn/71.6.1511)
- Pietzner 2024. Nat Metab. [10.1038/s42255-024-01008-9](https://doi.org/10.1038/s42255-024-01008-9)
- Cahill 2006. Annu Rev Nutr. [10.1146/annurev.nutr.26.061505.111258](https://doi.org/10.1146/annurev.nutr.26.061505.111258)
- Vendelbo 2014. PLoS One. [10.1371/journal.pone.0102031](https://doi.org/10.1371/journal.pone.0102031)
- Dethlefsen 2018. J Appl Physiol. [10.1152/japplphysiol.01146.2017](https://doi.org/10.1152/japplphysiol.01146.2017)
- Jamshed 2019. Nutrients. [10.3390/nu11061234](https://doi.org/10.3390/nu11061234)
- Alirezaei 2010. Autophagy. [10.4161/auto.6.6.12376](https://doi.org/10.4161/auto.6.6.12376)
- de Cabo & Mattson 2019. N Engl J Med. [10.1056/NEJMra1905136](https://doi.org/10.1056/NEJMra1905136)
- Longo & Mattson 2014. Cell Metab. [10.1016/j.cmet.2013.12.008](https://doi.org/10.1016/j.cmet.2013.12.008)
