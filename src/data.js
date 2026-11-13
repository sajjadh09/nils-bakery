// Nil's Bakery Abuja: demo catalogue.
// Price sources (src):
//   "menu"   = Nil's Bakery digital menu on leggimenu.it (https://www.leggimenu.it/menu/nilsbakery). Listing appears to date from late 2024; prices may have changed.
//   "review" = @prettyabuja review post, July 2026 (Fruit Pops, cake cans, Lotus tres leches, chocolate & mango cheesecake).
//   "sample" = no published price found. Sample price for the demo only.
// Photos are Nil's own Instagram (@nilsbakery_abuja) and menu photos. Items without a photo use a typographic tile.

export const SHOP = {
  name: "Nil's Bakery",
  city: "Abuja",
  address: "Royalty Square Mall, 2 Sakono St, Wuse 2, Abuja",
  phoneDisplay: "0704 665 5000",
  phoneIntl: "2347046655000",
  instagram: "https://www.instagram.com/nilsbakery_abuja",
  instagramCakes: "https://www.instagram.com/nilscakes_abuja",
  maps: "https://www.google.com/maps/search/?api=1&query=Nil%27s+Bakery+2+Sakono+St+Wuse+2+Abuja",
  hours: "10AM – 7PM",
  rating: 4.7,
  reviews: 73,
};

export const CATEGORIES = [
  { id: "mousse", label: "Mousse Cakes", note: "Trompe-l'œil desserts that look like the fruit they taste of." },
  { id: "cheesecake", label: "Cheesecakes & Slices", note: "Basque, baked and layered, by the slice." },
  { id: "cups", label: "Cups, Cans & Pops", note: "Spoonable desserts and the viral fruit pops." },
  { id: "pastry", label: "Croissants & Choux", note: "Buttery viennoiserie, éclairs and cream puffs." },
  { id: "tarts", label: "Tarts", note: "Crisp buttery shells, silky fillings." },
  { id: "cookies", label: "Cookies & Brownies", note: "Levain-style cookies, filled and fudgy." },
  { id: "cupcakes", label: "Cupcakes", note: "Soft sponge, generous frosting." },
];

const P = (id, cat, name, price, src, extra = {}) => ({ id, cat, name, price, src, ...extra });
const GEM = ["Gluten", "Eggs", "Milk"];

