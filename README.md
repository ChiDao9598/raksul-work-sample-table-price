# Price Table

An interactive **price table for paper printing products**. The user picks a paper size and sees every price as a grid of **Quantity × Delivery in business days**. They can then select a price to see it as the order price.

Built with **Angular 22** (standalone components, signals, zoneless change detection) and **no third-party UI, CSS or utility libraries**.

---

## Table of Contents

1. [Features](#1-features)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Task 1 – Analysis & Implementation](#5-task-1--analysis--implementation)
6. [Task 2 – Number Formatting](#6-task-2--number-formatting)
7. [Final Result](#7-final-result)
8. [Additional Features](#8-additional-features)
9. [Assumptions](#9-assumptions)
10. [Possible Improvements](#10-possible-improvements)

---

## 1. Features

### Task 1-a – Core functionality

| # | Feature | Status |
|---|---|---|
| 1 | Prices displayed in a table of **Quantity (rows) × Delivery in business days (columns)** | ✅ |
| 2 | Paper size selection (A4, A5, B4, B5); the table reloads when **Apply** is clicked | ✅ |

### Task 1-b – Add-on functionality

| # | Feature | Status |
|---|---|---|
| 1 | **Cell selection**: the clicked cell is highlighted and its price is shown as **Order Price** | ✅ |
| 2 | **See more**: 5 quantity rows initially, all rows after clicking "See more" ("See less" collapses again) | ✅ |
| 3 | **Hover**: the hovered cell is highlighted, and its row and column (including the quantity and business-day headers) are weakly highlighted | ✅ |

### Task 2 – Number formatting

| Feature | Status |
|---|---|
| `formatPrice()` inserts a comma every 3 digits without `toLocaleString()` or `Intl.NumberFormat()` | ✅ |
| Every price in the table and the Order Price is displayed with this formatting | ✅ |

### Extras

- **Race-condition safe loading.** Applying a new size cancels the request still in flight (`switchMap`).
- **Per-size response cache.** Switching back to a size already loaded does not call the API again.
- **Loading and error states.** From the moment **Apply** is clicked until the API responds, the table is replaced by a spinner and "Loading A5 prices, please wait…". An error message is shown if the request fails. See [8.1](#81-loading-message-after-apply).
- **Responsive layout.** Selector 30% | table 70% on desktop; one column (selector → table → order price) on tablet and mobile. See [8.2](#82-responsive-layout).- **Keyboard support.** Prices are `<button>` elements, so they can be selected with the keyboard. Focusing a price applies the same highlighting as hovering it.

---

## 2. Tech Stack

### Runtime dependencies

| Package | Version | Purpose |
|---|---|---|
| `@angular/core` | 22.2.2 | Components, signals, dependency injection |
| `@angular/common` | 22.2.2 | `HttpClient`, common utilities |
| `@angular/compiler` | 22.2.2 | Template compiler |
| `@angular/platform-browser` | 22.2.2 | Browser bootstrap |
| `@angular/router` | 22.2.2 | Router (from the project scaffold; no routes are defined) |
| `@angular/forms` | 22.2.2 | Installed by the scaffold; not used by the app |
| `rxjs` | 7.8.2 | Request pipeline (`switchMap` for cancellation) |
| `tslib` | 2.8.1 | TypeScript runtime helpers |

### Development dependencies

| Package | Version | Purpose |
|---|---|---|
| `@angular/cli` | 22.2.2 | `ng` command line |
| `@angular/build` | 22.2.2 | Build system (esbuild + Vite) and unit-test builder |
| `@angular/compiler-cli` | 22.2.2 | Ahead-of-time compilation |
| `typescript` | 6.0.3 | Language |
| `vitest` | 4.1.11 | Unit test runner |
| `jsdom` | 28.1.0 | DOM environment for tests |
| `prettier` | 3.9.9 | Code formatting |

### Angular features used

- Standalone components (no `NgModule`)
- Signals: `signal`, `computed`, `linkedSignal`
- Signal-based component APIs: `input()`, `input.required()`, `output()`
- Built-in control flow: `@if`, `@for`, `@let`
- `inject()` for dependency injection
- `ChangeDetectionStrategy.OnPush` on every component
- Zoneless change detection (the default for new Angular projects; no `zone.js`)

### Compliance with the assignment restrictions

| Restriction | How it is met |
|---|---|
| Use a JavaScript framework | Angular |
| No utility libraries (jQuery, Lodash, …) | Only Angular packages and RxJS, which is a core Angular dependency |
| No CSS frameworks (Bootstrap, …) | Hand-written CSS |
| No UI component libraries (Angular Material, …) | Native `<select>`, `<table>` and `<button>` elements; the spinner is plain CSS |
| No `toLocaleString()` / `Intl.NumberFormat()` | Custom `formatPrice()` (see [Task 2](#6-task-2--number-formatting)) |
| Latest Chrome / Firefox | Uses only standard modern web APIs |

---

## 3. Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | `^22.22.3`, `^24.15.0` or `>=26.0.0` (required by Angular 22) |
| npm | Bundled with Node.js (the project pins `npm@10.9.8`) |

Check your versions:

```bash
node -v
npm -v
```

### Installation

```bash
# 1. Get the source (clone the repository or unzip the archive)
cd raksul-work-sample-table-price

# 2. Install dependencies
npm install
```

### Run locally

```bash
npm start
```

Open **http://localhost:4200**. The app reloads automatically when a source file changes.

The app calls the public API at `https://us-central1-fe-ws-test.cloudfunctions.net/prices`, so an internet connection is required.

### Run the tests

```bash
npm test                     # watch mode
npm test -- --watch=false    # single run (CI)
```

HTTP calls are mocked, so the tests work offline. See [Testing](#510-testing) for what is covered.

### Production build

```bash
npm run build
```

The output is written to `dist/raksul-work-sample-table-price/browser`. To preview it, serve that folder with any static server, for example:

```bash
npx http-server dist/raksul-work-sample-table-price/browser -p 8080
```

### Available scripts

| Script | Command | Description |
|---|---|---|
| `npm start` | `ng serve` | Development server on port 4200 |
| `npm test` | `ng test` | Unit tests with Vitest |
| `npm run build` | `ng build` | Production build |
| `npm run watch` | `ng build --watch --configuration development` | Rebuild on change |

### Troubleshooting

| Problem | Solution |
|---|---|
| `The Angular CLI requires a minimum Node.js version` | Upgrade Node.js to a version listed in [Prerequisites](#prerequisites) |
| Port 4200 is already in use | `npm start -- --port 4300` |
| The page shows "Could not load prices for …" | Check your internet connection, then click **Apply** again |

---

## 4. Project Structure

```
raksul-work-sample-table-price/
├── README.md
├── angular.json                         # Angular workspace configuration
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.spec.json
└── src/
    ├── index.html
    ├── main.ts                          # bootstraps App
    ├── styles.css                       # global styles
    └── app/
        ├── app.ts|html|css              # responsive page layout; loading/error states; connects store and components
        ├── app.config.ts                # providers (HttpClient, Router)
        ├── app.routes.ts                # empty route list (scaffold)
        ├── models/
        │   └── price.model.ts           # types and constants
        ├── services/
        │   ├── apis/
        │   │   └── price-api.service.ts # GET /prices?paper_size=
        │   └── stores/
        │       └── price-table.store.ts # signal state and loading pipeline
        ├── components/
        │   ├── paper-size-selector/     # dropdown + Apply
        │   ├── price-table/             # table, hover, selection, See more
        │   └── order-summary-component/ # Order Price + Cart
        ├── pipes/
        │   └── format-price-pipe.ts     # Task 2: template wrapper for formatPrice
        ├── utils/
        │   ├── build-price-table.ts     # API response -> table structure
        │   └── format-price.ts          # Task 2: comma every 3 digits
        └── testing/
            └── price-response.mock.ts   # test data with the real API shape (10 × 5)
```

Every `.ts` file with logic has a `.spec.ts` file next to it.

---

## 5. Task 1 – Analysis & Implementation

### 5.1 Requirement analysis

The specification was broken down into testable requirements. Task 1-a items are ordered by priority, as stated in the assignment. Task 1-b items may be done in any order.

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| **R1** | View prices in a table of Delivery in business days × Quantity | Must (1-a #1) | Each cell shows the API price for one (quantity, business day) pair. Quantities are the rows and business days are the columns |
| **R2** | Select paper size and view its table | Must (1-a #2) | A4, A5, B4 and B5 are selectable. Clicking Apply loads and shows that size's prices |
| **R3** | Select a cell | Should (1-b #1) | Clicking a price highlights that cell (and only that cell). Its price appears as "Order Price" |
| **R4** | See more | Should (1-b #2) | 5 quantity rows are shown at first. After "See more", every quantity row is shown |
| **R5** | Hover feedback | Should (1-b #3) | The hovered cell is highlighted. Its row and column are weakly highlighted |
| **C1** | Use a JS framework, with no utility, CSS or UI component libraries | Constraint | Only Angular and RxJS are used at runtime |
| **C2** | Works in the latest Chrome and Firefox | Constraint | Only standard web APIs are used |

**Reading "Delivery in business days × Quantity".** The "×" means "by", as in "a 3 × 4 table". It describes the two dimensions of the table, not a multiplication. Three things confirm this reading:

- The API returns a ready-made `price` for every `(business_day, quantity)` pair.
- Task 1-b #3 asks the user to "check respective delivery in business days and quantity" for a price.
- The wireframe highlights one row and one column that cross at the selected cell.

**Choosing which axis is which.** R4 says the initial display is "5 rows of quantity". So quantities must be the **rows** and business days the **columns**.

### 5.2 Wireframe analysis

```
┌─ Selector panel ─────┐  ┌─ Table panel ─────────────────────────────┐
│ Select paper size    │  │ Price table                               │
│ [ A4            ▼ ]  │  │ ┌──┬──┬──┬──┬──┬──┐                        │
│                      │  │ │  │  │  │░░│  │  │  ░ weak (row/column)   │
│                      │  │ ├──┼──┼──┼──┼──┼──┤  █ strong (cell)       │
│             [Apply]  │  │ │  │░░│░░│██│░░│  │                        │
└──────────────────────┘  └───────────────────────────────────────────┘
┌─ Summary bar ───────────────────────────────────────────────────────┐
│                                      Order price: 9999 VND    [ Cart ]│
└─────────────────────────────────────────────────────────────────────┘
```

| Observation | Design decision |
|---|---|
| Three visually separate regions | Three components: `PaperSizeSelector`, `PriceTableComponent`, `OrderSummaryComponent` |
| The dropdown has a separate **Apply** button | The dropdown edits a local draft. Data is fetched only when Apply is clicked |
| The table has 1 header column + 5 data columns | Matches the 5 business days returned by the API |
| Two highlight intensities (light row/column, dark cell) | Three CSS layers: weak (row/column) → hover (cell) → selected (cell), with the strongest one declared last |

### 5.3 API analysis

**Contract**

```
GET https://us-central1-fe-ws-test.cloudfunctions.net/prices?paper_size=A4
```

| Item | Specification |
|---|---|
| Parameter | `paper_size`: `"A4" \| "A5" \| "B4" \| "B5"`, case-insensitive, default `"A4"` |
| `prices` | Always 10 rows, sorted by increasing quantity |
| Row | Array of `{ business_day, price, quantity }` |

**Observed response** (live call for A4):

| Property | Value |
|---|---|
| Quantities (rows) | 10, 100, 200, 300, 400, 500, 600, 700, 800, 900 |
| Business days (columns) | 1, 2, 3, 4, 5 |
| Response `paper_size` | lowercase (`"a4"`) |

**Spec issues found**

| Issue | Handling |
|---|---|
| `GET /prices?paper_size=(A5\|A5\|B4\|B5)` lists A5 twice and leaves out A4 | Interpreted as `A4 \| A5 \| B4 \| B5`, matching the parameter description |
| The host is written as `//` (protocol-relative) | HTTPS is used explicitly |
| `Content-Type: application/json` on a GET request | Not needed (a GET has no body), so it is not sent |

**Risks and edge cases identified from the data model**

| Risk | Mitigation |
|---|---|
| The number of business days is not documented | Columns are **derived from the data**, not hard-coded |
| A row might be missing a business day | Cells are looked up in a `Map`. A missing cell renders as "—" |
| An item might be malformed | Invalid items are skipped instead of crashing the table |
| The user switches sizes quickly, and responses arrive out of order | `switchMap` cancels the previous request |
| Network or server error | An error message is shown in place of the table |

### 5.4 Resolving ambiguities

When the specification was silent, the simplest behavior consistent with the wireframe was chosen:

| Question | Decision | Reason |
|---|---|---|
| Should changing the dropdown reload the table immediately? | No, only on **Apply** | The wireframe has an explicit Apply button |
| What happens to the selection when the paper size changes? | It is cleared | The selected price belongs to the previous size |
| What happens to "See more" when the paper size changes? | Collapses back to 5 rows | Consistent starting state for every table |
| Can the user collapse the table after "See more"? | Yes, with "See less" | Small addition that improves usability |
| What does "Order Price" show before any selection? | "-" | Avoids showing a misleading 0 |

### 5.5 Architecture

#### Data flow

```mermaid
flowchart TD
    User((User)) -->|Apply| Selector[PaperSizeSelector]
    Selector -->|apply output| App[App]
    App -->|store.apply size| Store[PriceTableStore]
    Store -->|getPrices| Api[PriceApiService]
    Api -->|HTTP GET| Backend[(Prices API)]
    Backend -->|PriceResponse| Api
    Api --> Store
    Store -->|buildPriceTable| Store
    Store -->|signals| App
    App -->|table, selected, expanded| Table[PriceTableComponent]
    App -->|price, paperSize, selected| Summary[OrderSummaryComponent]
    User -->|click cell / See more| Table
    Table -->|cellSelected, expandedChange| App
    App -->|store.select / setExpanded| Store
```

The data flows **one way**. The store holds the state. Components receive it through `input()` and report user actions through `output()`. Only `App` talks to the store.

#### Layers

| Layer | Files | Responsibility |
|---|---|---|
| Model | `models/price.model.ts` | Types and constants (`PAPER_SIZES`, `PAPER_SIZE_DEFAULT`, `INIT_VISIBLE_ROWS`) |
| Data access | `services/apis/price-api.service.ts` | One HTTP call, no logic |
| Transformation | `utils/build-price-table.ts` | Pure function: API response → table structure |
| State | `services/stores/price-table.store.ts` | Signals, loading pipeline, cache |
| Container | `app.*` | Connects the store to the components; loading and error states |
| Presentation | `components/*` | Rendering and user interaction only |

#### State model

| State | Type | Owner | Why it lives there |
|---|---|---|---|
| `paperSize` | `PaperSize` | Store | Needed by the selector and the order summary |
| `table` | `PriceTable \| null` | Store | Shared data |
| `loading`, `error` | `boolean`, `string \| null` | Store | Set by the loading pipeline |
| `selected` | `CellRef \| null` | Store | Needed by the table (highlight) and the summary (price) |
| `expanded` | `boolean` | Store | Must reset when the paper size changes |
| `selectedPrice` | `computed` | Store | Derived from `table` + `selected` |
| `hovered` | `CellRef \| null` | `PriceTableComponent` | Purely visual. No other component needs it |
| `paperSizeSelected` | `linkedSignal` | `PaperSizeSelector` | Unconfirmed dropdown value |

#### Data model transformation

The API's nested arrays are reshaped into a structure that is easy to render:

```
API response                               PriceTable
──────────────────────────────            ─────────────────────────────────
prices: [                                  quantities:   [10, 100, …, 900]   ← rows
  [ {day 1, qty 10, 1568},        ───►     businessDays: [1, 2, 3, 4, 5]     ← columns
    {day 2, qty 10, 1578}, … ],            cells: Map {
  [ {day 1, qty 100, 1648}, … ],             "10-1"  → 1568,
  …                                          "10-2"  → 1578,
]                                            "100-1" → 1648, …  }
```

The template loops over `quantities`, then over `businessDays`, and looks up each price in O(1) time with `getCellPrice(table, quantity, day)`.

### 5.6 Implementation

Core requirements (R1, R2) were built before any add-on, so a working baseline existed at every point.

#### R1 – Rendering the table

`PriceTableComponent` uses a semantic `<table>`. Business days are the column headers (shown as "1 day", "2 days", …) and quantities are row headers (`<th scope="row">`).

```html
@for (qty of visibleQuantities(); track qty) {
  <tr>
    <th scope="row" class="row-header">{{ qty }}</th>
    @for (day of table().businessDays; track day) {
      @let price = priceOf(qty, day);
      <td class="cell">…{{ price | formatPrice }} VND…</td>
    }
  </tr>
}
```

#### R2 – Paper size selection

The selector keeps a draft value with `linkedSignal`, which resets automatically whenever the applied size changes from outside. Changing the dropdown only updates the draft; submitting the form with **Apply** emits the `apply` output.

The store loads the data through a single RxJS pipeline:

```ts
this.$apply.pipe(
  tap(() => { this.loading.set(true); this.error.set(null); }),
  switchMap((size) => this.fetchTable(size)),   // cancels the previous request
  takeUntilDestroyed(),
).subscribe((table) => {
  this.table.set(table);
  this.selected.set(null);    // reset for the new size
  this.expanded.set(false);
  this.loading.set(false);
});
```

`fetchTable` returns the cached table when one exists. Otherwise it calls the API, maps the response with `buildPriceTable`, stores the result in the cache, and turns HTTP errors into a user-facing message. The default size (A4) is loaded in `App.ngOnInit`.

#### R3 – Cell selection

Each price is a `<button>` inside its `<td>`, so it can be focused and selected with the keyboard (Enter/Space) with no extra code. A click emits `cellSelected`, and the store updates `selected`. The order price is a derived value:

```ts
readonly selectedPrice = computed(() => {
  const t = this.table();
  const s = this.selected();
  return t && s ? getCellPrice(t, s.quantity, s.businessDay) : null;
});
```

`OrderSummaryComponent` shows "Order Price: VND {price}", or "-" when nothing is selected. The **Cart** button from the wireframe is disabled until a price is selected; its behavior is not specified, so it does nothing further.

#### R4 – See more

```ts
protected readonly visibleQuantities = computed(() => {
  const quantites = this.table().quantities;
  return this.expanded() ? quantites : quantites.slice(0, INIT_VISIBLE_ROWS);
});
```

The button toggles between "See more" and "See less" and exposes `aria-expanded`. It is hidden when there are 5 rows or fewer.

#### R5 – Hover highlighting

A local `hovered` signal is set on `mouseenter` of a cell and on `focus` of its button, so keyboard users get the same feedback. It is cleared on `mouseleave` of the whole table (so moving between cells does not flicker) and on `blur` of the button. Every cell compares its own coordinates with the hovered one, and the quantity and business-day headers get `.header--hovered` the same way:

```html
<td
  class="cell"
  [class.row--hovered]="hovered()?.quantity === qty"
  [class.col--hovered]="hovered()?.businessDay === day"
  [class.cell-selected]="isSelected(qty, day)"
  [class.cell-hovered]="isHovered(qty, day)"
  (mouseenter)="setHover(qty, day)">
```

The CSS declares the classes from weakest to strongest (`.row--hovered`/`.col--hovered` → `.cell-hovered` → `.cell-selected`), so the selected cell stays visible even while the user hovers over its row.

### 5.7 Edge cases and error handling

| Scenario | Behavior |
|---|---|
| First load still in progress | Spinner with "Loading A4 prices, please wait…" (`role="status"`) |
| Switching sizes while a table is shown | The previous table is hidden and the loading message is shown until the new data arrives |
| Apply clicked several times quickly | Only the last request is kept (`switchMap`) |
| Size already loaded before | Served from the cache, no HTTP request |
| HTTP error | "Could not load prices for B5. Please try again." in place of the table (`role="alert"`) |
| Missing cell in the response | Rendered as "—", not clickable |
| Malformed item in the response | Skipped |
| 5 rows or fewer | "See more" is hidden |
| Selected row hidden by "See less" | The selection and order price are kept || Narrow screen | One-column layout; the table scrolls horizontally inside its panel ([8.2](#82-responsive-layout)) |

### 5.8 Trade-offs

| Decision | Alternative | Why this choice |
|---|---|---|
| Signals + a small store service | NgRx, or another state library | The state is small; an extra library would add boilerplate with no benefit |
| `Map` with string keys | Using `prices[row][col]` directly | Does not depend on the API's ordering; handles missing cells |
| Hover state in signals | CSS-only `:hover` | CSS cannot highlight a whole **column**; signals also support keyboard focus |
| Presentational components | Components that inject the store | Easier to test and reuse; one clear data flow |
| Cache per paper size | Always refetch | Prices are static for this exercise. With live prices, the cache would need an expiry time |
| `<button>` inside each cell | Click handler on the `<td>` | Keyboard support for free |

### 5.9 Result

![Task 1 result: A4 price table expanded to all rows, with a selected cell and hover highlighting](task-1.png)

The screenshot shows the A4 table after clicking "See more" (all 10 quantity rows):

- **Selected cell** (dark blue): 500 pcs, 2 days. Its price is shown as "Order Price: VND 1970".
- **Hovered cell** (blue): 300 pcs, 3 days. The other cells in its row and column are weakly highlighted (light blue).

### 5.10 Testing

Tests are organized by layer. HTTP calls are mocked with `HttpTestingController`, so the tests are fast, deterministic and work offline. `testing/price-response.mock.ts` creates responses with the same shape as the real API (10 quantities × 5 business days).

| Level | Spec file | What it covers |
|---|---|---|
| Unit | `utils/build-price-table.spec.ts` | Rows/columns from the data, the sample response from the API spec, sorting, missing cells, invalid items, empty response |
| Unit | `services/apis/price-api.spec.ts` | `GET` method, HTTPS URL, `paper_size` parameter, response body |
| Unit | `services/stores/price-table.store.spec.ts` | Initial state, loading state, **request cancellation** (`switchMap`), cache, reset on size change, error and retry, `selectedPrice` |
| Component | `components/price-table/price-table.spec.ts` | **R1** headers and formatted prices, "—" for missing cells; **R3** click output and single selected cell; **R4** 5 → 10 rows, See more / See less, hidden button; **R5** hovered cell, weak row/column/headers, mouse leave, keyboard focus |
| Component | `components/paper-size-selector/paper-size-selector.spec.ts` | **R2** options A4–B5, no output on change, output on Apply, pending-change hint |
| Component | `components/order-summary-component/order-summary-component.spec.ts` | "-" and disabled Cart before selection; formatted price after selection |
| Integration | `app.spec.ts` | Full user flow with a mocked backend: loading → A4 table → select a cell → See more → Apply B5 → new prices, selection cleared; error message; loading message after Apply ([8.1](#81-loading-message-after-apply)) |

The Task 2 tests are described in [6.5 Unit tests](#65-unit-tests).

---

## 6. Task 2 – Number Formatting

### 6.1 Requirement

Display every price with a comma every 3 digits, counted from the right (`1000` → `1,000`, `1234567` → `1,234,567`), **without** using `toLocaleString()` or `Intl.NumberFormat()`. Prices are natural numbers.

### 6.2 Implementation

`src/app/utils/format-price.ts`:

```ts
export function formatPrice(value: number): string {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`FormatPrice expects a positive integer, received: ${value}`);
  }

  const digits = String(value);
  let rs = '';

  for (let i = 0; i < digits.length; i++) {
    const remaining = digits.length - i;
    rs += digits[i];
    if (remaining > 1 && (remaining - 1) % 3 === 0) {
      rs += ',';
    }
  }
  return rs;
}
```

**How it works.** The number is converted to a string and read from left to right. After each digit, `remaining - 1` is the number of digits still to come. When that number is a non-zero multiple of 3, a comma is added.

Example for `1234567` (7 digits):

| Digit | `1` | `2` | `3` | `4` | `5` | `6` | `7` |
|---|---|---|---|---|---|---|---|
| Digits after it | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| Comma after it? | ✅ | | | ✅ | | | |

Result: `1,234,567`.

**Input validation.** Anything that is not a natural number is rejected with a `RangeError`: `0`, negative numbers, decimals, `NaN`, `Infinity`, and values above `Number.MAX_SAFE_INTEGER` (beyond that limit, JavaScript can no longer represent every digit exactly).

| Input | Output |
|---|---|
| `1` | `"1"` |
| `999` | `"999"` |
| `1000` | `"1,000"` |
| `1568` | `"1,568"` |
| `1234567` | `"1,234,567"` |
| `0`, `-1`, `1.5`, `NaN` | throws `RangeError` |

### 6.3 Using it in templates

`FormatPricePipe` (`src/app/pipes/format-price-pipe.ts`) wraps the function so templates can use `{{ price | formatPrice }}`. It returns `"-"` for `null`/`undefined` and for values that `formatPrice` rejects, so one bad value cannot break the page.

The pipe is used in two places:

| Where | Template | Example |
|---|---|---|
| Table cell (`PriceTableComponent`) | `{{ price \| formatPrice }} VND` | `1,820 VND` |
| Order Price (`OrderSummaryComponent`) | `VND {{ price() \| formatPrice }}` | `VND 1,820` |

### 6.4 Result

![Task 2 result: prices formatted with a comma every 3 digits](task-2.png)

Every price in the table and the Order Price now has a comma every 3 digits (for example `1,820 VND` and "Order Price: VND 1,820").

### 6.5 Unit tests

`src/app/utils/format-price.spec.ts`:

| Group | Cases |
|---|---|
| Comma placement | 1 to 3 digits (`1`, `99`, `999` → no comma), each digit-count boundary (`1000`, `10000`, `100000`, `1000000`, `1000000000`), mixed digits (`1568`, `1234567`, `123456789`), and `Number.MAX_SAFE_INTEGER` → `9,007,199,254,740,991` |
| Invalid input | `0`, negative numbers, decimals, `NaN`, `±Infinity`, `MAX_SAFE_INTEGER + 1` all throw `RangeError`; the message includes the received value |
| Forbidden APIs | Spies on `Number.prototype.toLocaleString` and `Intl.NumberFormat` prove that neither is ever called |

`src/app/pipes/format-price-pipe.spec.ts` checks that the pipe formats valid prices and returns "-" for `null`, `undefined` and invalid values instead of throwing.

---

## 7. Final Result

The screenshots in [5.9](#59-result) and [6.4](#64-result) record the progress after each task. This is the final version of the app, with Task 1 and Task 2 complete and the styling finished.

![Final result: A4 price table with a selected price, hover highlighting and the order price](final-result.png)

| Requirement | Shown in the screenshot |
|---|---|
| **1-a #1** Quantity × business days table | Quantities 10–400 as rows, "1 day" to "5 days" as columns |
| **1-a #2** Paper size selection | "A4" applied with **Apply**; the panel title shows "Page Size Selected: A4" |
| **1-b #1** Cell selection | 100 pcs × 2 days is selected (blue), and "Order Price: VND 1,650" is shown next to the **Cart** button |
| **1-b #2** See more | 5 quantity rows are shown, with the **See more** button below the table |
| **1-b #3** Hover | 300 pcs × 3 days is hovered (dark grey). Its row and column, including the "300" and "3 days" headers, are weakly highlighted |
| **Task 2** Number formatting | Every price has a comma every 3 digits (`1,568`, `1,820`, …) |

---

## 8. Additional Features

Improvements added after Task 1 and Task 2 were complete.

### 8.1 Loading message after Apply

**Requirement.** When the user clicks **Apply**, show a short message or spinner until the table data returns from the endpoint, so the user knows to wait.

**Behavior.**

- From the click on **Apply** until the API responds, the old table is **hidden** and the table panel shows a spinner with "Loading B5 prices, please wait…".
- The same message is shown on the first page load (A4).
- If Apply is clicked again while a request is in flight, the message switches to the newest size. The older request is cancelled (`switchMap`), so its data can never replace the newer one.
- A size that is already in the cache is returned synchronously, so the message never flashes for it.
- If the request fails, the message is replaced by the error message.

**Implementation.** The store already sets `loading` to `true` in the RxJS pipeline as soon as a size is applied, and back to `false` when the response (or error) arrives. The template in `app.html` uses it to choose what the table panel shows:

```html
@if (store.error(); as error) {
  <div class="status status--error" role="alert"><p>{{ error }}</p></div>
} @else if (store.loading() || !store.table()) {
  <div class="status" role="status">
    <span class="spinner" aria-hidden="true"></span>
    <p>Loading {{ store.paperSize() }} prices, please wait…</p>
  </div>
} @else if (store.table(); as table) {
  <app-price-table [table]="table" … />
}
```

- The spinner is a plain CSS ring (`border` + `@keyframes spin`) in the app's selected-cell color; no library is used.
- `role="status"` makes screen readers announce the message; the spinner itself is `aria-hidden`.
- The message area has a `min-height`, so the panel keeps roughly the size of the table instead of collapsing.

**Tests** (`app.spec.ts`): message and spinner on first load; old table hidden and "Loading B5 prices…" shown after Apply until the response arrives; message for the latest size when Apply is clicked twice; no message for a cached size; message shown again when retrying after an error.

### 8.2 Responsive layout

**Requirement.** On mobile and tablet, show the paper size selector on top, the price table below it, and the order price at the bottom. On desktop, the selector and the table share one row (**30% / 70%**) whose width lines up with the order price bar.

| Screen | Width | Layout |
|---|---|---|
| Desktop | ≥ 1024px | Selector 30% \| table 70% in one row; order price bar below. All sections share the same width (up to 1200px), so their edges line up |
| Tablet | 600–1023px | One column: selector → table → order price, each full width |
| Mobile | < 600px | One column, with tighter padding and smaller text; full-width **Apply** and **See more** buttons; the table scrolls horizontally inside its panel |

```
Desktop (≥ 1024px)                          Tablet / mobile (< 1024px)
┌────────────┬──────────────────────────┐   ┌──────────────────────┐
│ Selector   │ Price table              │   │ Selector             │
│ 30%        │ 70%                      │   ├──────────────────────┤
├────────────┴──────────────────────────┤   │ Price table          │
│                Order price  [ Cart ]  │   ├──────────────────────┤
└───────────────────────────────────────┘   │ Order price [ Cart ] │
                                            └──────────────────────┘
```

**Implementation.**

- **No HTML reordering was needed.** The DOM order is already selector → table → order price, which is the stacked order on small screens. Only CSS changes between breakpoints.
- **Desktop row:** `.wrap-table-price` is a CSS Grid with `grid-template-columns: 3fr 7fr`. Below 1024px it becomes `1fr` (one column).
- **Aligned widths:** `.layout` has `width: 100%; max-width: 1200px`, and both sections are `width: 100%`, so the top row and the order price bar always have the same edges.
- **Table on small screens:** the `<table>` is wrapped in `.table-scroll` (`overflow-x: auto`) and has `min-width: 520px`. On a narrow phone the table scrolls sideways inside its panel instead of squashing the prices or making the whole page scroll. `min-width: 0` on the grid item lets this work inside the grid.
- **Prices on one line:** each price button fills its cell and uses `white-space: nowrap`, so "1,568 VND" never breaks across two lines.
- **Fluid headings:** the page title and "Page Size Selected" use `clamp()`, so they shrink smoothly on small screens.
- **Touch-friendly:** below 600px, **Apply** and **See more** are full width, and the order price bar spreads the price and **Cart** to opposite edges.

| File | Change |
|---|---|
| `app.css` | Grid layout, breakpoints, aligned widths, status/spinner styles |
| `app.html` | "Page Size Selected" uses the `.table-heading` class instead of an inline style |
| `price-table.html` / `.css` | `.table-scroll` wrapper, full-width table and buttons, smaller cells on mobile |
| `paper-size-selector.css` | Smaller title and full-width Apply on mobile |
| `order-summary-component.css` | Price and Cart at opposite edges on mobile |

---

## 9. Assumptions

- The paper size is applied only when **Apply** is clicked, as in the wireframe.
- Changing the paper size clears the selection and collapses the table, because the selected price belongs to the previous size.
- Prices do not change during a session, so caching each size's response is safe.
- Prices are natural numbers, as stated in Task 2, so `formatPrice` does not handle decimals.

---

## 10. Possible Improvements

- Show the selected details next to the order price (e.g. "A4 · 200 pcs · 4 business days").
- A **Retry** button on the error message.
- Accessibility: `<caption>`, `aria-pressed` on the selected price, `aria-live` on the order price.
- End-to-end tests (for example, Playwright) against the real API in Chrome and Firefox.
- Use the same currency format in the table and the Order Price (`1,820 VND` vs `VND 1,820`).
- Arrow-key navigation between cells (roving `tabindex`).
- Keep the paper size and selection in the URL so they survive a reload and can be shared.
