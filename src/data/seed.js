/* ============================================================
   HUNARHUB — SEED DATA
   Realistic Indian micro-entrepreneur marketplace demo data.
   All state mutations go through the store (StoreContext).
   Image paths reference /images/* downloaded into public/images.
   ============================================================ */

export const CATEGORIES = [
  { id: 'cobbler', index: '01', name: 'Cobblers', tagline: 'Shoe repair, resoling & custom footwear', image: '/images/workshop-cobbler.jpg' },
  { id: 'potter', index: '02', name: 'Potters', tagline: 'Hand-thrown ceramics & clay craft', image: '/images/workshop-pottery.jpg' },
  { id: 'tailor', index: '03', name: 'Tailors', tagline: 'Stitching, alterations & custom garments', image: '/images/workshop-tailor.jpg' },
  { id: 'artisan', index: '04', name: 'Artisans', tagline: 'Leather, metal, textile & craft work', image: '/images/product-jewelry.jpg' },
  { id: 'vendor', index: '05', name: 'Local Vendors', tagline: 'Spices, food & everyday essentials', image: '/images/product-masala.jpg' },
];

export const USERS = [
  { id: 'usr-customer', name: 'Aarav Sharma', email: 'customer@hunarhub.demo', role: 'customer', location: 'Jaipur, Rajasthan', joinedAt: '2026-01-14' },
  { id: 'usr-seller', name: 'Meena Kumari', email: 'seller@hunarhub.demo', role: 'entrepreneur', entrepreneurId: 'ent-meena', location: 'Jaipur, Rajasthan', joinedAt: '2025-11-02' },
  { id: 'usr-admin', name: 'HunarHub Admin', email: 'admin@hunarhub.demo', role: 'admin', location: 'New Delhi', joinedAt: '2025-09-01' },
];

export const DEMO_CREDENTIALS = [
  { email: 'customer@hunarhub.demo', role: 'customer', label: 'Customer demo account' },
  { email: 'seller@hunarhub.demo', role: 'entrepreneur', label: 'Maker demo account' },
  { email: 'admin@hunarhub.demo', role: 'admin', label: 'Admin demo account' },
];

