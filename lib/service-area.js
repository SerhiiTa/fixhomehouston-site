// Service area by ZIP. Core = within 10 miles of 77043 (ZIP centroid distance, approximate).
// Extended = ZIPs of neighborhoods we advertise (site + Google profile) that are beyond 10 miles: also served, flagged `far` so travel time can be confirmed on the call.
export const CORE_ZIPS = ['77043', '77080', '77079', '77024', '77055', '77041', '77042', '77077', '77040', '77063', '77092', '77057', '77084', '77056', '77082', '77036', '77072', '77091', '77315', '77064', '77081', '77095', '77018', '77027', '77088', '77074', '77008', '77086', '77046', '77065', '77094', '77401', '77083', '77099', '77007'];
export const EXTENDED_ZIPS = {
  '77022': ['The Heights', 11.1],
  '77002': ['Downtown', 12.5],
  '77003': ['Downtown', 13.8],
  '77004': ['Midtown', 13.1],
  '77005': ['West U', 10.1],
  '77006': ['Montrose', 11.0],
  '77009': ['Heights', 11.6],
  '77010': ['Downtown', 12.5],
  '77019': ['River Oaks', 10.0],
  '77098': ['Montrose', 10.2],
  '77373': ['Spring', 20.4],
  '77379': ['Spring', 16.2],
  '77388': ['Spring', 17.8],
  '77389': ['Spring', 20.9],
  '77449': ['Katy', 10.7],
  '77450': ['Katy', 11.1],
  '77478': ['Sugar Land', 13.1],
  '77479': ['Sugar Land', 15.9],
  '77493': ['Katy', 16.7],
  '77494': ['Katy', 16.8],
  '77498': ['Sugar Land', 12.6],
};

export function checkZip(input) {
  const zip = String(input || '').trim().slice(0, 5);
  if (!/^\d{5}$/.test(zip)) return { status: 'invalid', zip };
  if (CORE_ZIPS.includes(zip)) return { status: 'served', far: false, zip };
  if (EXTENDED_ZIPS[zip]) return { status: 'served', far: true, zip, area: EXTENDED_ZIPS[zip][0], miles: EXTENDED_ZIPS[zip][1] };
  return { status: 'outside', zip };
}
