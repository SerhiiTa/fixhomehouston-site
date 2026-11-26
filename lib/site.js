// Single source of truth for business facts shown across the site.
export const SITE = {
  name: 'Houston Home Fix',
  url: 'https://fixhomehouston.com',
  phone: '(346) 489-6281',
  tel: '+13464896281',
  street: '11020 Katy Fwy unit 117',
  city: 'Houston',
  region: 'TX',
  zip: '77043',
  hours: 'Monday to Saturday, 8:00 AM – 6:00 PM',
  diagnostic: '$65 diagnostic fee, applied toward the repair.',
  owner: 'Serhii',
  legalName: 'HomeFix Appliance Repair LLC',
  // Set these to a path like "/images/hero.jpg" once real photos are added to /public/images.
  heroImage: null,
  aboutImage: '/images/serhii-technician.jpg',
  faceImage: '/images/serhii-face.jpg',
  // Real customer reviews. Leave empty until real ones are pasted in: [{name:'Jane D.', date:'October 12, 2026', text:'...'}]
  reviews: [],
  reviewsUrl: 'https://share.google/Gegcy7ps0tC7UPZle',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Houston+Home+Fix+11020+Katy+Fwy+Ste+117+Houston+TX+77043',
  mapEmbed: 'https://www.google.com/maps?q=11020+Katy+Fwy+Suite+117,+Houston,+TX+77043&output=embed',
  rating: '5.0',
  ratingCount: 16,
  trustindexIds: ['432635e4157c467e7236cfaf4cf', '314c45d8643b66593d56d103666'],
  gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-QCM2014FFH',
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
};

export const PRICES = [
  { title: 'Cooling', incl: 'Fridge, freezer, ice maker, wine cooler', rows: [
    ['Fridge not cooling, freezer works', '$250'], ['Compressor is hot', '$200'],
    ['Refrigerator not cooling properly', '$200'], ['Fridge leaking water', '$220'],
    ['Ice maker not working', '$150'], ['Water dispenser not working', '$220'] ] },
  { title: 'Laundry', incl: 'Washing machine, dryer', rows: [
    ['Washer will not spin', '$200'], ['Washer will not drain', '$220'],
    ['Dryer not heating', '$230'], ['Dryer will not start', '$200'],
    ['Dryer makes noise', '$180'], ['Water valve or belt replacing', '$220'] ] },
  { title: 'Kitchen', incl: 'Cooktop, range, oven, dishwasher', rows: [
    ['Oven not heating', '$200'], ['Thermostat issues', '$200'], ['Burners not lighting', '$100'],
    ['Dishwasher not draining', '$100'], ['Clogs, jamming or leaks', '$100'], ['Non-working control panel', '$50'] ] },
];

export const SERVICES = [
  { path: '/fridge-repair/', name: 'Refrigerators & Ice Makers', note: 'Not cooling, leaks, ice maker and water dispenser faults. Freezers and wine coolers too.' },
  { path: '/washer-repair/', name: 'Washers', note: 'Will not spin or drain, loud noise, water valve and belt replacement.' },
  { path: '/dryer-repair/', name: 'Dryers', note: 'Not heating, will not start, noise, belt and thermostat.' },
  { path: '/dishwasher-repair/', name: 'Dishwashers', note: 'Not draining, not cleaning, leaks and error codes.' },
  { path: '/oven-repair/', name: 'Ovens', note: 'Not heating, control panel and thermostat issues.' },
  { path: '/cooktop-repair/', name: 'Cooktops', note: 'Burners not lighting, elements and controls.' },
  { path: '/range-stove-repair/', name: 'Ranges & Stoves', note: 'Gas and electric ranges, ignition and heating faults.' },
  { path: '/ice-maker-repair/', name: 'Ice Makers', note: 'Not freezing, no ice, slow production and leaks.' },
];

export const AREAS = [
  ['Downtown Houston', '/appliance-repair-downtown-houston/'], ['Midtown', '/appliance-repair-midtown/'],
  ['Montrose', '/appliance-repair-montrose/'], ['The Heights', '/appliance-repair-the-heights/'],
  ['River Oaks', '/appliance-repair-river-oaks/'], ['Galleria / Uptown', '/appliance-repair-galleria-uptown/'],
  ['West University Place', '/appliance-repair-west-university-place/'], ['Bellaire', '/appliance-repair-bellaire/'],
  ['Memorial', '/appliance-repair-memorial/'], ['Energy Corridor', '/appliance-repair-energy-corridor/'],
];

// Also served (no dedicated page): shown as plain names in the areas block
export const AREAS_EXTRA = ['Bunker Hill Village', 'Hunters Creek Village', 'Spring', 'Katy', 'Sugar Land', 'Spring Branch'];
