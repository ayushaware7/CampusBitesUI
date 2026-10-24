# Campus Bites UI

React frontend for Campus Bites: students and staff scan a canteen's QR code, order from their phone and pay online, so there is no queue at the counter.

Backend: [CampusBitesBackend](https://github.com/ayushaware7/CampusBitesBackend)

## Stack
React (Create React App), React Router, Tailwind CSS, Razorpay Checkout.

## Run
```
npm install
npm start        # http://localhost:3000
```
The backend must be running on `http://localhost:8080`.

`package-lock.json` is out of sync with `package.json` (missing `typescript@4.9.5`), so `npm ci` fails; use `npm install`.

## Main routes
| Route | Purpose |
|---|---|
| `/c/:slug` | QR landing: remembers the canteen, opens its menu |
| `/menu`, `/cart`, `/checkout` | Customer ordering and Razorpay payment |
| `/track-orders` | Customer order status (by phone number) |
| `/admin/login`, `/admin` | Canteen admin: live orders, past orders, add items |

## Known cleanup (planned)
- The Razorpay key id and `http://localhost:8080` URLs are hardcoded in the source; move them to `REACT_APP_*` env variables.
- The category pages (`Snacks`, `Lunch`, ...) call the service incorrectly and need fixing.