export const ENTREPRENEURS = [
  {
    id: 'ent-meena', name: 'Meena Kumari', businessName: 'Meena Pottery',
    category: 'potter', categoryLabel: 'Potter / Ceramic Artist',
    city: 'Jaipur', state: 'Rajasthan',
    bio: 'Third-generation potter from the blue pottery lanes of Jaipur. I hand-throw every piece on the wheel — no moulds, no shortcuts — using clay from the Sanganer riverbed. My studio also trains young women from the neighbourhood in traditional Rajasthani pottery.',
    experience: 12, rating: 4.9, reviewCount: 87, profileViews: 1284,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-meena.jpg',
    gallery: ['/images/workshop-pottery.jpg', '/images/product-vase.jpg', '/images/product-kulhad.jpg'],
    skills: ['Wheel throwing', 'Blue pottery', 'Terracotta', 'Custom dinnerware sets'],
    startingPrice: 450, joinedAt: '2025-11-02',
  },
  {
    id: 'ent-ramesh', name: 'Ramesh Chandra', businessName: 'Chandra Shoe Repair',
    category: 'cobbler', categoryLabel: 'Cobbler / Footwear Repair',
    city: 'Agra', state: 'Uttar Pradesh',
    bio: 'Repairing shoes on the same street corner in Agra for 18 years. From full sole replacement to delicate stitching on bridal juttis, I fix footwear others throw away. Most repairs are ready within 24 hours.',
    experience: 18, rating: 4.7, reviewCount: 64, profileViews: 842,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-ramesh.jpg',
    gallery: ['/images/workshop-cobbler.jpg'],
    skills: ['Sole replacement', 'Heel repair', 'Leather stitching', 'Shoe polishing'],
    startingPrice: 80, joinedAt: '2025-12-10',
  },
  {
    id: 'ent-sunita', name: 'Sunita Devi', businessName: 'Sunita Boutique',
    category: 'tailor', categoryLabel: 'Tailor / Boutique',
    city: 'Lucknow', state: 'Uttar Pradesh',
    bio: 'Running my home boutique in Lucknow for 15 years, specialising in chikankari blouses, kurtis and bridal alterations. I take measurements at your home for orders within the city, and every garment is finished by hand.',
    experience: 15, rating: 4.8, reviewCount: 112, profileViews: 1530,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-sunita.jpg',
    gallery: ['/images/workshop-tailor.jpg', '/images/product-kurti.jpg'],
    skills: ['Chikankari', 'Blouse stitching', 'Bridal alterations', 'Kurti sets'],
    startingPrice: 350, joinedAt: '2025-10-18',
  },
  {
    id: 'ent-arjun', name: 'Arjun Mehta', businessName: 'Mehta Leather Works',
    category: 'artisan', categoryLabel: 'Leather Artisan',
    city: 'Jodhpur', state: 'Rajasthan',
    bio: 'I work with vegetable-tanned leather in a small Jodhpur workshop, making mojaris, sandals and bags the slow way — cut, skived and saddle-stitched by hand. My grandfather supplied juttis to the Mehrangarh palace shops.',
    experience: 10, rating: 4.9, reviewCount: 95, profileViews: 1106,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-arjun.jpg',
    gallery: ['/images/product-mojari.jpg', '/images/product-tote.jpg'],
    skills: ['Hand stitching', 'Mojari making', 'Leather bags', 'Custom belts'],
    startingPrice: 600, joinedAt: '2026-01-05',
  },
  {
    id: 'ent-devi', name: 'Devi Prasad', businessName: 'Banarasi Weaves',
    category: 'artisan', categoryLabel: 'Handloom Weaver',
    city: 'Varanasi', state: 'Uttar Pradesh',
    bio: 'Weaving Banarasi silk on a wooden pit-loom for 22 years. Each saree takes 15–25 days and carries motifs my family has woven for three generations. I work directly with customers — no middlemen.',
    experience: 22, rating: 4.6, reviewCount: 58, profileViews: 764,
    verified: true, status: 'active', available: false,
    avatar: '/images/maker-devi.jpg',
    gallery: ['/images/product-saree.jpg'],
    skills: ['Banarasi silk', 'Zari work', 'Custom saree orders', 'Dupatta weaving'],
    startingPrice: 2500, joinedAt: '2025-09-22',
  },
  {
    id: 'ent-mohan', name: 'Mohan Lal', businessName: 'Lal Woodcraft',
    category: 'artisan', categoryLabel: 'Carpenter / Woodworker',
    city: 'Saharanpur', state: 'Uttar Pradesh',
    bio: 'Saharanpur woodcraft runs in my family. I build solid sheesham furniture — stools, side tables, low chowkis — and repair old wooden furniture to last another decade. Everything is seasoned, joined and polished by hand.',
    experience: 14, rating: 4.5, reviewCount: 41, profileViews: 593,
    verified: false, status: 'pending', available: true,
    avatar: '/images/maker-mohan.jpg',
    gallery: ['/images/product-stool.jpg'],
    skills: ['Sheesham furniture', 'Furniture repair', 'Wood polishing', 'Custom stools'],
    startingPrice: 900, joinedAt: '2026-02-11',
  },
  {
    id: 'ent-lakshmi', name: 'Lakshmi Bai', businessName: 'Lakshmi Masala Ghar',
    category: 'vendor', categoryLabel: 'Spice Vendor / Home Producer',
    city: 'Indore', state: 'Madhya Pradesh',
    bio: 'I grind small-batch masalas at home in Indore — garam masala, poha-jalebi masala, and my mother\'s jeeravan recipe. Spices are roasted weekly and packed fresh. Regular customers order the same blends every month.',
    experience: 9, rating: 4.8, reviewCount: 73, profileViews: 918,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-lakshmi.jpg',
    gallery: ['/images/product-masala.jpg'],
    skills: ['Fresh masala blends', 'Bulk orders', 'Gift hampers', 'Custom spice mixes'],
    startingPrice: 120, joinedAt: '2025-12-28',
  },
  {
    id: 'ent-ibrahim', name: 'Ibrahim Khan', businessName: 'Khan Metal Works',
    category: 'artisan', categoryLabel: 'Blacksmith / Metalworker',
    city: 'Moradabad', state: 'Uttar Pradesh',
    bio: 'Twenty years at the forge in Moradabad\'s brass city. I do gate and grill repair, knife sharpening, and custom-forged brackets, handles and tools. I also restore old brass and copper utensils.',
    experience: 20, rating: 4.7, reviewCount: 52, profileViews: 671,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-ibrahim.jpg',
    gallery: ['/images/product-lantern.jpg'],
    skills: ['Gate & grill repair', 'Knife sharpening', 'Brass restoration', 'Custom forging'],
    startingPrice: 200, joinedAt: '2025-11-19',
  },
  {
    id: 'ent-anita', name: 'Anita Sharma', businessName: 'Anita Silver Craft',
    category: 'artisan', categoryLabel: 'Jewellery Maker',
    city: 'Jaipur', state: 'Rajasthan',
    bio: 'Handcrafted silver jewellery from Jaipur\'s Johari Bazaar tradition — jhumkas, kadas and pendants set with semi-precious stones. I work on custom designs from a sketch or a photograph of an heirloom piece.',
    experience: 8, rating: 4.9, reviewCount: 36, profileViews: 705,
    verified: false, status: 'pending', available: true,
    avatar: '/images/maker-anita.jpg',
    gallery: ['/images/product-jewelry.jpg'],
    skills: ['Silver jhumkas', 'Custom redesign', 'Stone setting', 'Oxidised jewellery'],
    startingPrice: 1500, joinedAt: '2026-03-02',
  },
  {
    id: 'ent-prakash', name: 'Prakash Yadav', businessName: 'Yadav Bamboo Craft',
    category: 'artisan', categoryLabel: 'Bamboo Craftsman',
    city: 'Guwahati', state: 'Assam',
    bio: 'Bamboo is Assam\'s green gold, and I\'ve woven it for 11 years — baskets, lampshades, planters and furniture. I source mature bamboo from local growers and treat every piece against insects before weaving.',
    experience: 11, rating: 4.6, reviewCount: 44, profileViews: 588,
    verified: true, status: 'active', available: true,
    avatar: '/images/maker-prakash.jpg',
    gallery: ['/images/product-basket.jpg', '/images/product-lantern.jpg'],
    skills: ['Basket weaving', 'Lampshades', 'Bamboo planters', 'Custom sizes'],
    startingPrice: 300, joinedAt: '2026-01-20',
  },
];

