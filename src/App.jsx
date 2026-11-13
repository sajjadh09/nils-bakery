import React, { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS, SHOP, SLOTS, SRC_NOTE, ZONES, naira } from "./data.js";

/* ---------- storage + helpers ---------- */
const K = { cart: "nb-cart", orders: "nb-orders", mine: "nb-my", req: "nb-requests", sold: "nb-soldout", owner: "nb-owner" };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const digits = (x) => (x || "").replace(/\D/g, "").slice(-10);
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode(prefix, takenList) {
  const taken = new Set(takenList.map((o) => o.id));
  const d = new Date();
  const md = String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  let c;
  do {
    const r = crypto.getRandomValues(new Uint8Array(4));
    c = `${prefix}-${md}-` + [...r].map((x) => CODE_CHARS[x % CODE_CHARS.length]).join("");
  } while (taken.has(c));
  return c;
}
const when = (t) => (t ? new Date(t).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "");
const waLink = (text) => `https://wa.me/${SHOP.phoneIntl}${text ? "?text=" + encodeURIComponent(text) : ""}`;
const STATUSES = ["Received", "Being prepared", "Ready / Out for delivery", "Delivered"];

/* ---------- icons ---------- */
const I = {
  bag: "M5 7h14l-1.2 11.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9L5 7Zm4 0V6a3 3 0 0 1 6 0v1",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z",
  check: "M5 12.5 10 17 19 7",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6",
  snow: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9",
};
function Icon({ d, size = 20, fill }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill={fill || "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;
}
function WaIcon({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

/* ---------- brand ---------- */
function Wordmark({ small, onClick }) {
  return (
    <a className={"wm" + (small ? " wm--sm" : "")} href="#top" onClick={onClick} aria-label="Nil's Bakery, home">
      <span className="wm__name">Nil’s</span>
      <span className="wm__sub">Bakery · Abuja</span>
    </a>
  );
}
function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 120 12" aria-hidden="true">
      <path d="M2 6h44M74 6h44" stroke="currentColor" strokeWidth=".8" />
      <path d="M60 1.5 64.5 6 60 10.5 55.5 6Z" fill="none" stroke="currentColor" strokeWidth=".8" />
    </svg>
  );
}

function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="splash" onClick={onDone} role="presentation">
      <div className="splash__in">
        <Flourish />
        <p className="splash__name">NIL’S</p>
        <p className="splash__bakery">BAKERY</p>
        <Flourish />
        <p className="splash__tag">Wuse 2 · Abuja</p>
      </div>
    </div>
  );
}

/* ---------- header ---------- */
function Ticker() {
  const items = [`Open ${SHOP.hours}`, "Royalty Square Mall, Wuse 2", "Same-day delivery across Abuja", "Custom celebration cakes", `${SHOP.rating}★ on Google`, "Handmade daily"];
  const row = items.map((t, i) => <span key={i}>{t}<i>✦</i></span>);
  return <div className="ticker" aria-label="Shop information"><div className="ticker__track">{row}{row}</div></div>;
}

