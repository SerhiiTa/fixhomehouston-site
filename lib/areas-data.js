// Unique local content for the 10 neighborhood pages. ZIPs come from our service-area table and were checked against
// City of Houston super-neighborhood tables and ZIP maps. Keep claims general and factual; owner reviews before launch.
import { checkZip } from './service-area.js';

export const AREA_DATA = {
  '/appliance-repair-downtown-houston/': {
    name: 'Downtown Houston', short: 'Downtown',
    zips: ['77002', '77003', '77010'],
    places: ['Discovery Green', 'Theater District', 'Historic Market Square', 'Toyota Center', 'Buffalo Bayou Park', 'EaDo (East Downtown)'],
    intro: [
      'Downtown Houston is mostly high-rise condos, loft conversions and apartment towers, so an appliance call here is rarely the same as a house call. Kitchens are compact, refrigerators are often built in or counter-depth, and many units have a stacked or all-in-one washer and dryer in a closet. We repair these appliances every week and bring the common parts for them.',
      'We cover the downtown core and the neighborhoods around it, including the Theater District, Market Square and EaDo. Because these ZIP codes are farther from our Katy Freeway base than most of our service area, the technician confirms the arrival window with you by phone when you book.',
    ],
    tips: [
      'Most towers require advance notice for the freight elevator or a loading-dock slot. Tell us the building name and floor when you book so we can plan the visit.',
      'Stacked and ventless (condensing) dryers clog differently from standard vented dryers. If yours takes two cycles to dry, that is usually a repair we can make in one visit.',
      'Built-in and counter-depth refrigerators are tight fits. We pull them out carefully to protect your floors and water line.',
      'Every repair starts with a $65 diagnostic fee that is applied toward the repair, and you get a clear quote before any work begins.',
    ],
    faq: [
      ['Can you repair appliances in a downtown high-rise or loft?', 'Yes. Tell us the building and floor when you book. Many buildings ask for a heads-up about the service elevator or parking, and we plan around it.'],
      ['Do you repair stacked and ventless dryers common in downtown condos?', 'Yes. We repair stacked washer-dryer units, condensing and heat-pump style dryers as well as standard vented dryers.'],
      ['Which ZIP codes do you serve in downtown Houston?', 'We serve 77002, 77003 and 77010. These are in our extended service area, so the technician confirms the arrival time by phone.'],
      ['Does the $65 diagnostic fee go toward the repair?', 'Yes. The $65 diagnostic is applied toward the cost of the repair if you go ahead with it.'],
    ],
    nearby: ['/appliance-repair-midtown/', '/appliance-repair-the-heights/', '/appliance-repair-montrose/'],
  },

  '/appliance-repair-midtown/': {
    name: 'Midtown', short: 'Midtown',
    zips: ['77004', '77002'],
    places: ['Midtown Park', 'Bagby Street', 'Main Street rail corridor', 'Ensemble / HCC', 'Cultural Arts and Entertainment District'],
    intro: [
      'Midtown sits just south of downtown, roughly between I-45, SH-288, US-59 and Bagby Street. The housing is a mix of newer apartment communities, townhomes and older bungalows on the quieter side streets, so we see everything from compact apartment appliances to full-size family kitchens.',
      'Apartment and townhome residents often call us for refrigerators that stop cooling, dishwashers that will not drain and washers that leak. We diagnose on the first visit and quote the repair before any work starts. Midtown ZIP codes are in our extended service area, so the technician confirms your arrival window by phone.',
    ],
    tips: [
      'If you rent, send us the appliance brand and model from the label inside the door or on the back. It speeds up the quote, and your landlord or property manager may need the repair summary.',
      'Townhomes often have washers and dryers on upper floors. Tell us when you book so we bring the right tools for a safe, leak-free repair.',
      'Older Midtown homes can have older 240-volt outlets and gas shutoffs. We check these during the dryer and range diagnostic.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you repair appliances in Midtown apartments and townhomes?', 'Yes. We repair refrigerators, washers, dryers, dishwashers, ovens and cooktops in apartments, townhomes and houses throughout Midtown.'],
      ['I rent. Can I book the repair myself?', 'You can book, but many leases require the landlord or property manager to approve repairs. Check with them first, and we can give you a written summary of the repair.'],
      ['Which ZIP codes do you serve around Midtown?', 'We serve 77004 and 77002. These are in our extended service area, so we confirm timing by phone when you book.'],
      ['How fast can you get here?', 'Call or send a request and we confirm the earliest slot, often the same day depending on the schedule.'],
    ],
    nearby: ['/appliance-repair-downtown-houston/', '/appliance-repair-montrose/', '/appliance-repair-west-university-place/'],
  },

  '/appliance-repair-montrose/': {
    name: 'Montrose', short: 'Montrose',
    zips: ['77006', '77098'],
    places: ['Menil Collection', 'Rothko Chapel', 'Lower Westheimer', 'Avondale', 'Neartown'],
    intro: [
      'Montrose is one of the most mixed neighborhoods in Houston: early-twentieth-century bungalows, renovated cottages, townhomes, and mid-rise condos, often within a few blocks of each other. That mix shapes the appliances we see here, from vintage gas ranges that people want to keep running to modern built-in refrigerators in new townhomes.',
      'Many Montrose homes were renovated in stages, so one kitchen can have appliances from different decades. We diagnose the machine in front of us, explain whether the repair is worth it, and give you a price before we start. Montrose ZIP codes are in our extended service area, so the technician confirms the arrival window by phone.',
    ],
    tips: [
      'In older homes, a dryer or range may sit on a circuit or gas line that was never updated. A diagnostic includes a quick check of the outlet, vent and shutoff.',
      'Vintage gas ranges often have parts that are hard to find. We tell you honestly if repair makes sense or if replacement is better.',
      'Condo residents: tell us the building and unit when you book, because some associations limit service hours.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Can you repair older gas ranges and ovens in Montrose bungalows?', 'Yes. We repair gas and electric ranges, ovens and cooktops, including older models. If a part is no longer available, we tell you before you spend money.'],
      ['Which ZIP codes do you serve in Montrose?', 'We serve 77006 and 77098. These are in our extended service area, so we confirm timing by phone.'],
      ['Do you repair built-in refrigerators in new Montrose townhomes?', 'Yes. We are licensed for refrigeration work and repair built-in, counter-depth and premium brands such as Sub-Zero, Thermador and Viking.'],
      ['Is there a fee just to come out?', 'There is a $65 diagnostic fee that is applied toward the repair if you proceed.'],
    ],
    nearby: ['/appliance-repair-river-oaks/', '/appliance-repair-midtown/', '/appliance-repair-the-heights/'],
  },

  '/appliance-repair-the-heights/': {
    name: 'The Heights', short: 'the Heights',
    zips: ['77008', '77007', '77009', '77022'],
    places: ['Heights Boulevard', '19th Street', 'White Oak Drive', 'Woodland Heights', 'Norhill', 'Shady Acres'],
    intro: [
      'The Heights is known for its historic bungalows and Victorian-era houses, with newer builds mixed in. Woodland Heights and Germantown are protected historic districts, so many kitchens here were updated inside older houses. That usually means a modern refrigerator or dishwasher next to older wiring, gas lines or vent runs.',
      'We repair refrigerators, washers, dryers, dishwashers, ovens and cooktops across the Heights, Woodland Heights, Norhill and Shady Acres. A diagnostic includes a look at the surroundings, such as the outlet, the vent and the water supply, because in older homes those are often the real cause. Some Heights ZIP codes are in our extended service area, so the technician confirms your arrival window by phone.',
    ],
    tips: [
      'In older Heights homes, a dryer that does not heat is often a long or kinked vent run as well as a bad part. We check both.',
      'Pier-and-beam houses can make washers vibrate. We look at leveling and the drain connection, not only the machine.',
      'If a gas appliance has a pilot or ignition problem, we check the shutoff and supply before opening the appliance.',
      'The $65 diagnostic is applied toward the repair, and you get a clear quote first.',
    ],
    faq: [
      ['Which ZIP codes do you serve in the Heights?', 'We serve 77008, 77007, 77009 and 77022. 77008 and 77007 are in our standard service area; 77009 and 77022 are in our extended area, so we confirm timing by phone.'],
      ['Do you work in Woodland Heights and Norhill?', 'Yes. Both are in ZIP 77009, which we serve.'],
      ['My dryer takes two cycles to dry in an older house. Is that the dryer?', 'It can be the vent. Long or crushed vent runs are common in older homes. A diagnostic checks the vent and the dryer so you only pay for what is actually needed.'],
      ['Do you repair gas ranges in the Heights?', 'Yes. We repair gas and electric ranges, ovens and cooktops, including older models.'],
    ],
    nearby: ['/appliance-repair-memorial/', '/appliance-repair-montrose/', '/appliance-repair-downtown-houston/'],
  },

  '/appliance-repair-river-oaks/': {
    name: 'River Oaks', short: 'River Oaks',
    zips: ['77019', '77027'],
    places: ['River Oaks Boulevard', 'River Oaks Shopping Center', 'Afton Oaks', 'Kirby Drive', 'Westheimer Road'],
    intro: [
      'River Oaks homes tend to have large, high-end kitchens with built-in and panel-ready appliances, such as Sub-Zero refrigerators, Wolf ranges, Thermador and Viking cooking equipment, and wine coolers. Those appliances are expensive to replace and are worth repairing properly.',
      'We are licensed for refrigeration work and EPA-certified for refrigerants, and we have more than 16 years of experience on premium brands. That matters for sealed-system problems in built-in refrigerators and wine coolers. 77019 sits right at the edge of our standard distance, and your technician confirms the arrival window by phone.',
    ],
    tips: [
      'For built-in and panel-ready refrigerators, do not move or pull the unit yourself. Call us first, because the panel and the water line can be damaged.',
      'Wine coolers and under-counter beverage units often stop cooling for a different reason than a regular refrigerator, so the repair is different.',
      'Premium ranges and ovens have control boards that can be repaired rather than replaced. We tell you the options.',
      'The $65 diagnostic is applied toward the repair, and we give you a clear quote before any work begins.',
    ],
    faq: [
      ['Do you repair Sub-Zero, Wolf, Thermador and Viking in River Oaks?', 'Yes. We repair premium built-in brands including Sub-Zero, Wolf, Thermador, Viking, JennAir and KitchenAid.'],
      ['Are you licensed to work on refrigerator sealed systems?', 'Yes. We are licensed for refrigeration work and EPA-certified for refrigerants, and the business is insured.'],
      ['Which ZIP codes do you serve in River Oaks?', 'We serve 77019 and 77027. 77027 is in our standard area and 77019 is at the edge, so we confirm timing by phone.'],
      ['Can you repair a wine cooler or beverage center?', 'Yes. We repair wine coolers, beverage centers and ice makers.'],
    ],
    nearby: ['/appliance-repair-galleria-uptown/', '/appliance-repair-montrose/', '/appliance-repair-west-university-place/'],
  },

  '/appliance-repair-galleria-uptown/': {
    name: 'Galleria / Uptown', short: 'the Galleria',
    zips: ['77056', '77057', '77027'],
    places: ['The Galleria', 'Uptown Park', 'Post Oak Boulevard', 'Briargrove', 'Williams Tower area'],
    intro: [
      'The Galleria and Uptown area has a lot of high-rise condos and townhomes next to older residential streets such as Briargrove. Many units have compact or built-in kitchens and a washer-dryer closet, so access and space are as important as the repair itself.',
      'We serve 77056, 77057 and 77027 as part of our standard service area, which makes this one of the quickest parts of town for us to reach. We repair refrigerators, ice makers, washers, dryers, dishwashers, ovens and cooktops, and we quote the repair before any work starts.',
    ],
    tips: [
      'In a high-rise, tell us the building name, unit and any elevator or parking rules when you book.',
      'Condo washer-dryer closets are tight. We check the vent, the drain and the water valves, because leaks in a unit can reach the neighbors below.',
      'For built-in refrigerators, share the brand and model from the label inside the fridge so we bring the right parts.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you serve the Galleria and Uptown?', 'Yes. We serve ZIP codes 77056, 77057 and 77027, which are in our standard service area.'],
      ['Can you repair appliances in a Galleria-area condo?', 'Yes. Tell us the building and unit and any access rules. We plan the visit around them.'],
      ['Do you repair built-in and luxury brands near the Galleria?', 'Yes. We repair Sub-Zero, Thermador, Viking, Wolf, JennAir, Bosch and other brands.'],
      ['What if the repair is not worth it?', 'We tell you honestly after the diagnostic. You decide, and the $65 diagnostic is applied if you go ahead.'],
    ],
    nearby: ['/appliance-repair-river-oaks/', '/appliance-repair-memorial/', '/appliance-repair-west-university-place/'],
  },

  '/appliance-repair-west-university-place/': {
    name: 'West University Place', short: 'West U',
    zips: ['77005'],
    places: ['Rice Village', 'Rice University', 'Weslayan Street', 'Southside Place', 'Braeswood Place'],
    intro: [
      'West University Place, usually called West U, is a city of its own inside the Loop, next to Rice Village and Rice University. The housing is a mix of established homes and newer custom builds, and the kitchens we visit range from classic family kitchens to fully equipped built-in setups.',
      'We repair refrigerators, ice makers, washers, dryers, dishwashers, ovens, cooktops and ranges here, and we also cover neighboring Southside Place and Braeswood Place. 77005 sits at the edge of our standard distance, so your technician confirms the arrival window by phone.',
    ],
    tips: [
      'If your dishwasher or refrigerator is behind custom cabinet panels, tell us when you book so we plan extra time to access it safely.',
      'Families with heavy laundry loads wear out washer bearings and dryer belts. We can often tell you the cause in the first visit.',
      'For ice makers that stop producing ice, we check the water supply and filter before replacing parts.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you serve West University Place and Rice Village?', 'Yes. We serve ZIP 77005, which covers West U and the Rice Village area.'],
      ['Do you repair appliances behind cabinet panels?', 'Yes. Tell us when you book so we plan time to access the appliance without damaging the panel.'],
      ['Is West U in your standard service area?', '77005 sits at the edge of our standard distance, so we confirm timing by phone when you book.'],
      ['Do you quote before repairing?', 'Yes. You get a clear quote after the diagnostic and before any repair starts.'],
    ],
    nearby: ['/appliance-repair-bellaire/', '/appliance-repair-river-oaks/', '/appliance-repair-galleria-uptown/'],
  },

  '/appliance-repair-bellaire/': {
    name: 'Bellaire', short: 'Bellaire',
    zips: ['77401'],
    places: ['Bellaire Town Square', 'Bellaire Boulevard', 'Loop 610', 'Westpark'],
    intro: [
      'Bellaire is a small city inside the Loop with a long mix of mid-century homes, remodeled houses and newer builds. Because many older houses have been updated one room at a time, we often find a new refrigerator and dishwasher in a kitchen that still has older plumbing or electrical.',
      'We serve ZIP 77401 as part of our standard service area, so we can often get to Bellaire quickly. We repair refrigerators, ice makers, washers, dryers, dishwashers, ovens, cooktops and ranges, and we quote the repair before any work starts.',
    ],
    tips: [
      'Older Bellaire houses may have a washer drain that is slower than modern machines expect. If your washer will not drain, we check the standpipe as well as the pump.',
      'If an oven will not heat, we check the igniter or element and the control. Replacement is not always needed.',
      'We tell you when a repair costs more than it is worth. You decide.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you serve Bellaire, TX?', 'Yes. We serve ZIP 77401, which is in our standard service area.'],
      ['Do you repair washers that will not drain?', 'Yes. We check the pump, the hose and the drain connection and fix the cause.'],
      ['Do you repair ovens and cooktops in Bellaire?', 'Yes. We repair gas and electric ovens, cooktops and ranges.'],
      ['How is the diagnostic fee handled?', 'The $65 diagnostic is applied toward the cost of the repair.'],
    ],
    nearby: ['/appliance-repair-west-university-place/', '/appliance-repair-galleria-uptown/', '/appliance-repair-memorial/'],
  },

  '/appliance-repair-memorial/': {
    name: 'Memorial', short: 'Memorial',
    zips: ['77024', '77079', '77055'],
    places: ['Memorial City', 'Memorial Drive', 'Bunker Hill Village', 'Hunters Creek Village', 'Piney Point Village', 'Hedwig Village', 'Spring Valley Village', 'Hilshire Village'],
    intro: [
      'Memorial covers the Memorial Villages (Bunker Hill, Hunters Creek, Piney Point, Hedwig, Spring Valley and Hilshire) as well as the neighborhoods around Memorial City and Memorial Drive. Homes here are often larger, with full-size kitchens, double ovens, wine coolers and second refrigerators in the garage or pantry.',
      'Memorial is next to our base on the Katy Freeway, so it is one of the areas we reach fastest. We serve 77024, 77079 and 77055 as part of our standard service area, including addresses that the post office lists under Houston but sit inside the villages.',
    ],
    tips: [
      'Garage and pantry refrigerators work harder in Houston heat. If the second fridge is warm or the freezer is icing up, call early. A small fault is cheaper than a spoiled load.',
      'Large kitchens often have several appliances from one brand. We can diagnose all of them in one visit if you tell us when you book.',
      'Double ovens and large ranges have separate controls and heating elements for each oven, and we test each one.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you serve the Memorial Villages like Bunker Hill and Piney Point?', 'Yes. We serve Bunker Hill Village, Hunters Creek Village, Piney Point Village, Hedwig Village, Spring Valley Village and Hilshire Village.'],
      ['Which ZIP codes do you serve in Memorial?', 'We serve 77024, 77079 and 77055, all in our standard service area.'],
      ['My garage refrigerator is warm. Can you fix it?', 'Yes. We repair refrigerators, freezers and ice makers, including second refrigerators in garages and pantries.'],
      ['Can you repair several appliances in one visit?', 'Yes. Tell us what is wrong with each one when you book so we plan enough time.'],
    ],
    nearby: ['/appliance-repair-energy-corridor/', '/appliance-repair-galleria-uptown/', '/appliance-repair-the-heights/'],
  },

  '/appliance-repair-energy-corridor/': {
    name: 'Energy Corridor', short: 'the Energy Corridor',
    zips: ['77077', '77079', '77084'],
    places: ['Katy Freeway (I-10)', 'Eldridge Parkway', 'Beltway 8', 'George Bush Park', 'Addicks Reservoir', 'Briar Forest'],
    intro: [
      'The Energy Corridor runs along the Katy Freeway on Houston\'s west side, with homes, townhomes and apartment communities near George Bush Park and Addicks Reservoir. Many people here work long days at nearby offices, so we try to make scheduling easy and tell you the arrival window in advance.',
      'This is our home territory: our shop is on the Katy Freeway, so we can often reach the Energy Corridor quickly. We serve 77077, 77079 and 77084 as part of our standard service area and repair refrigerators, ice makers, washers, dryers, dishwashers, ovens, cooktops and ranges.',
    ],
    tips: [
      'If you work in an office nearby, tell us when you will be home or at the door so the technician can match the visit to your schedule.',
      'In townhomes and apartments, tell us the unit and any parking or gate code when you book.',
      'A washer that shakes or walks across the floor is often a leveling or suspension problem rather than a failed motor. We check it before quoting a part.',
      'The $65 diagnostic is applied toward the repair.',
    ],
    faq: [
      ['Do you serve the Energy Corridor and Briar Forest?', 'Yes. We serve ZIP codes 77077, 77079 and 77084, all in our standard service area.'],
      ['How quickly can you get to the Energy Corridor?', 'It is close to our base on the Katy Freeway. Call or send a request and we confirm the earliest slot.'],
      ['Do you repair appliances in apartments and townhomes here?', 'Yes. Tell us the unit and any access rules when you book.'],
      ['Do you give a quote before repairing?', 'Yes. You get a clear quote after the diagnostic and before any work starts.'],
    ],
    nearby: ['/appliance-repair-memorial/', '/appliance-repair-galleria-uptown/', '/appliance-repair-bellaire/'],
  },
};

// Status of each ZIP in the table (served standard / extended) for display.
export function zipStatus(zip) {
  const r = checkZip(zip);
  return { zip, served: r.status === 'served', far: !!r.far };
}

export const SERVICE_LINKS = [
  ['/fridge-repair/', 'Refrigerator repair'], ['/washer-repair/', 'Washer repair'], ['/dryer-repair/', 'Dryer repair'], ['/dishwasher-repair/', 'Dishwasher repair'],
  ['/oven-repair/', 'Oven repair'], ['/cooktop-repair/', 'Cooktop repair'], ['/range-stove-repair/', 'Range and stove repair'], ['/ice-maker-repair/', 'Ice maker repair'],
];