export const SERVICES = [
  // Meena — potter
  { id: 'svc-meena-1', entrepreneurId: 'ent-meena', name: 'Pottery Workshop — Beginner', description: 'A 3-hour hands-on session: centre clay, throw your first pot, and take home two fired pieces.', startingPrice: 1200, duration: '3 hours', category: 'potter' },
  { id: 'svc-meena-2', entrepreneurId: 'ent-meena', name: 'Custom Dinnerware Set', description: 'Made-to-order 12-piece dinner set in your choice of glaze. Includes a design consultation.', startingPrice: 8500, duration: '3–4 weeks', category: 'potter' },
  // Ramesh — cobbler
  { id: 'svc-ramesh-1', entrepreneurId: 'ent-ramesh', name: 'Full Sole Replacement', description: 'Complete sole replacement with premium rubber or leather soles, re-stitched for strength.', startingPrice: 350, duration: '1–2 days', category: 'cobbler' },
  { id: 'svc-ramesh-2', entrepreneurId: 'ent-ramesh', name: 'Heel & Stitching Repair', description: 'Heel tip replacement, loose stitching repair and edge finishing for all footwear types.', startingPrice: 120, duration: 'Same day', category: 'cobbler' },
  // Sunita — tailor
  { id: 'svc-sunita-1', entrepreneurId: 'ent-sunita', name: 'Custom Blouse Stitching', description: 'Blouse stitched to your exact measurements with chikankari or piping options. Home measurement available.', startingPrice: 650, duration: '4–5 days', category: 'tailor' },
  { id: 'svc-sunita-2', entrepreneurId: 'ent-sunita', name: 'Bridal Alteration Package', description: 'Complete fitting and alteration for bridal lehengas and gowns — up to 3 trial sessions.', startingPrice: 2500, duration: '1–2 weeks', category: 'tailor' },
  // Arjun — leather
  { id: 'svc-arjun-1', entrepreneurId: 'ent-arjun', name: 'Custom Mojari Fitting', description: 'Hand-measured mojaris in your size, leather choice and embroidery pattern.', startingPrice: 1400, duration: '2 weeks', category: 'artisan' },
  { id: 'svc-arjun-2', entrepreneurId: 'ent-arjun', name: 'Leather Bag Repair', description: 'Strap replacement, stitching repair and conditioning for leather bags and briefcases.', startingPrice: 450, duration: '3–5 days', category: 'artisan' },
  // Devi — weaver
  { id: 'svc-devi-1', entrepreneurId: 'ent-devi', name: 'Custom Banarasi Saree', description: 'Commission a saree in your colours and motifs, woven on the pit-loom over 15–25 days.', startingPrice: 12000, duration: '15–25 days', category: 'artisan' },
  { id: 'svc-devi-2', entrepreneurId: 'ent-devi', name: 'Saree Restoration', description: 'Careful repair of torn borders and zari work on heirloom Banarasi sarees.', startingPrice: 1800, duration: '2–3 weeks', category: 'artisan' },
  // Mohan — carpenter
  { id: 'svc-mohan-1', entrepreneurId: 'ent-mohan', name: 'Furniture Repair Visit', description: 'Home visit to repair wobbly chairs, broken hinges, drawers and minor wood damage.', startingPrice: 500, duration: 'Same day', category: 'artisan' },
  { id: 'svc-mohan-2', entrepreneurId: 'ent-mohan', name: 'Custom Sheesham Stool', description: 'Hand-built solid sheesham stool in your preferred height and finish.', startingPrice: 2200, duration: '1 week', category: 'artisan' },
  // Lakshmi — vendor
  { id: 'svc-lakshmi-1', entrepreneurId: 'ent-lakshmi', name: 'Monthly Masala Subscription', description: 'Fresh-ground masala box delivered every month — 5 blends, roasted the same week.', startingPrice: 900, duration: 'Monthly', category: 'vendor' },
  { id: 'svc-lakshmi-2', entrepreneurId: 'ent-lakshmi', name: 'Wedding Gift Hampers', description: 'Curated spice and snack hampers for weddings and festivals, packed to order.', startingPrice: 750, duration: '3–4 days', category: 'vendor' },
  // Ibrahim — metalworker
  { id: 'svc-ibrahim-1', entrepreneurId: 'ent-ibrahim', name: 'Gate & Grill Repair', description: 'On-site welding and repair for gates, grills and railings, with rust treatment.', startingPrice: 800, duration: '1–2 days', category: 'artisan' },
  { id: 'svc-ibrahim-2', entrepreneurId: 'ent-ibrahim', name: 'Knife Sharpening (per set)', description: 'Professional sharpening for kitchen knife sets — collected and returned in 48 hours.', startingPrice: 250, duration: '2 days', category: 'artisan' },
  // Anita — jewellery
  { id: 'svc-anita-1', entrepreneurId: 'ent-anita', name: 'Heirloom Redesign', description: 'Remodel old gold or silver jewellery into a modern design, keeping the original metal.', startingPrice: 3500, duration: '2–3 weeks', category: 'artisan' },
  { id: 'svc-anita-2', entrepreneurId: 'ent-anita', name: 'Custom Silver Jhumkas', description: 'Handcrafted jhumkas designed from your sketch, with semi-precious stone options.', startingPrice: 2800, duration: '2 weeks', category: 'artisan' },
  // Prakash — bamboo
  { id: 'svc-prakash-1', entrepreneurId: 'ent-prakash', name: 'Custom Bamboo Planters', description: 'Set of woven bamboo planters in sizes for your balcony or garden, treated for outdoor use.', startingPrice: 1100, duration: '1 week', category: 'artisan' },
  { id: 'svc-prakash-2', entrepreneurId: 'ent-prakash', name: 'Bamboo Lampshade (Large)', description: 'Hand-woven statement lampshade, wired and ready to hang, in natural or smoked finish.', startingPrice: 1900, duration: '10 days', category: 'artisan' },
];

