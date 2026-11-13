# Nil's Bakery Abuja · demo ordering site

A concept website for **Nil's Bakery**, Royalty Square Mall, 2 Sakono St, Wuse 2, Abuja. React + Vite, mobile first.

**What's in it**
- Editorial menu of ~55 real Nil's products in 7 categories (mousse cakes, cheesecakes, cups/cans/pops, croissants & choux, tarts, cookies, cupcakes), using Nil's own Instagram and menu photos
- Bag, 3-step checkout (details → delivery or pickup → payment)
- Payment: Paystack **test-mode mock** (card / transfer / USSD) or pay on delivery/pickup. No real money moves.
- Order confirmation with a unique order code (e.g. `NB-1113-K7Q4`) and progress tracker
- **My orders** (`/#orders`): look up any order by code + phone, no account
- Custom celebration cake request form (shows up in the dashboard)
- **Owner dashboard** (`/#admin`): orders, payment and status updates, cake requests, sold-out-today switches
  - Demo login: `owner@nilsbakery.demo` / `nils2026`
- Floating WhatsApp button for questions

**Prices.** Prices come from Nil's published digital menu (leggimenu.it) or 2026 customer reviews. Items marked † are sample prices. Delivery fees are samples.

**Demo limits.** Orders are saved in the browser (localStorage). A live version needs a database, Nil's own Paystack account, and SMS/WhatsApp notifications.

```
npm install
npm run dev     # local
npm run build   # production build in dist/
```

Deploy: import the repo at vercel.com/new (framework preset: Vite).

Built by Sajdexx.
