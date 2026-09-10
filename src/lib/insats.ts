import { z } from 'zod'

export const INSATS_REPORT_URL = 'https://prices.insats.org/report'
export const insatsReportSchema = z.object({
  verifiedEntries: z.number().int().nonnegative().safe(),
  activeMerchants: z.number().int().nonnegative().safe(),
  checkedAt: z.string().datetime(),
  source: z.literal(INSATS_REPORT_URL),
})
export type InsatsReport = z.infer<typeof insatsReportSchema>

export type InsatsPoint = {
  label: string
  kes: number
  sats: number
  kesIndex: number
  satsIndex: number
  basketIndex: number
}

// Insats homepage method demonstration, inspected 2026-09-09. These are
// illustrative source values, never verified observations or current FX quotes.
export const insatsDemonstration = [
  {
    id: 'milk',
    label: 'Milk',
    unit: '500 ml',
    points: [
      [65, 9100, 100, 100, 100],
      [66, 8900, 102, 98, 101],
      [68, 8500, 105, 93, 103],
      [69, 8200, 106, 90, 104],
      [71, 7900, 109, 87, 106],
      [73, 7600, 112, 84, 108],
      [75, 7300, 115, 80, 110],
      [77, 7100, 118, 78, 112],
    ],
  },
  {
    id: 'maize',
    label: 'Maize flour',
    unit: '2 kg',
    points: [
      [205, 28700, 100, 100, 100],
      [207, 27900, 101, 97, 101],
      [211, 26400, 103, 92, 102],
      [216, 25700, 105, 90, 104],
      [218, 24200, 106, 84, 105],
      [222, 23100, 108, 80, 107],
      [226, 22000, 110, 77, 109],
      [229, 21100, 112, 74, 111],
    ],
  },
  {
    id: 'vegetables',
    label: 'Vegetables',
    unit: 'market basket',
    points: [
      [180, 25200, 100, 100, 100],
      [184, 24800, 102, 98, 101],
      [187, 23400, 104, 93, 103],
      [191, 22700, 106, 90, 105],
      [196, 21800, 109, 87, 107],
      [200, 20800, 111, 83, 109],
      [204, 19900, 113, 79, 111],
      [209, 19200, 116, 76, 113],
    ],
  },
].map((product) => ({
  ...product,
  points: product.points.map(
    ([kes, sats, kesIndex, satsIndex, basketIndex], index): InsatsPoint => ({
      label: `W${index + 1}`,
      kes,
      sats,
      kesIndex,
      satsIndex,
      basketIndex,
    }),
  ),
}))
