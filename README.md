# FCTR Apparel theme

Shopify theme source imported from FCTR's supplied export:

`theme_export__fctrapparel-com-fctr-feast-models-november-2026__03NOV2026-1239pm.zip`

The export identifies its base theme as **Focal 12.7.1 by Maestrooo**. The original theme files and vendor copyright notices are retained unchanged. This repository does not grant a new license to third-party theme code.

## Branches and Shopify connection

| Branch | Purpose |
| --- | --- |
| `main` | Initial export and reviewed baseline |
| `staging` | Connect the FCTR Apparel Staging store to this branch |

In the **FCTR Apparel Staging** Shopify admin, go to **Online Store → Themes → Add theme / Import theme → Connect from GitHub**. Authorize access to `WTHOMASFCTR/FCTR-Apparel-Staging`, select the `staging` branch, and connect it. Preview the resulting theme before publishing it as the staging store's current theme.

Commits to a connected branch can update the connected Shopify theme. Shopify theme-editor changes can also sync back to that branch. Check the selected store and branch before editing. Connecting a repository, previewing a theme, and publishing a theme are separate actions.

The repository contains extracted theme folders, with `layout/theme.liquid` directly under `layout/`. Do not add the ZIP itself or wrap the folders inside another directory. The CRM application remains in the separate `team-scraper` repository.

## Validation

Initial import checks cover all 184 exported files: safe archive paths, byte-for-byte source preservation, required theme structure, credential-pattern inspection, 51 JSON documents, 78 Liquid schema blocks, 10 JavaScript assets, and literal snippet/asset references.

For further static checks, use the Shopify CLI without changing the source:

```sh
SHOPIFY_CLI_NO_ANALYTICS=1 npm exec --yes --package=@shopify/cli@5.0.0 -- shopify theme check --path .
```

The official Shopify CLI check reports **751 existing errors and 47 warnings**, primarily missing locale translations, plus two legacy schema properties and one image-dimension issue. See [the validation report](docs/validation.md) for details. These findings are preserved in the initial baseline.

A Shopify storefront preview and app-dependent behavior require an authorized Shopify connection. Static parsing does not establish that every page renders or that third-party apps work in another store.

## Review in the staging store

- `sections/team-homepage.liquid` is empty in the original export and is referenced by two templates. Review those pages before using them.
- The source references FCTR Uniform and Coach Portal and Oxify Product Options. Their corresponding app installations and resources are required for the related features.
- Menus, products, collections, images uploaded to Shopify, app blocks, and other store-specific settings may need to be configured for the staging store. A theme repository does not transfer the store's catalog or customer/order data.
- Preserve the original export as the baseline; make any fixes as separate, reviewable changes after previewing the affected pages.

Never commit Shopify access tokens, passwords, CLI authentication state, or `.env` files. Theme source publication does not connect or publish either Shopify store.
