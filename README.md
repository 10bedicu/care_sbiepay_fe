# care_sbiepay_fe

CARE frontend plug for the [`care_sbiepay`](../care/care_sbiepay) backend plug.

It adds a **Configure SBI ePay merchant** action to the facility home page,
letting superusers set the per-facility merchant code and merchant (AES) key
and toggle payment collection. The merchant key is write-only on the API; the
UI only ever shows a masked hint.

## Pluggable components

| Component | Where it renders |
| --- | --- |
| `FacilityHomeActions` | Facility home page actions menu |

## API

Talks to `/api/care_sbiepay/merchant/` (`GET`/`POST`/`PATCH` by facility id).

## Development

```bash
npm install
npm run dev        # builds in watch mode and serves remoteEntry.js on :5176
```

Then register it with the backend so `care_fe` loads it (superuser):

```
POST /api/v1/plug_config/
{ "slug": "care_sbiepay_fe", "meta": { "name": "care_sbiepay_fe", "url": "http://localhost:5176/assets/remoteEntry.js" } }
```

or, without the backend registry, enable it at build time in `care_fe/.env.local`:

```
REACT_ENABLED_APPS="ohcnetwork/care_sbiepay_fe@localhost:5176"
```

## Build

```bash
npm run build      # type-checks and writes dist/
```