function Header({ count, onCart, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); h(); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <header className={"hdr" + (scrolled ? " hdr--solid" : "")}>
      <div className="wrap hdr__in">
        <nav className="hdr__nav" aria-label="Main">
          <a href="#shop">Shop</a>
          <a href="#custom">Custom cakes</a>
          <a href="#visit" className="hide-sm">Visit</a>
          <a href="#orders">Orders</a>
        </nav>
        <Wordmark small />
        <div className="hdr__act">
          <button className="ibtn" onClick={onSearch} aria-label="Search the menu"><Icon d={I.search} /></button>
          <button className="ibtn ibtn--bag" onClick={onCart} aria-label={`Bag, ${count} items`}>
            <Icon d={I.bag} />{count > 0 && <b className="badge">{count}</b>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">No. 01 · The Realistic Strawberry</p>
          <h1 className="hero__h">Not a strawberry.<br /><em>A mousse cake.</em></h1>
          <p className="hero__lede">Trompe-l’œil desserts, buttery croissants and celebration cakes, handmade daily in Wuse 2. Order online, pay securely, and we’ll bring it to your door.</p>
          <div className="hero__cta">
            <a className="btn btn--ink" href="#shop">Shop the counter <Icon d={I.arrow} size={18} /></a>
            <a className="btn btn--line" href="#custom">Order a custom cake</a>
          </div>
          <ul className="hero__proof">
            <li><Icon d={I.star} size={15} fill="currentColor" /> <b>{SHOP.rating}</b> · {SHOP.reviews} Google reviews</li>
            <li><b>40K+</b> on Instagram</li>
          </ul>
        </div>
        <figure className="hero__art">
          <div className="arch arch--hero"><img src="/img/hero-strawberry.jpg" alt="Nil's Realistic Strawberry Mousse on a white plate" fetchpriority="high" /></div>
          <figcaption><span>Swipe to see inside</span><img src="/img/strawberry-inside.jpg" alt="Strawberry mousse cut open, showing the strawberry centre" loading="lazy" /></figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- catalogue ---------- */
function Tile({ p }) {
  return (
    <div className="tile" aria-hidden="true">
      <span className="tile__mono">{p.name.replace(/^(Classic |Chocolate Covered )/, "").charAt(0)}</span>
      <span className="tile__name">{p.name}</span>
      <Flourish />
    </div>
  );
}

function Card({ p, qty, soldOut, onOpen, onAdd, i }) {
  return (
    <article className={"card" + (soldOut ? " card--out" : "")} style={{ "--d": `${(i % 6) * 40}ms` }}>
      <button className="card__media" onClick={() => onOpen(p)} aria-label={`View ${p.name}`}>
        <div className="arch">{p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <Tile p={p} />}</div>
        {p.tag && !soldOut && <span className="card__tag">{p.tag}</span>}
        {soldOut && <span className="card__tag card__tag--out">Sold out today</span>}
      </button>
      <div className="card__body">
        <h3 className="card__name"><button onClick={() => onOpen(p)}>{p.name}</button></h3>
        <div className="card__row">
          <p className="price">{naira(p.price)}{p.src === "sample" && <sup title={SRC_NOTE.sample}>†</sup>}<small> / {p.unit}</small></p>
          <button className="add" onClick={() => onAdd(p.id)} disabled={soldOut} aria-label={`Add ${p.name} to bag`}>
            {qty > 0 ? <b>{qty}</b> : <Icon d={I.plus} size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function Shop({ qtyOf, soldOut, onOpen, onAdd, query, setQuery, searchRef }) {
  const [cat, setCat] = useState("all");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => (cat === "all" || p.cat === cat) && (!q || (p.name + " " + p.desc).toLowerCase().includes(q)));
  }, [cat, query]);
  const groups = cat === "all" && !query.trim() ? CATEGORIES.map((c) => ({ ...c, items: list.filter((p) => p.cat === c.id) })) : [{ id: cat, label: cat === "all" ? "Results" : CATEGORIES.find((c) => c.id === cat).label, items: list }];
  const pick = (id) => { setCat(id); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="shop" id="shop">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">The Counter</p>
          <h2 className="sec-h">Everything in the <em>glass case</em>, online.</h2>
          <p className="muted sec-sub">Pick your treats, choose delivery or pickup, and pay on the site. Desserts are made fresh daily, so order early for the best choice.</p>
        </div>
      </div>
      <div className="chips-bar">
        <div className="wrap chips-bar__in">
          <label className="search">
            <Icon d={I.search} size={17} />
            <span className="sr">Search the menu</span>
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mousse, croissant, pistachio…" />
            {query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon d={I.close} size={15} /></button>}
          </label>
          <div className="chips" role="tablist" aria-label="Categories">
            <button role="tab" aria-selected={cat === "all"} className={"chip" + (cat === "all" ? " is-on" : "")} onClick={() => pick("all")}>All</button>
            {CATEGORIES.map((c) => <button key={c.id} role="tab" aria-selected={cat === c.id} className={"chip" + (cat === c.id ? " is-on" : "")} onClick={() => pick(c.id)}>{c.label}</button>)}
          </div>
        </div>
      </div>
      <div className="wrap">
        {groups.map((g, gi) => g.items.length > 0 && (
          <div className="group" key={g.id}>
            <div className="group__head">
              <span className="group__no">{String(gi + 1).padStart(2, "0")}</span>
              <h3 className="group__h">{g.label}</h3>
              {g.note && <p className="group__note">{g.note}</p>}
              <span className="group__count">{g.items.length} items</span>
            </div>
            <div className="grid">{g.items.map((p, i) => <Card key={p.id} i={i} p={p} qty={qtyOf(p.id)} soldOut={soldOut.includes(p.id)} onOpen={onOpen} onAdd={onAdd} />)}</div>
          </div>
        ))}
        {list.length === 0 && <p className="empty">Nothing matches “{query}”. Try “mousse” or “croissant”.</p>}
        <p className="fine">† Sample price for this demo. Other prices come from Nil’s published menu or 2026 customer reviews and may have changed.</p>
      </div>
    </section>
  );
}

function Sheet({ p, soldOut, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  useEffect(() => { const h = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  const shots = [p.img, p.alt].filter(Boolean);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={p.name} onClick={(e) => e.stopPropagation()}>
        <button className="sheet__x" onClick={onClose} aria-label="Close"><Icon d={I.close} /></button>
        <div className="sheet__media">
          <div className="arch arch--sheet">{shots.length ? <img src={shots[shot]} alt={p.name} /> : <Tile p={p} />}</div>
          {shots.length > 1 && <div className="dots">{shots.map((s, i) => <button key={s} className={i === shot ? "is-on" : ""} onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`} />)}</div>}
        </div>
        <div className="sheet__body">
          <p className="eyebrow">{CATEGORIES.find((c) => c.id === p.cat).label}{p.tag ? ` · ${p.tag}` : ""}</p>
          <h3 className="sheet__h">{p.name}</h3>
          <p className="sheet__price">{naira(p.price)} <small>per {p.unit}</small></p>
          <p className="src-note">{SRC_NOTE[p.src]}</p>
          <p className="sheet__desc">{p.desc}</p>
          {p.allergens && <p className="allergens"><b>Allergens:</b> {p.allergens.join(", ")}</p>}
          <p className="care"><Icon d={I.snow} size={15} /> Handmade daily and heat sensitive. Refrigerate as soon as it arrives.</p>
          <div className="sheet__buy">
            <div className="stepper">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">−</button>
              <output>{qty}</output>
              <button onClick={() => setQty(qty + 1)} aria-label="More">+</button>
            </div>
            <button className="btn btn--ink btn--grow" disabled={soldOut} onClick={() => { onAdd(p.id, qty); onClose(); }}>
              {soldOut ? "Sold out today" : <>Add · {naira(p.price * qty)}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- editorial ---------- */
function Story() {
  return (
    <section className="story">
      <div className="wrap story__grid">
        <figure className="story__img"><img src="/img/lineup.jpg" alt="Nil's Bakery mousse line-up: raspberry, mango, lemon, coffee, Ferrero, fraisier, berry pavlova, mango exotic and tiramisu" loading="lazy" /></figure>
        <div className="story__copy">
          <p className="eyebrow">The Nil’s way</p>
          <h2 className="sec-h">Desserts you look at twice <em>before the first bite.</em></h2>
          <ol className="steps">
            <li><span>i.</span><div><h4>Made by hand, every morning</h4><p>Everything in the case is prepared daily with carefully selected, mostly imported ingredients.</p></div></li>
            <li><span>ii.</span><div><h4>Real fruit, real flavour</h4><p>The mango tastes of mango, the lemon of lemon. The shape is the surprise, the flavour is honest.</p></div></li>
            <li><span>iii.</span><div><h4>Kept cool to your door</h4><p>Mousse cakes are heat sensitive, so deliveries go out chilled and timed to your slot.</p></div></li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Custom({ onSent }) {
  const [f, setF] = useState({ name: "", phone: "", occasion: "Birthday", date: "", servings: "10 – 15", notes: "" });
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const all = load(K.req, []);
    const r = { ...f, id: newCode("REQ", all), at: Date.now(), status: "New" };
    save(K.req, [r, ...all]); setDone(r); onSent?.();
  };
  return (
    <section className="custom" id="custom">
      <div className="wrap custom__grid">
        <div className="custom__art">
          <div className="arch"><img src="/img/gift-bag.jpg" alt="A customer receiving a white Nil's Bakery gift bag" loading="lazy" /></div>
          <div className="custom__badge"><p>Luxury cakes for every occasion by</p><a href={SHOP.instagramCakes} target="_blank" rel="noreferrer">@nilscakes_abuja</a></div>
        </div>
        <div>
          <p className="eyebrow">Celebration cakes</p>
          <h2 className="sec-h">Birthdays, weddings, <em>“he’s meeting my parents.”</em></h2>
          <p className="muted">Tell us about the day. Our cake team replies with a design sketch and a quote, and you pay the deposit right here on the site.</p>
          {done ? (
            <div className="done">
              <Icon d={I.check} size={28} />
              <h3>Request received</h3>
              <p>Your reference is <b className="code">{done.id}</b>. We’ll reach you on {done.phone} with a quote, usually within a few hours during opening times.</p>
              <button className="btn btn--line btn--sm" onClick={() => { setDone(null); setF({ ...f, notes: "" }); }}>Send another</button>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="form__row">
                <label>Your name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>
                <label>Phone<input required inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="080…" autoComplete="tel" /></label>
              </div>
              <div className="form__row">
                <label>Occasion<select value={f.occasion} onChange={set("occasion")}>{["Birthday", "Wedding", "Anniversary", "Children’s party", "Corporate", "Just because"].map((o) => <option key={o}>{o}</option>)}</select></label>
                <label>Date needed<input required type="date" value={f.date} onChange={set("date")} /></label>
              </div>
              <label>Guests<select value={f.servings} onChange={set("servings")}>{["Up to 10", "10 – 15", "15 – 30", "30 – 60", "60+"].map((o) => <option key={o}>{o}</option>)}</select></label>
              <label>Design ideas<textarea rows="3" value={f.notes} onChange={set("notes")} placeholder="Colours, flavours, theme, inscription…" /></label>
              <button className="btn btn--ink btn--block">Request a quote</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const quotes = [
    ["Nils Bakery Abuja is right up there with one of the best dessert bars I’ve ever been to.", "Slaylebrity, 2024"],
    ["The fruit-shaped cake had us staring at it for a good minute because why does it look exactly like a fruit?", "Instagram review, 2026"],
    ["Lotus tres leches, it was so soft, filled with milk and every bite was perfect.", "@prettyabuja, 2026"],
  ];
  return (
    <section className="reviews">
      <div className="wrap">
        <div className="reviews__score"><b>{SHOP.rating}</b><span>{"★★★★★"}</span><p>{SHOP.reviews} Google reviews</p></div>
        <div className="reviews__list">{quotes.map(([q, a]) => <blockquote key={a}><p>“{q}”</p><cite>{a}</cite></blockquote>)}</div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit" id="visit">
      <div className="wrap visit__grid">
        <div>
          <p className="eyebrow">Visit the bakery</p>
          <h2 className="sec-h">Royalty Square Mall, <em>Wuse 2.</em></h2>
          <ul className="facts">
            <li><Icon d={I.pin} /><div><b>Address</b><span>{SHOP.address}</span></div></li>
            <li><Icon d={I.clock} /><div><b>Opening hours</b><span>{SHOP.hours} · check Instagram for holiday hours</span></div></li>
            <li><Icon d={I.phone} /><div><b>Call or WhatsApp</b><a href={`tel:+${SHOP.phoneIntl}`}>{SHOP.phoneDisplay}</a></div></li>
          </ul>
          <div className="hero__cta">
            <a className="btn btn--ink" href={SHOP.maps} target="_blank" rel="noreferrer">Get directions</a>
            <a className="btn btn--line" href={SHOP.instagram} target="_blank" rel="noreferrer">@nilsbakery_abuja</a>
          </div>
        </div>
        <figure className="visit__img"><div className="arch"><img src="/img/easter-egg-mousse.jpg" alt="Egg-shaped mousse with a Nil's Bakery coffee cup" loading="lazy" /></div></figure>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <Wordmark />
        <div className="foot__links">
          <a href="#shop">Shop</a><a href="#custom">Custom cakes</a><a href="#orders">My orders</a><a href="#admin">Owner login</a>
        </div>
        <p className="foot__fine">Demo website concept for Nil’s Bakery Abuja. Payments run in test mode and no real orders are placed. Built by Sajdexx.</p>
      </div>
    </footer>
  );
}

/* ---------- cart + checkout ---------- */
function totals(lines, mode, zoneId) {
  const subtotal = lines.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
  const zone = ZONES.find((z) => z.id === zoneId);
  const fee = mode === "pickup" ? 0 : zone ? zone.fee : 0;
  return { subtotal, fee, total: subtotal + fee, zone };
}

function Drawer({ lines, setQty, onClose, onCheckout }) {
  const { subtotal } = totals(lines, "pickup");
  return (
    <div className="overlay overlay--side" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your bag" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__head"><h3>Your bag</h3><button className="ibtn" onClick={onClose} aria-label="Close"><Icon d={I.close} /></button></div>
        {lines.length === 0 ? (
          <div className="drawer__empty"><p className="serif-lg">Your bag is empty.</p><p className="muted">The raspberry mousse is our bestseller. Just saying.</p><button className="btn btn--ink" onClick={onClose}>Browse the counter</button></div>
        ) : (
          <>
            <ul className="lines">{lines.map((l) => { const p = byId[l.id]; return (
              <li key={l.id} className="line">
                <div className="line__img">{p.img ? <img src={p.img} alt="" /> : <span>{p.name.charAt(0)}</span>}</div>
                <div className="line__info"><b>{p.name}</b><small>{naira(p.price)} / {p.unit}</small>
                  <div className="stepper stepper--sm"><button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Fewer">−</button><output>{l.qty}</output><button onClick={() => setQty(l.id, l.qty + 1)} aria-label="More">+</button></div>
                </div>
                <b className="line__sum">{naira(p.price * l.qty)}</b>
              </li>); })}</ul>
            <div className="drawer__foot">
              <div className="sum"><span>Subtotal</span><b>{naira(subtotal)}</b></div>
              <p className="fine">Delivery is calculated at checkout.</p>
              <button className="btn btn--ink btn--block" onClick={onCheckout}>Checkout <Icon d={I.arrow} size={18} /></button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function PaystackModal({ amount, email, onSuccess, onClose }) {
  const [method, setMethod] = useState("Card");
  const [busy, setBusy] = useState(false);
  const pay = () => { setBusy(true); setTimeout(() => onSuccess(method), 1500); };
  return (
    <div className="overlay overlay--center" onClick={busy ? undefined : onClose}>
      <div className="ps" role="dialog" aria-modal="true" aria-label="Paystack payment (test mode)" onClick={(e) => e.stopPropagation()}>
        <div className="ps__top"><span className="ps__logo">paystack</span><span className="ps__test">TEST MODE</span></div>
        <p className="ps__mail">{email || "customer@example.com"}</p>
        <p className="ps__amt">Pay <b>{naira(amount)}</b></p>
        <div className="ps__tabs">{["Card", "Bank transfer", "USSD"].map((m) => <button key={m} className={m === method ? "is-on" : ""} onClick={() => setMethod(m)}>{m}</button>)}</div>
        {method === "Card" && <div className="ps__card"><input readOnly value="4084 0840 8408 4081" aria-label="Test card number" /><div><input readOnly value="12 / 30" aria-label="Expiry" /><input readOnly value="408" aria-label="CVV" /></div><small>Paystack test card. No money moves.</small></div>}
        {method === "Bank transfer" && <div className="ps__card"><p>Transfer to <b>Paystack-Titan 99 0000 0001</b></p><small>Test account. Tap below to simulate the transfer arriving.</small></div>}
        {method === "USSD" && <div className="ps__card"><p>Dial <b>*737*000*1234#</b></p><small>Test code. Tap below to simulate approval.</small></div>}
        <button className="btn btn--pay btn--block" onClick={pay} disabled={busy}>{busy ? "Processing…" : `Pay ${naira(amount)}`}</button>
        <p className="ps__secure"><Icon d={I.lock} size={13} /> Secured by Paystack · demo</p>
      </div>
    </div>
  );
}

function Checkout({ lines, onClose, onPlaced }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ name: "", phone: "", email: "", mode: "delivery", zone: "wuse2", address: "", day: "Today", slot: SLOTS[1], note: "", pay: "paystack" });
  const [err, setErr] = useState("");
  const [paying, setPaying] = useState(false);
  const t = totals(lines, d.mode, d.zone);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const next = () => {
    if (step === 1 && (!d.name.trim() || digits(d.phone).length < 10)) return setErr("Please add your name and an 11-digit phone number.");
    if (step === 2 && d.mode === "delivery" && !d.address.trim()) return setErr("Please add a delivery address.");
    setErr(""); setStep(step + 1);
  };
  const place = (paidWith) => {
    const all = load(K.orders, []);
    const o = {
      id: newCode("NB", all), at: Date.now(), name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim(),
      mode: d.mode, zone: d.mode === "delivery" ? t.zone.label : null, address: d.address.trim(), day: d.day, slot: d.slot, note: d.note.trim(),
      items: lines.map((l) => ({ id: l.id, name: byId[l.id].name, qty: l.qty, price: byId[l.id].price })),
      subtotal: t.subtotal, fee: t.fee, total: t.total,
      payment: paidWith ? `Paid · Paystack ${paidWith}` : d.mode === "pickup" ? "Pay at pickup" : "Pay on delivery",
      paid: !!paidWith, status: "Received", history: [{ s: "Received", at: Date.now() }],
    };
    save(K.orders, [o, ...all]);
    save(K.mine, [o.id, ...load(K.mine, [])]);
    onPlaced(o);
  };
  return (
    <div className="overlay overlay--side" onClick={onClose}>
      <aside className="drawer drawer--wide" role="dialog" aria-modal="true" aria-label="Checkout" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__head">
          <h3>Checkout</h3>
          <ol className="steps-mini">{["Details", "Delivery", "Payment"].map((s, i) => <li key={s} className={step >= i + 1 ? "is-on" : ""}>{s}</li>)}</ol>
          <button className="ibtn" onClick={onClose} aria-label="Close"><Icon d={I.close} /></button>
        </div>
        <div className="co">
          {step === 1 && (
            <div className="form">
              <label>Full name<input value={d.name} onChange={set("name")} autoComplete="name" /></label>
              <label>Phone (for delivery updates)<input inputMode="tel" value={d.phone} onChange={set("phone")} placeholder="0803 000 0000" autoComplete="tel" /></label>
              <label>Email (for your receipt, optional)<input type="email" value={d.email} onChange={set("email")} autoComplete="email" /></label>
            </div>
          )}
          {step === 2 && (
            <div className="form">
              <div className="seg" role="radiogroup" aria-label="Delivery or pickup">
                <button role="radio" aria-checked={d.mode === "delivery"} className={d.mode === "delivery" ? "is-on" : ""} onClick={() => setD({ ...d, mode: "delivery" })}>Delivery</button>
                <button role="radio" aria-checked={d.mode === "pickup"} className={d.mode === "pickup" ? "is-on" : ""} onClick={() => setD({ ...d, mode: "pickup", pay: d.pay === "cod" ? "cod" : d.pay })}>Pickup in Wuse 2</button>
              </div>
              {d.mode === "delivery" ? (
                <>
                  <label>Area<select value={d.zone} onChange={set("zone")}>{ZONES.map((z) => <option key={z.id} value={z.id}>{z.label} · {naira(z.fee)}</option>)}</select></label>
                  <label>Delivery address<textarea rows="2" value={d.address} onChange={set("address")} placeholder="House number, street, landmark" /></label>
                </>
              ) : <p className="pickup-note"><Icon d={I.pin} size={16} /> Collect from {SHOP.address}.</p>}
              <div className="form__row">
                <label>Day<select value={d.day} onChange={set("day")}>{["Today", "Tomorrow", "In 2 days"].map((x) => <option key={x}>{x}</option>)}</select></label>
                <label>Time<select value={d.slot} onChange={set("slot")}>{SLOTS.map((x) => <option key={x}>{x}</option>)}</select></label>
              </div>
              <label>Note for the bakery (optional)<input value={d.note} onChange={set("note")} placeholder="e.g. Happy birthday plaque, no nuts" /></label>
              <p className="fine">Delivery fees shown are sample fees for this demo.</p>
            </div>
          )}
          {step === 3 && (
            <div className="form">
              <div className="paychoice">
                <label className={d.pay === "paystack" ? "is-on" : ""}><input type="radio" name="pay" checked={d.pay === "paystack"} onChange={() => setD({ ...d, pay: "paystack" })} /><div><b>Pay now with Paystack</b><small>Card, bank transfer or USSD</small></div></label>
                <label className={d.pay === "cod" ? "is-on" : ""}><input type="radio" name="pay" checked={d.pay === "cod"} onChange={() => setD({ ...d, pay: "cod" })} /><div><b>{d.mode === "pickup" ? "Pay at pickup" : "Pay on delivery"}</b><small>Transfer or POS when it arrives</small></div></label>
              </div>
              <p className="care"><Icon d={I.snow} size={15} /> Our desserts are handmade daily and heat sensitive. Please refrigerate them as soon as they arrive. Allergens: kitchen handles eggs, milk, wheat, gluten, soy and nuts.</p>
            </div>
          )}
          {err && <p className="err" role="alert">{err}</p>}
        </div>
        <div className="drawer__foot">
          <div className="sum sum--sm"><span>Subtotal</span><span>{naira(t.subtotal)}</span></div>
          <div className="sum sum--sm"><span>{d.mode === "pickup" ? "Pickup" : `Delivery · ${t.zone?.label}`}</span><span>{t.fee ? naira(t.fee) : "Free"}</span></div>
          <div className="sum"><span>Total</span><b>{naira(t.total)}</b></div>
          <div className="co__btns">
            {step > 1 && <button className="btn btn--line" onClick={() => { setErr(""); setStep(step - 1); }}>Back</button>}
            {step < 3 && <button className="btn btn--ink btn--grow" onClick={next}>Continue</button>}
            {step === 3 && <button className="btn btn--ink btn--grow" onClick={() => (d.pay === "paystack" ? setPaying(true) : place(null))}>{d.pay === "paystack" ? `Pay ${naira(t.total)}` : "Place order"}</button>}
          </div>
        </div>
        {paying && <PaystackModal amount={t.total} email={d.email} onClose={() => setPaying(false)} onSuccess={(m) => { setPaying(false); place(m); }} />}
      </aside>
    </div>
  );
}

function Tracker({ status }) {
  const at = STATUSES.indexOf(status);
  return <ol className="track">{STATUSES.map((s, i) => <li key={s} className={i <= at ? "is-on" : ""}><span />{s}</li>)}</ol>;
}

function Confirmation({ order, onClose }) {
  const copy = () => navigator.clipboard?.writeText(order.id);
  return (
    <div className="overlay overlay--center" onClick={onClose}>
      <div className="confirm" role="dialog" aria-modal="true" aria-label="Order confirmed" onClick={(e) => e.stopPropagation()}>
        <div className="confirm__seal"><Icon d={I.check} size={30} /></div>
        <p className="eyebrow">Thank you, {order.name.split(" ")[0]}</p>
        <h3 className="confirm__h">Your order is in.</h3>
        <p className="muted">Keep this code. Use it with your phone number on <b>My orders</b> to check progress.</p>
        <button className="code code--big" onClick={copy} title="Copy code">{order.id}</button>
        <Tracker status={order.status} />
        <div className="confirm__meta">
          <p><span>{order.mode === "pickup" ? "Pickup" : "Delivery"}</span><b>{order.day}, {order.slot}</b></p>
          <p><span>Payment</span><b>{order.payment}</b></p>
          <p><span>Total</span><b>{naira(order.total)}</b></p>
        </div>
        <div className="co__btns">
          <a className="btn btn--line" href="#orders" onClick={onClose}>My orders</a>
          <button className="btn btn--ink btn--grow" onClick={onClose}>Back to the counter</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- my orders ---------- */
function MyOrders({ onBack }) {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [found, setFound] = useState(null);
  const [miss, setMiss] = useState(false);
  const mine = load(K.mine, []);
  const all = load(K.orders, []);
  const recent = all.filter((o) => mine.includes(o.id)).slice(0, 5);
  const find = (e) => {
    e.preventDefault();
    const o = all.find((x) => x.id.toUpperCase() === code.trim().toUpperCase() && digits(x.phone) === digits(phone));
    setFound(o || null); setMiss(!o);
  };
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <button className="back" onClick={onBack}>← Back to the counter</button>
        <p className="eyebrow">My orders</p>
        <h1 className="sec-h">Find your order.</h1>
        <p className="muted">No account needed. Enter the code from your confirmation and the phone number you ordered with.</p>
        <form className="form form--card" onSubmit={find}>
          <div className="form__row">
            <label>Order code<input value={code} onChange={(e) => setCode(e.target.value)} placeholder="NB-1113-AB2C" required /></label>
            <label>Phone<input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" required /></label>
          </div>
          <button className="btn btn--ink btn--block">Find order</button>
        </form>
        {miss && <p className="err" role="alert">We couldn’t find that code with that phone number. Check both and try again.</p>}
        {found && <OrderCard o={found} />}
        {recent.length > 0 && !found && (
          <div className="recent"><h3 className="group__h">On this phone</h3>{recent.map((o) => <OrderCard key={o.id} o={o} />)}</div>
        )}
      </div>
    </main>
  );
}
function OrderCard({ o }) {
  return (
    <article className="ocard">
      <div className="ocard__top"><b className="code">{o.id}</b><span className={"pill" + (o.paid ? " pill--ok" : "")}>{o.paid ? "Paid" : "Payment due"}</span></div>
      <p className="muted small">{when(o.at)} · {o.mode === "pickup" ? "Pickup" : `Delivery to ${o.zone}`} · {o.day}, {o.slot}</p>
      <Tracker status={o.status} />
      <ul className="ocard__items">{o.items.map((i) => <li key={i.id}><span>{i.qty} × {i.name}</span><span>{naira(i.qty * i.price)}</span></li>)}</ul>
      <p className="ocard__total"><span>Total</span><b>{naira(o.total)}</b></p>
    </article>
  );
}

/* ---------- owner dashboard ---------- */
const DEMO = { email: "owner@nilsbakery.demo", pw: "nils2026" };
const isOwner = () => { try { const s = JSON.parse(sessionStorage.getItem(K.owner)); return s && s.exp > Date.now(); } catch { return false; } };

function Login({ onIn, onBack }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const go = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === DEMO.email && pw === DEMO.pw) { sessionStorage.setItem(K.owner, JSON.stringify({ exp: Date.now() + 8 * 3600e3 })); onIn(); }
    else setErr("That email and password don’t match.");
  };
  return (
    <main className="page page--center">
      <form className="login" onSubmit={go}>
        <Wordmark />
        <h1 className="login__h">Owner dashboard</h1>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn btn--ink btn--block">Sign in</button>
        <p className="fine">Demo login: {DEMO.email} / {DEMO.pw}</p>
        <button type="button" className="back" onClick={onBack}>← Back to the shop</button>
      </form>
    </main>
  );
}

function seedDemo() {
  const now = Date.now();
  const mk = (id, mins, name, phone, mode, zone, items, status, paid) => {
    const subtotal = items.reduce((s, [pid, q]) => s + byId[pid].price * q, 0);
    const fee = mode === "pickup" ? 0 : ZONES.find((z) => z.label === zone).fee;
    return { id, at: now - mins * 60e3, name, phone, email: "", mode, zone: mode === "pickup" ? null : zone, address: mode === "pickup" ? "" : "Sample address", day: "Today", slot: SLOTS[2], note: "", items: items.map(([pid, q]) => ({ id: pid, name: byId[pid].name, qty: q, price: byId[pid].price })), subtotal, fee, total: subtotal + fee, payment: paid ? "Paid · Paystack Card" : "Pay on delivery", paid, status, history: [{ s: status, at: now - mins * 60e3 }], demo: true };
  };
  return [
    mk("NB-DEMO-7KQ2", 25, "Amina Bello", "08031234567", "delivery", "Maitama", [["raspberry-mousse", 2], ["fruit-pops", 1]], "Being prepared", true),
    mk("NB-DEMO-3HX8", 70, "Tunde Okafor", "08127654321", "pickup", null, [["croissant", 4], ["san-sebastian", 1]], "Ready / Out for delivery", false),
    mk("NB-DEMO-9PLM", 190, "Zainab Musa", "07065432198", "delivery", "Gwarinpa / Life Camp", [["baklava-mousse", 1], ["choc-chip-cookie", 3]], "Delivered", true),
  ];
}

function Admin({ onOut, onBack }) {
  const [orders, setOrders] = useState(() => load(K.orders, []));
  const [reqs, setReqs] = useState(() => load(K.req, []));
  const [sold, setSold] = useState(() => load(K.sold, []));
  const [tab, setTab] = useState("orders");
  const [filter, setFilter] = useState("Open");
  useEffect(() => { const h = () => { setOrders(load(K.orders, [])); setReqs(load(K.req, [])); }; window.addEventListener("storage", h); window.addEventListener("focus", h); return () => { window.removeEventListener("storage", h); window.removeEventListener("focus", h); }; }, []);
  const patch = (id, ch) => { const o = orders.map((x) => (x.id === id ? { ...x, ...ch, history: ch.status ? [...(x.history || []), { s: ch.status, at: Date.now() }] : x.history } : x)); setOrders(o); save(K.orders, o); };
  const today = orders.filter((o) => new Date(o.at).toDateString() === new Date().toDateString());
  const revenue = today.filter((o) => o.paid).reduce((s, o) => s + o.total, 0);
  const open = orders.filter((o) => o.status !== "Delivered");
  const shown = filter === "Open" ? open : filter === "Unpaid" ? orders.filter((o) => !o.paid) : orders;
  const toggleSold = (id) => { const s = sold.includes(id) ? sold.filter((x) => x !== id) : [...sold, id]; setSold(s); save(K.sold, s); };
  const best = useMemo(() => {
    const c = {}; orders.forEach((o) => o.items.forEach((i) => { c[i.name] = (c[i.name] || 0) + i.qty; }));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [orders]);
  const loadDemo = () => { const o = [...seedDemo(), ...orders.filter((x) => !x.demo)]; setOrders(o); save(K.orders, o); };
  return (
    <main className="admin">
      <header className="admin__bar">
        <div className="wrap admin__bar-in">
          <Wordmark small onClick={(e) => { e.preventDefault(); onBack(); }} />
          <span className="admin__title">Owner dashboard</span>
          <button className="btn btn--line btn--sm" onClick={onOut}>Sign out</button>
        </div>
      </header>
      <div className="wrap">
        <div className="stats">
          <div className="stat"><span>Orders today</span><b>{today.length}</b></div>
          <div className="stat"><span>Paid today</span><b>{naira(revenue)}</b></div>
          <div className="stat"><span>Open orders</span><b>{open.length}</b></div>
          <div className="stat"><span>Cake requests</span><b>{reqs.filter((r) => r.status === "New").length}</b></div>
        </div>
        {best.length > 0 && <p className="best">Best sellers: {best.map(([n, q]) => `${n} (${q})`).join(" · ")}</p>}
        <div className="tabs">{[["orders", "Orders"], ["requests", "Cake requests"], ["menu", "Menu & stock"]].map(([k, l]) => <button key={k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>

        {tab === "orders" && (
          <>
            <div className="filters">{["Open", "Unpaid", "All"].map((f) => <button key={f} className={"chip" + (filter === f ? " is-on" : "")} onClick={() => setFilter(f)}>{f}</button>)}
              {orders.length === 0 && <button className="btn btn--line btn--sm" onClick={loadDemo}>Load sample orders</button>}
            </div>
            {shown.length === 0 && <p className="empty">No orders here yet. Place one from the shop, or load sample orders.</p>}
            <div className="olist">{shown.map((o) => (
              <article key={o.id} className="arow">
                <div className="arow__head"><b className="code">{o.id}</b><span className="muted small">{when(o.at)}</span></div>
                <p className="arow__who"><b>{o.name}</b> · <a href={`tel:${o.phone}`}>{o.phone}</a></p>
                <p className="small muted">{o.mode === "pickup" ? "Pickup" : `Delivery · ${o.zone} · ${o.address}`} · {o.day}, {o.slot}{o.note ? ` · “${o.note}”` : ""}</p>
                <ul className="arow__items">{o.items.map((i) => <li key={i.id}>{i.qty} × {i.name}</li>)}</ul>
                <div className="arow__foot">
                  <b>{naira(o.total)}</b>
                  <button className={"pill pill--btn" + (o.paid ? " pill--ok" : "")} onClick={() => patch(o.id, { paid: !o.paid, payment: !o.paid ? "Paid · confirmed by owner" : o.payment })}>{o.paid ? "Paid" : "Mark paid"}</button>
                  <select value={o.status} onChange={(e) => patch(o.id, { status: e.target.value })} aria-label={`Status for ${o.id}`}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </article>
            ))}</div>
          </>
        )}

        {tab === "requests" && (
          <div className="olist">
            {reqs.length === 0 && <p className="empty">No custom cake requests yet. They appear here when customers use the form.</p>}
            {reqs.map((r) => (
              <article key={r.id} className="arow">
                <div className="arow__head"><b className="code">{r.id}</b><span className="muted small">{when(r.at)}</span></div>
                <p className="arow__who"><b>{r.name}</b> · <a href={`tel:${r.phone}`}>{r.phone}</a></p>
                <p className="small">{r.occasion} · {r.date} · {r.servings} guests</p>
                {r.notes && <p className="small muted">“{r.notes}”</p>}
                <div className="arow__foot">
                  <a className="btn btn--line btn--sm" href={`https://wa.me/234${digits(r.phone)}`} target="_blank" rel="noreferrer">Reply on WhatsApp</a>
                  <select value={r.status} onChange={(e) => { const n = reqs.map((x) => (x.id === r.id ? { ...x, status: e.target.value } : x)); setReqs(n); save(K.req, n); }}>{["New", "Quoted", "Deposit paid", "Done"].map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "menu" && (
          <div className="stock">
            <p className="muted small">Mark items sold out for today. Customers see “Sold out today” and can’t add them.</p>
            {CATEGORIES.map((c) => (
              <div key={c.id} className="stock__group"><h4>{c.label}</h4>
                {PRODUCTS.filter((p) => p.cat === c.id).map((p) => (
                  <label key={p.id} className="stock__row"><span>{p.name}<small> {naira(p.price)}</small></span>
                    <input type="checkbox" className="switch" checked={!sold.includes(p.id)} onChange={() => toggleSold(p.id)} aria-label={`${p.name} available`} />
                  </label>
                ))}
              </div>
            ))}
          </div>
        )}
        <p className="fine">Demo: orders are saved in this browser only. A live version would sync to a database and send SMS/WhatsApp updates.</p>
      </div>
    </main>
  );
}

/* ---------- app ---------- */
export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [splash, setSplash] = useState(() => !sessionStorage.getItem("nb-splash") && !window.location.hash.startsWith("#admin"));
  const [lines, setLines] = useState(() => load(K.cart, []).filter((l) => byId[l.id]));
  const [open, setOpen] = useState(null);
  const [cart, setCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [owner, setOwner] = useState(isOwner);
  const [sold, setSold] = useState(() => load(K.sold, []));
  const searchRef = useRef(null);

  useEffect(() => { const h = () => { setRoute(window.location.hash); setSold(load(K.sold, [])); }; window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  useEffect(() => save(K.cart, lines), [lines]);
  useEffect(() => { document.body.style.overflow = open || cart || checkout || placed ? "hidden" : ""; }, [open, cart, checkout, placed]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 1800); return () => clearTimeout(t); }, [toast]);

  const endSplash = () => { sessionStorage.setItem("nb-splash", "1"); setSplash(false); };
  const add = (id, q = 1) => { setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + q } : l)) : [...ls, { id, qty: q }])); setToast(`${byId[id].name} added`); };
  const setQty = (id, q) => setLines((ls) => (q < 1 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: q } : l))));
  const qtyOf = (id) => lines.find((l) => l.id === id)?.qty || 0;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
  const home = () => { window.location.hash = ""; window.scrollTo(0, 0); };
  const focusSearch = () => { document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => searchRef.current?.focus(), 500); };

  if (route.startsWith("#admin")) return owner ? <Admin onOut={() => { sessionStorage.removeItem(K.owner); setOwner(false); }} onBack={home} /> : <Login onIn={() => setOwner(true)} onBack={home} />;

  const wa = (
    <a className={"wa" + (count > 0 ? " wa--up" : "")} href={waLink("Hello Nil's Bakery, I have a question about an order.")} target="_blank" rel="noreferrer" aria-label="Chat with Nil's Bakery on WhatsApp">
      <WaIcon /><span>Questions? Chat with us</span>
    </a>
  );

  return (
    <>
      {splash && <Splash onDone={endSplash} />}
      <Ticker />
      <Header count={count} onCart={() => setCart(true)} onSearch={route === "#orders" ? home : focusSearch} />
      {route === "#orders" ? <MyOrders onBack={home} /> : (
        <main>
          <Hero />
          <Shop qtyOf={qtyOf} soldOut={sold} onOpen={setOpen} onAdd={(id) => add(id)} query={query} setQuery={setQuery} searchRef={searchRef} />
          <Story />
          <Reviews />
          <Custom />
          <Visit />
        </main>
      )}
      <Footer />
      {count > 0 && !cart && !checkout && (
        <button className="cartbar" onClick={() => setCart(true)}>
          <span className="cartbar__n">{count}</span><span>View bag</span><b>{naira(subtotal)}</b>
        </button>
      )}
      {wa}
      {toast && <div className="toast" role="status">{toast}</div>}
      {open && <Sheet p={open} soldOut={sold.includes(open.id)} onClose={() => setOpen(null)} onAdd={add} />}
      {cart && <Drawer lines={lines} setQty={setQty} onClose={() => setCart(false)} onCheckout={() => { setCart(false); setCheckout(true); }} />}
      {checkout && <Checkout lines={lines} onClose={() => setCheckout(false)} onPlaced={(o) => { setCheckout(false); setLines([]); setPlaced(o); }} />}
      {placed && <Confirmation order={placed} onClose={() => setPlaced(null)} />}
    </>
  );
}