export const PRODUCTS = [
  { id: 'prd-vase', entrepreneurId: 'ent-meena', name: 'Hand-Thrown Clay Vase', description: 'A tall, hand-thrown terracotta vase with a matte sand glaze. Each piece is unique — expect slight variations in shape and tone, which is the point of handmade.', price: 850, image: '/images/product-vase.jpg', category: 'potter', stock: 14, material: 'Riverbed clay, mineral glaze', dimensions: '28 × 14 cm', rating: 4.9, reviewCount: 22 },
  { id: 'prd-kulhad', entrepreneurId: 'ent-meena', name: 'Kulhad Chai Cups — Set of 6', description: 'Classic earthen kulhads that make chai taste like a roadside dhaba. Unglazed inside for that earthy aroma.', price: 450, image: '/images/product-kulhad.jpg', category: 'potter', stock: 40, material: 'Natural terracotta', dimensions: '9 × 7 cm each', rating: 4.8, reviewCount: 31 },
  { id: 'prd-diya', entrepreneurId: 'ent-meena', name: 'Festive Diya Set — 12 pcs', description: 'Hand-pinched clay diyas with a rustic finish, perfect for Diwali or everyday aarti. Cotton wicks included.', price: 320, image: '/images/product-diya.jpg', category: 'potter', stock: 60, material: 'Terracotta', dimensions: '6 cm diameter', rating: 4.7, reviewCount: 18 },
  { id: 'prd-mojari', entrepreneurId: 'ent-arjun', name: 'Embroidered Leather Mojari', description: 'Traditional Rajasthani mojaris with hand embroidery, cushioned insole and vegetable-tanned leather that softens with wear.', price: 1450, image: '/images/product-mojari.jpg', category: 'artisan', stock: 9, material: 'Vegetable-tanned leather, cotton thread', dimensions: 'Sizes 38–44', rating: 4.9, reviewCount: 27 },
  { id: 'prd-chappal', entrepreneurId: 'ent-arjun', name: 'Hand-Stitched Leather Chappal', description: 'Everyday kolhapuri-style chappals, saddle-stitched by hand with a soft leather footbed. Built to last years, not seasons.', price: 980, image: '/images/product-chappal.jpg', category: 'artisan', stock: 16, material: 'Full-grain leather', dimensions: 'Sizes 38–45', rating: 4.8, reviewCount: 19 },
  { id: 'prd-tote', entrepreneurId: 'ent-arjun', name: 'Artisan Leather Tote', description: 'A spacious work tote in cognac leather with brass fittings and a cotton twill lining. Ages beautifully.', price: 3200, image: '/images/product-tote.jpg', category: 'artisan', stock: 5, material: 'Full-grain leather, brass, cotton twill', dimensions: '38 × 30 × 12 cm', rating: 5.0, reviewCount: 11 },
  { id: 'prd-kurti', entrepreneurId: 'ent-sunita', name: 'Chikankari Kurti — Ivory', description: 'Hand-embroidered chikankari kurti in breathable mulmul cotton. Made to your measurements — share sizes after ordering.', price: 1850, image: '/images/product-kurti.jpg', category: 'tailor', stock: 12, material: 'Mulmul cotton, hand embroidery', dimensions: 'Sizes XS–XXL, made to measure', rating: 4.8, reviewCount: 34 },
  { id: 'prd-saree', entrepreneurId: 'ent-devi', name: 'Banarasi Silk Saree — Maroon', description: 'Authentic handloom Banarasi silk with gold zari buttis and a woven border. Silk Mark certified, with blouse piece.', price: 9500, image: '/images/product-saree.jpg', category: 'artisan', stock: 3, material: 'Pure silk, gold zari', dimensions: '6.3 m with blouse', rating: 4.9, reviewCount: 9 },
  { id: 'prd-shawl', entrepreneurId: 'ent-devi', name: 'Handwoven Wool Shawl', description: 'A warm, soft shawl woven on the handloom with a subtle border pattern. Naturally dyed in earth tones.', price: 1600, image: '/images/product-shawl.jpg', category: 'artisan', stock: 11, material: 'Pure wool, natural dyes', dimensions: '200 × 70 cm', rating: 4.7, reviewCount: 14 },
  { id: 'prd-basket', entrepreneurId: 'ent-prakash', name: 'Woven Bamboo Storage Basket', description: 'Sturdy hand-woven basket for laundry, toys or throws. Insect-treated bamboo with a smooth, splinter-free finish.', price: 650, image: '/images/product-basket.jpg', category: 'artisan', stock: 22, material: 'Treated bamboo', dimensions: '40 × 40 × 35 cm', rating: 4.6, reviewCount: 16 },
  { id: 'prd-lantern', entrepreneurId: 'ent-prakash', name: 'Bamboo Pendant Lantern', description: 'A warm, sculptural pendant shade woven from thin bamboo strips. Casts beautiful patterned light. Wired and ready to hang.', price: 1750, image: '/images/product-lantern.jpg', category: 'artisan', stock: 7, material: 'Bamboo, cotton cord, brass holder', dimensions: '35 cm diameter', rating: 4.8, reviewCount: 8 },
  { id: 'prd-jewelry', entrepreneurId: 'ent-anita', name: 'Oxidised Silver Jhumkas', description: 'Handcrafted oxidised silver jhumkas with tiny ghungroos and kundan accents. Lightweight enough for all-day wear.', price: 2400, image: '/images/product-jewelry.jpg', category: 'artisan', stock: 8, material: '92.5 sterling silver, kundan', dimensions: '5 cm drop', rating: 4.9, reviewCount: 13 },
  { id: 'prd-stool', entrepreneurId: 'ent-mohan', name: 'Sheesham Wood Stool', description: 'A solid sheesham stool with a hand-rubbed wax finish. Works as seating, a side table, or a plant stand.', price: 2100, image: '/images/product-stool.jpg', category: 'artisan', stock: 6, material: 'Seasoned sheesham wood', dimensions: '45 × 35 × 35 cm', rating: 4.6, reviewCount: 10 },
  { id: 'prd-masala', entrepreneurId: 'ent-lakshmi', name: 'Fresh Masala Trio', description: 'Three small-batch blends — garam masala, jeeravan, and poha masala — roasted and ground the same week they ship.', price: 480, image: '/images/product-masala.jpg', category: 'vendor', stock: 50, material: 'Whole spices, no additives', dimensions: '3 × 100 g pouches', rating: 4.8, reviewCount: 42 },
];

