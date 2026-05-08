# Documentation Hub

This directory is the new home for repository documentation.

The goal is to move away from many root-level markdown files that mix setup notes, redesign logs, implementation reports, and one-off session summaries.

## Sections

- [overview/](overview/) - high-level project and product background
- [setup/](setup/) - local development, environment, and operational setup
- [architecture/](architecture/) - current architecture, data model direction, and implementation plans
- [integrations/](integrations/) - external system documentation such as BTCPay and email
- [reports/](reports/) - audits, test reports, optimization findings, and delivery reports
- [archive/](archive/) - superseded or historical material kept for reference during consolidation

## Immediate Source Of Truth

Use these files first:

- [setup/local-development.md](setup/local-development.md)
- [architecture/current-state.md](architecture/current-state.md)
- [architecture/content-model.md](architecture/content-model.md)
- [architecture/schema-redesign-phase-1.md](architecture/schema-redesign-phase-1.md)
- [integrations/donations.md](integrations/donations.md)

## Consolidation Plan

The existing root markdown files will be reviewed into one of four outcomes:

- keep and move into `docs/`
- merge into a stronger source-of-truth document
- archive for historical reference
- delete if fully replaced

Until that migration is complete, some legacy markdown files will still exist at the repository root.