export const PRODUCTS = [
  // Mousse cakes
  P("strawberry-mousse", "mousse", "Realistic Strawberry Mousse", 15000, "sample", { img: "/img/strawberry-mousse.jpg", alt: "/img/strawberry-inside.jpg", tag: "New", unit: "piece", desc: "Thought it was a strawberry? Think again. A glossy strawberry mousse with a molten strawberry heart." }),
  P("raspberry-mousse", "mousse", "Raspberry Mousse Cake", 15000, "sample", { img: "/img/raspberry-mousse.jpg", alt: "/img/raspberry-close.jpg", tag: "Bestseller", unit: "piece", desc: "Creamy white chocolate mousse filled with house-made raspberry. Our most-picked mousse cake." }),
  P("baklava-mousse", "mousse", "Baklava Mousse", 15000, "sample", { img: "/img/baklava-mousse.jpg", alt: "/img/baklava-inside.jpg", tag: "New", unit: "piece", desc: "Mirror-glazed dome over a pistachio baklava crunch, with a soft caramel centre." }),
  P("cookie-mousse", "mousse", "Cookie Mousse", 15000, "sample", { img: "/img/cookie-mousse.jpg", alt: "/img/cookie-mousse-box.jpg", unit: "piece", desc: "Soft cookie, creamy white chocolate mousse, homemade caramel and a rich chocolate crunch." }),
  P("lemon-mousse", "mousse", "Lemon Shaped Mousse Cake", 15000, "menu", { img: "/img/lemon-mousse.jpg", unit: "piece", allergens: ["Milk"], desc: "A zesty lemon mousse dressed as the fruit itself, leaf and all." }),
  P("mango-mousse", "mousse", "Mango Mousse", 15000, "sample", { img: "/img/mango-mousse.jpg", unit: "piece", desc: "Blushing mango-shaped mousse with a tropical mango centre." }),
  P("orange-mousse", "mousse", "Orange Shaped Mousse Cake", 15000, "menu", { img: "/img/orange-mousse.jpg", unit: "piece", allergens: ["Milk"], desc: "Velvet-sprayed orange mousse, as photographed in our display case." }),
  P("ferrero-mousse", "mousse", "Ferrero Mousse", 15000, "sample", { img: "/img/ferrero-mousse.jpg", unit: "piece", desc: "Hazelnut praline and milk chocolate mousse, sealed with the Nil's monogram." }),
  P("coffee-mousse", "mousse", "Coffee Mousse", 15000, "sample", { img: "/img/coffee-mousse.jpg", unit: "piece", desc: "A coffee bean you can eat: coffee mousse in a dark chocolate shell." }),
  P("mango-exotic", "mousse", "Mango Exotic", 15000, "sample", { img: "/img/mango-exotic.jpg", unit: "piece", desc: "Sunny mango sponge, whipped cream and fresh mango cubes." }),
  P("apple-mousse", "mousse", "Apple Shaped Mousse Cake", 15000, "menu", { unit: "piece", allergens: ["Milk"], desc: "Crisp green apple mousse, shaped like the real thing." }),
  P("red", "mousse", "Red", 15000, "menu", { unit: "piece", allergens: [...GEM, "Nuts"], desc: "Vanilla crémeux, strawberry coulis, yoghurt panna cotta and almond sponge." }),
  P("namaleka", "mousse", "Namaleka", 15000, "menu", { unit: "piece", allergens: [...GEM, "Nuts"], desc: "Namaleka cream, coffee mousse, chocolate crunch and sablé cookie." }),
  P("zefir", "mousse", "Zefir", 15000, "menu", { unit: "piece", desc: "Chantilly mousse cake with coconut sponge and pineapple filling." }),
  P("medovik", "mousse", "Medovik Cake", 11000, "menu", { unit: "slice", allergens: GEM, desc: "Multi-layered Russian honey cake." }),
  P("banana-roll", "mousse", "Banana Roll Cake", 10000, "menu", { unit: "piece", allergens: GEM, desc: "Vanilla sponge filled with cream and rolled around banana." }),

  // Cheesecakes & slices
  P("san-sebastian", "cheesecake", "San Sebastián Cheesecake", 16000, "menu", { img: "/img/san-sebastian.jpg", tag: "Top seller", unit: "slice", allergens: ["Milk", "Eggs"], desc: "Traditional Spanish Basque cheesecake: caramelised crust, creamy centre." }),
  P("chocolate-cheesecake", "cheesecake", "Chocolate Cheesecake", 17000, "review", { tag: "New", unit: "piece", desc: "Soft, fluffy chocolate cheesecake, a new addition to the menu." }),
  P("mango-cheesecake", "cheesecake", "Mango Cheesecake", 17000, "review", { unit: "piece", desc: "Back on the menu and improved: light cheesecake with real mango." }),
  P("lotus-cheesecake", "cheesecake", "Lotus Biscoff Cheesecake", 12000, "menu", { unit: "piece", allergens: GEM, desc: "Cheesecake with a creamy Lotus sauce." }),
  P("raspberry-cheesecake", "cheesecake", "Raspberry Cheesecake", 12000, "menu", { unit: "piece", desc: "Cheesecake with homemade raspberry sauce." }),
  P("blueberry-cheesecake", "cheesecake", "Blueberry Cheesecake", 12000, "menu", { unit: "piece", allergens: [...GEM, "Nuts"], desc: "Cheesecake with blueberry sauce." }),
  P("fraisier", "cheesecake", "Fraisier Cake", 12000, "sample", { img: "/img/fraisier-cake.jpg", unit: "piece", desc: "Classic French strawberry cake: sponge, crème mousseline and a wall of fresh strawberries." }),
  P("berry-pavlova", "cheesecake", "Berry Pavlova", 12000, "sample", { img: "/img/berry-pavlova.jpg", unit: "piece", desc: "Crisp meringue, whipped cream and fresh berries." }),

  // Cups, cans & pops
  P("fruit-pops", "cups", "Fruit Ice Cream Pops", 25000, "review", { img: "/img/fruit-pops.jpg", tag: "Viral", unit: "tub", desc: "A tub of mini fruit-shaped ice creams: strawberry, banana, mango, passion fruit, lemon, raspberry, blackberry and cacao." }),
  P("dubai-can", "cups", "Dubai Chocolate Cake Can", 15000, "review", { tag: "Viral", unit: "can", desc: "The viral Dubai chocolate, layered as a cake in a can." }),
  P("red-velvet-can", "cups", "Red Velvet Cake Can", 15000, "review", { unit: "can", desc: "Fluffy red velvet layered with cream cheese, in a can." }),
  P("lotus-tres-leches", "cups", "Lotus Tres Leches", 14000, "review", { img: "/img/lotus-tres-leches.jpg", unit: "box", desc: "Milk-soaked sponge with Lotus cream. Soft in every bite." }),
  P("tiramisu-cup", "cups", "Tiramisu in a Coffee Cup", 12000, "sample", { img: "/img/tiramisu-cup.jpg", unit: "piece", desc: "Coffee-dipped ladyfingers and mascarpone, served in an edible-looking coffee cup." }),
  P("tres-leches", "cups", "Tres Leches Cake", 10000, "menu", { unit: "piece", allergens: GEM, desc: "Portioned tres leches cake in different flavours." }),
  P("profiteroles", "cups", "Profiteroles", 10000, "menu", { unit: "piece", allergens: GEM, desc: "Choux pastry filled with cream and covered in rich chocolate sauce." }),

  // Croissants & choux
  P("croissant", "pastry", "Classic French Croissant", 6000, "menu", { img: "/img/croissant.jpg", unit: "piece", allergens: GEM, desc: "Classic buttery French croissant." }),
  P("almond-croissant", "pastry", "Almond Croissant", 7000, "menu", { unit: "piece", allergens: [...GEM, "Nuts"], desc: "Topped with toasted almonds and filled with sweet almond cream." }),
  P("pain-au-chocolat", "pastry", "Pain au Chocolat", 7000, "menu", { unit: "piece", allergens: GEM, desc: "Croissant dough wrapped around dark chocolate sticks." }),
  P("crookie", "pastry", "Crookie", 8500, "menu", { unit: "piece", allergens: GEM, desc: "Fresh croissant filled with cookie dough." }),
  P("new-york-roll", "pastry", "New York Roll", 9000, "menu", { unit: "piece", desc: "Circular croissant filled and topped with cream." }),
  P("madeleines", "pastry", "Madeleines", 3000, "menu", { unit: "piece", desc: "French madeleines in different flavours." }),
  P("mini-eclair", "pastry", "Mini Éclair", 2000, "menu", { unit: "piece", allergens: GEM, desc: "Mini chocolate-covered éclair." }),
  P("eclair", "pastry", "Classic French Éclair", 10000, "menu", { unit: "piece", desc: "Choux, crème pâtissière and a glossy glaze." }),
  P("cream-puff", "pastry", "Cream Puff", 8000, "menu", { unit: "piece", allergens: GEM, desc: "Choux baked with crisp craquelin, filled with different flavours." }),
  P("paris-brest", "pastry", "Paris-Brest", 12000, "menu", { unit: "piece", allergens: [...GEM, "Nuts"], desc: "Choux ring filled with praline cream." }),

  // Tarts
  P("chocolate-tart", "tarts", "Chocolate Tart", 11000, "menu", { unit: "piece", allergens: GEM, desc: "Buttery tart filled with chocolate ganache." }),
  P("lemon-tart", "tarts", "Lemon Tart", 11000, "menu", { unit: "piece", allergens: GEM, desc: "Buttery tartlet with lemon curd." }),
  P("pistachio-raspberry-tart", "tarts", "Pistachio Raspberry Tart", 12000, "menu", { unit: "piece", allergens: GEM, desc: "Pistachio ganache and raspberry filling." }),
  P("vanilla-tart", "tarts", "Vanilla Tart", 11000, "menu", { unit: "piece", allergens: GEM, desc: "Buttery tartlet with vanilla cream." }),

  // Cookies & brownies
  P("choc-chip-cookie", "cookies", "Chocolate Chip Cookie", 7000, "menu", { img: "/img/choc-chip-cookie.jpg", unit: "piece", allergens: [...GEM, "Nuts"], desc: "Levain-style chocolate chip cookie with a gooey Nutella centre." }),
  P("choc-pistachio-cookie", "cookies", "Chocolate Pistachio Cookie", 7000, "sample", { img: "/img/cookie-trio.jpg", tag: "New", unit: "piece", desc: "Chocolate cookie with a creamy pistachio filling. Part of the Cookie Trio." }),
  P("red-velvet-cookie", "cookies", "Red Velvet Cookie", 7000, "sample", { unit: "piece", desc: "Red velvet cookie with smooth cream cheese inside." }),
  P("brownie", "cookies", "Brownie", 8000, "menu", { unit: "piece", desc: "Rich chocolate brownie." }),
  P("white-brownie", "cookies", "White Chocolate Brownie", 8500, "menu", { unit: "piece", allergens: GEM, desc: "Fudgy white chocolate brownie." }),
  P("lotus-brownie", "cookies", "Lotus Brownie", 8500, "menu", { unit: "piece", allergens: GEM, desc: "Brownie with Lotus Biscoff." }),

  // Cupcakes
  P("lemon-cupcake", "cupcakes", "Lemon Cupcake", 6000, "menu", { unit: "piece", allergens: GEM, desc: "Lemon sponge, lemon frosting." }),
  P("chocolate-cupcake", "cupcakes", "Chocolate Cupcake", 6000, "menu", { unit: "piece", allergens: GEM, desc: "Chocolate sponge, chocolate frosting." }),
  P("strawberry-cupcake", "cupcakes", "Strawberry Cupcake", 6000, "menu", { unit: "piece", allergens: GEM, desc: "Strawberry sponge, strawberry frosting." }),
  P("marshmallow-cupcake", "cupcakes", "Chocolate Covered Marshmallow Cupcake", 6000, "menu", { unit: "piece", allergens: GEM, desc: "Topped with a chocolate-dipped marshmallow." }),
];

// Delivery zones and fees are SAMPLES for the demo (Nil's publishes no delivery price list).
export const ZONES = [
  { id: "wuse2", label: "Wuse 2 / Wuse", fee: 2000 },
  { id: "maitama", label: "Maitama", fee: 2500 },
  { id: "garki", label: "Garki / Area 11", fee: 3000 },
  { id: "asokoro", label: "Asokoro", fee: 3500 },
  { id: "jabi", label: "Jabi / Utako / Mabushi", fee: 3000 },
  { id: "katampe", label: "Katampe / Jahi / Guzape", fee: 3500 },
  { id: "gwarinpa", label: "Gwarinpa / Life Camp", fee: 4500 },
  { id: "lokogoma", label: "Lokogoma / Apo / Gudu", fee: 4500 },
  { id: "lugbe", label: "Lugbe / Airport Road", fee: 6000 },
  { id: "kubwa", label: "Kubwa", fee: 6000 },
];

export const SLOTS = ["10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 18:00", "18:00 – 19:00"];

export const naira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");

export const SRC_NOTE = {
  menu: "Price from Nil's published digital menu",
  review: "Price as reported in a 2026 customer review",
  sample: "Sample price for this demo",
};