export const ORDERS = [
  { id: 'HH-ORD-2026-00317', customerId: 'usr-customer', entrepreneurId: 'ent-meena', items: [{ productId: 'prd-vase', qty: 1, price: 850 }, { productId: 'prd-kulhad', qty: 2, price: 450 }], total: 1750, status: 'delivered', createdAt: '2026-09-12T10:24:00', address: 'C-Scheme, Jaipur' },
  { id: 'HH-ORD-2026-00342', customerId: 'usr-customer', entrepreneurId: 'ent-arjun', items: [{ productId: 'prd-mojari', qty: 1, price: 1450 }], total: 1450, status: 'shipped', createdAt: '2026-09-21T15:40:00', address: 'C-Scheme, Jaipur' },
  { id: 'HH-ORD-2026-00358', customerId: 'usr-customer', entrepreneurId: 'ent-lakshmi', items: [{ productId: 'prd-masala', qty: 3, price: 480 }], total: 1440, status: 'processing', createdAt: '2026-09-26T09:12:00', address: 'C-Scheme, Jaipur' },
  { id: 'HH-ORD-2026-00298', customerId: 'usr-customer', entrepreneurId: 'ent-sunita', items: [{ productId: 'prd-kurti', qty: 1, price: 1850 }], total: 1850, status: 'delivered', createdAt: '2026-09-05T11:03:00', address: 'C-Scheme, Jaipur' },
  { id: 'HH-ORD-2026-00271', customerId: 'usr-customer', entrepreneurId: 'ent-prakash', items: [{ productId: 'prd-basket', qty: 2, price: 650 }], total: 1300, status: 'delivered', createdAt: '2026-08-28T16:55:00', address: 'C-Scheme, Jaipur' },
  { id: 'HH-ORD-2026-00371', customerId: 'usr-guest2', entrepreneurId: 'ent-meena', items: [{ productId: 'prd-diya', qty: 4, price: 320 }], total: 1280, status: 'confirmed', createdAt: '2026-09-28T13:20:00', address: 'Malviya Nagar, Jaipur' },
  { id: 'HH-ORD-2026-00366', customerId: 'usr-guest3', entrepreneurId: 'ent-anita', items: [{ productId: 'prd-jewelry', qty: 1, price: 2400 }], total: 2400, status: 'processing', createdAt: '2026-09-27T18:44:00', address: 'Bapu Nagar, Jaipur' },
];

