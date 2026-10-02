// Only reviewed import copies belong here. Nearby businesses with different real
// OSM nodes must never be merged on name or coordinates alone.
export const merchantDuplicatePlan = [
  {
    name: 'Mama Eddy Salon',
    canonicalId: '6b4aeb06-f0b8-4e07-82eb-53553207917a',
    canonicalSlug: 'mama-eddy-salon',
    nodeId: '13003772865',
    duplicateId: '8eff6bff-97ac-4876-8fb1-0eb0d3f7feb5',
    duplicateSlug: 'mama-eddy-salon-1',
  },
  {
    name: 'Night Salon',
    canonicalId: '75166687-b344-46c5-84f3-ae64a4e5ff0d',
    canonicalSlug: 'night-salon-1',
    nodeId: '13003772862',
    duplicateId: 'aff8eb68-7e19-4d49-a1e4-0438f890380b',
    duplicateSlug: 'night-salon',
  },
] as const

export function merchantRedirects() {
  return merchantDuplicatePlan.map(row => ({
    source: `/merchants/${row.duplicateSlug}`,
    destination: `/merchants/${row.canonicalSlug}`,
    permanent: true,
  }))
}
