# Validation of the supplied theme export

Source archive SHA-256: `2f6020e7eee1e62978618a36fa72f14b1b4694bb066a504bb9d737ca70d26538`.

The 184 exported theme files were copied byte-for-byte. The following findings already exist in the supplied export. Initialization does not change or suppress them.

## Static import checks

- Required `layout/theme.liquid` exists at the correct root.
- 51 JSON documents parse, including Shopify-generated leading comments.
- 78 Liquid schema blocks parse without duplicate setting IDs.
- All 10 plain JavaScript assets pass syntax parsing without execution.
- Literal snippet and asset references resolve within the export.
- No blocking credential-pattern or embedded customer-record finding was detected in offline inspection.

## Shopify CLI 5.0.0 Theme Check

Result: **not passing** — 751 errors and 47 warnings.

| Severity | Check | Findings |
| --- | --- | ---: |
| error | ImgWidthAndHeight | 1 |
| error | MatchingTranslations | 748 |
| error | ValidSchema | 2 |
| warning | AssetPreload | 7 |
| warning | DeprecatedFontsOnSettingsSchema | 2 |
| warning | ExcessiveSettingsCount | 1 |
| warning | LiquidComplexity | 1 |
| warning | OrphanedSnippet | 3 |
| warning | PaginationSize | 1 |
| warning | RemoteAsset | 3 |
| warning | UnclosedHTMLElement | 1 |
| warning | UndefinedObject | 11 |
| warning | UnusedAssign | 9 |
| warning | ValidScopedCSSClass | 6 |
| warning | VariableName | 2 |

Of the errors, 748 are missing matching translations in non-default locale files. The other three are:

| File | Line | Finding |
| --- | ---: | --- |
| `sections/main-gift-card.liquid` | 61 | Missing width and height attributes on img tag |
| `sections/collection-countdown-bar.liquid` | 293 | Property templates is not allowed. |
| `sections/product-metafield-products.liquid` | 104 | Property templates is not allowed. |

## Store-dependent preview checks

- `sections/team-homepage.liquid` is empty and used by two templates.
- The original templates reference FCTR Uniform and Coach Portal and Oxify Product Options app blocks. Availability and behavior depend on installation/configuration in the target store.
- Verify images, menus, products, collections, localization, custom pages, and cart behavior in the staging store. These resources are not transferred by committing theme files.
- No authenticated Shopify preview, storefront test, theme publish, or live-store change has been performed.

Fix existing issues in separate reviewed commits after this initial baseline is saved. Do not disable checks to conceal failures.