export const SERVICE_REQUESTS = [
  { id: 'HH-2026-00482', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-sunita', serviceId: 'svc-sunita-1', preferredDate: '2026-10-04', preferredTime: 'Morning (9–12)', location: 'C-Scheme, Jaipur', notes: 'Need a blouse stitched for a wedding — chikankari work preferred. Will share the saree for matching.', budget: 800, status: 'pending', createdAt: '2026-09-27T10:15:00' },
  { id: 'HH-2026-00471', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-ramesh', serviceId: 'svc-ramesh-1', preferredDate: '2026-09-30', preferredTime: 'Evening (4–7)', location: 'C-Scheme, Jaipur', notes: 'Leather boots need full sole replacement. Soles are worn through at the heel.', budget: 400, status: 'accepted', createdAt: '2026-09-25T14:02:00' },
  { id: 'HH-2026-00455', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-meena', serviceId: 'svc-meena-1', preferredDate: '2026-09-20', preferredTime: 'Morning (9–12)', location: 'Studio visit', notes: 'Beginner pottery workshop for 2 people.', budget: 2400, status: 'completed', createdAt: '2026-09-15T09:30:00' },
  { id: 'HH-2026-00490', customerId: 'usr-guest2', customerName: 'Priya Nair', entrepreneurId: 'ent-meena', serviceId: 'svc-meena-2', preferredDate: '2026-10-18', preferredTime: 'Afternoon (12–4)', location: 'Malviya Nagar, Jaipur', notes: 'Custom 12-piece dinner set in blue pottery style for a new home.', budget: 9000, status: 'pending', createdAt: '2026-09-28T16:48:00' },
  { id: 'HH-2026-00488', customerId: 'usr-guest3', customerName: 'Rohan Verma', entrepreneurId: 'ent-ibrahim', serviceId: 'svc-ibrahim-1', preferredDate: '2026-10-02', preferredTime: 'Morning (9–12)', location: 'Vaishali Nagar, Jaipur', notes: 'Main gate hinge broken and rust patches near the bottom rail.', budget: 1000, status: 'in-progress', createdAt: '2026-09-28T11:05:00' },
  { id: 'HH-2026-00463', customerId: 'usr-guest4', customerName: 'Kavita Rao', entrepreneurId: 'ent-arjun', serviceId: 'svc-arjun-2', preferredDate: '2026-09-24', preferredTime: 'Afternoon (12–4)', location: 'Tonk Road, Jaipur', notes: 'Office tote strap torn at the joint. Please quote before starting.', budget: 600, status: 'rejected', createdAt: '2026-09-22T17:26:00' },
];

export const REVIEWS = [
  { id: 'rev-01', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-meena', productId: 'prd-vase', rating: 5, text: 'The vase is even better in person — the glaze has this beautiful sandy texture. Packed really well, arrived without a scratch.', createdAt: '2026-09-14T12:10:00' },
  { id: 'rev-02', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-meena', productId: 'prd-kulhad', rating: 5, text: 'Chai genuinely tastes better in these. Ordered a second set for my parents.', createdAt: '2026-09-14T12:14:00' },
  { id: 'rev-03', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-sunita', productId: 'prd-kurti', rating: 5, text: 'Fit is perfect — the measurements she took over the phone were spot on. The chikankari work is delicate and neat.', createdAt: '2026-09-08T10:44:00' },
  { id: 'rev-04', customerId: 'usr-customer', customerName: 'Aarav Sharma', entrepreneurId: 'ent-sunita', rating: 5, text: 'Did the beginner pottery workshop with my sister. Meena ji is a patient teacher and the studio has such a calm vibe.', createdAt: '2026-09-21T18:20:00' },
  { id: 'rev-05', customerId: 'usr-guest2', customerName: 'Priya Nair', entrepreneurId: 'ent-arjun', productId: 'prd-mojari', rating: 5, text: 'Wore them to a wedding — comfortable all evening and got so many compliments.', createdAt: '2026-09-19T20:02:00' },
  { id: 'rev-06', customerId: 'usr-guest3', customerName: 'Rohan Verma', entrepreneurId: 'ent-lakshmi', productId: 'prd-masala', rating: 5, text: 'The jeeravan is exactly like my grandmother used to make. You can tell the spices are freshly ground.', createdAt: '2026-09-11T08:31:00' },
  { id: 'rev-07', customerId: 'usr-guest4', customerName: 'Kavita Rao', entrepreneurId: 'ent-prakash', productId: 'prd-basket', rating: 4, text: 'Sturdy and well finished. Slightly smaller than I pictured, but the dimensions were listed — my mistake.', createdAt: '2026-09-02T14:55:00' },
  { id: 'rev-08', customerId: 'usr-guest5', customerName: 'Imran Sheikh', entrepreneurId: 'ent-ramesh', rating: 5, text: 'Fixed my boots in a day for half of what the brand store quoted. Honest work.', createdAt: '2026-08-30T11:12:00' },
  { id: 'rev-09', customerId: 'usr-guest6', customerName: 'Divya Menon', entrepreneurId: 'ent-anita', productId: 'prd-jewelry', rating: 5, text: 'The jhumkas are light and the oxidised finish looks premium. Beautiful packaging too.', createdAt: '2026-09-24T19:40:00' },
  { id: 'rev-10', customerId: 'usr-guest7', customerName: 'Suresh Patil', entrepreneurId: 'ent-devi', productId: 'prd-saree', rating: 5, text: 'Bought for my wife\'s birthday. The zari work is exquisite and the Silk Mark certificate gave us confidence.', createdAt: '2026-08-25T16:08:00' },
  { id: 'rev-11', customerId: 'usr-guest8', customerName: 'Neha Gupta', entrepreneurId: 'ent-mohan', productId: 'prd-stool', rating: 4, text: 'Solid wood, nice finish. Delivery took a week longer than estimated but worth the wait.', createdAt: '2026-09-17T13:37:00' },
  { id: 'rev-12', customerId: 'usr-guest9', customerName: 'Farhan Ali', entrepreneurId: 'ent-ibrahim', rating: 5, text: 'Repaired our society gate and treated the rust properly instead of just painting over it. Professional.', createdAt: '2026-09-13T09:58:00' },
];

export const COMPLAINTS = [
  { id: 'HH-CMP-2026-0019', customerId: 'usr-guest4', customerName: 'Kavita Rao', entrepreneurId: 'ent-arjun', orderId: null, requestId: 'HH-2026-00463', subject: 'Request rejected without explanation', description: 'My bag repair request was rejected but no reason was given. I would like to know why so I can fix my request.', status: 'open', createdAt: '2026-09-23T10:12:00' },
  { id: 'HH-CMP-2026-0014', customerId: 'usr-guest8', customerName: 'Neha Gupta', entrepreneurId: 'ent-mohan', orderId: 'HH-ORD-2026-00260', requestId: null, subject: 'Delivery delayed by a week', description: 'The stool arrived a week after the estimated date. The product itself is good, but I needed it for a housewarming.', status: 'resolved', createdAt: '2026-09-16T15:40:00', resolution: 'Maker apologised and offered a 10% discount on the next order. Customer accepted.' },
  { id: 'HH-CMP-2026-0021', customerId: 'usr-guest10', customerName: 'Anil Joshi', entrepreneurId: 'ent-devi', orderId: null, requestId: null, subject: 'Maker marked unavailable mid-order', description: 'I was discussing a custom saree order and the maker went unavailable for two weeks without notice.', status: 'in-review', createdAt: '2026-09-27T12:25:00' },
];

export const IMPACT_STATS = [
  { value: '2,480+', label: 'Local makers onboard' },
  { value: '8,920+', label: 'Products listed' },
  { value: '4,700+', label: 'Services completed' },
  { value: '₹1.2Cr+', label: 'Paid directly to makers' },
];

export const HOW_IT_WORKS = [
  { index: '01', title: 'Discover', text: 'Search skills, products and makers near you — or browse by craft.' },
  { index: '02', title: 'Connect', text: 'View verified profiles, real pricing and honest availability.' },
  { index: '03', title: 'Request', text: 'Book a service with a preferred date, or place an order in two taps.' },
  { index: '04', title: 'Support local', text: 'Your money goes directly to the entrepreneur. No middlemen.' },
];

export const REQUEST_STATUSES = ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'];
export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
export const COMPLAINT_STATUSES = ['open', 'in-review', 'resolved'];
