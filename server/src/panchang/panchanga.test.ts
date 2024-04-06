import { moonrise, Place, gregorian_to_jd } from "./panchanga";

const bangalore: Place = {
  longitude: 12.972,
  latitude: 77.594,
  timezone: +5.5,
};
const date1 = gregorian_to_jd(new Date(2009, 7, 15));
const date2 = gregorian_to_jd(new Date(2013, 1, 18));

test("myFunction does something", () => {
  const mr = moonrise(date2, bangalore);
  expect(mr).toBe([11, 32, 4]);
});

// // ----- TESTS ------

// function all_tests(): void {
//   console.log(moonrise(date2, bangalore)); // Expected: 11:32:04
//   console.log(moonset(date2, bangalore)); // Expected: 24:8:47
//   console.log(sunrise(date2, bangalore)[1]); // Expected:  6:49:47
//   console.log(sunset(date2, bangalore)[1]); // Expected: 18:10:25
//   assert(vaara(date2) == 5);
//   // On this day, Nakshatra and Yoga are skipped!
//   console.log(sunrise(date4, shillong)[1]);
//   assert(karana(date2, helsinki) == [14]); // Expected: 14, Vanija
//   return;
// }

// function tithi_tests(): void {
//   console.log((feb3 = gregorian_to_jd(new Date(2013, 2, 3))));
//   console.log((apr24 = gregorian_to_jd(new Date(2010, 4, 24))));
//   console.log((apr19 = gregorian_to_jd(new Date(2013, 4, 19))));
//   console.log((apr20 = gregorian_to_jd(new Date(2013, 4, 20))));
//   console.log((apr21 = gregorian_to_jd(new Date(2013, 4, 21))));
//   // Expected: krishna ashtami (23), ends at 27:07:38
//   console.log(tithi(date1, bangalore));
//   console.log(tithi(date2, bangalore)); // Expected: Saptami, ends at 16:24:19
//   // Expected: Krishna Saptami, ends at 25:03:30
//   console.log(tithi(date3, bangalore));
//   console.log(tithi(date2, helsinki)); // Expected: Shukla saptami until 12:54:19
//   // Expected: [10, [6,9,29], 11, [27, 33, 58]]
//   console.log(tithi(apr24, bangalore));
//   // Expected: [22, [8,14,6], 23, [30, 33, 17]]
//   console.log(tithi(feb3, bangalore));
//   console.log(tithi(apr19, helsinki)); // Expected: [9, [28, 45, 0]]
//   console.log(tithi(apr20, helsinki)); // Expected: [10, [29, 22, 7]]
//   console.log(tithi(apr21, helsinki)); // Expected: [10, [5, 22, 6]]
//   return;
// }

// function nakshatra_tests(): void {
//   // Expected: 27 (Revati), ends at 17:06:37
//   console.log(nakshatra(date1, bangalore));
//   // Expected: 27 (Revati), ends at 19:23:09
//   console.log(nakshatra(date2, bangalore));
//   // Expecred: 24 (Shatabhisha) ends at 26:32:43
//   console.log(nakshatra(date3, bangalore));
//   // Expected: [3, [5,1,14]] then [4,[26,31,13]]
//   console.log(nakshatra(date4, shillong));
//   return;
// }

// function yoga_tests(): void {
//   // Expected: Vishkambha (1), ends at 22:59:45
//   console.log(yoga(date3, bangalore));
//   // Expected: Siddha (21), ends at 29:10:56
//   console.log(yoga(date2, bangalore));
//   // [16, [6,20,33], 17, [27,21,58]]
//   console.log(yoga(may22, helsinki));
// }

// function masa_tests(): void {
//   // Pusya (10)
//   console.log(masa(jd, bangalore));
//   // Shravana (5) amavasya
//   console.log(masa(aug17, bangalore));
//   // Adhika Bhadrapada [6, True]
//   console.log(masa(aug18, bangalore));
//   // Normal Bhadrapada [6, False]
//   console.log(masa(sep19, bangalore));
//   // Vaisakha [2]
//   console.log(masa(may20, helsinki));
//   // Jyestha [3]
//   console.log(masa(may21, helsinki));
// }

// function ascendant_tests(): void {
//   assert(ascendant(jd, bangalore) == [2, [4, 37, 10], [5, 4]]);
//   assert(ascendant(jd, bangalore) == [8, [20, 23, 31], [20, 3]]);
// }

// function navamsa_tests(): void {
//   jd = swe.julday(2015, 9, 25, 13 + 29 / 60 + 13 / 3600);
//   nv = navamsa(jd, bangalore);
//   expected = [
//     [0, 11],
//     [1, 5],
//     [4, 1],
//     [2, 2],
//     [5, 4],
//     [3, 10],
//     [6, 4],
//     [10, 11],
//     [9, 5],
//     [7, 10],
//     [8, 10],
//   ];
//   assert(nv == expected);
// }

// function test(): void {
//   const sys = require("sys");
//   const bangalore = Place(12.972, 77.594, +5.5);
//   const shillong = Place(25.569, 91.883, +5.5);
//   const helsinki = Place(60.17, 24.935, +2.0);
//   const date1 = gregorian_to_jd(new Date(2009, 7, 15));
//   const date2 = gregorian_to_jd(new Date(2013, 1, 18));
//   const date3 = gregorian_to_jd(new Date(1985, 6, 9));
//   const date4 = gregorian_to_jd(new Date(2009, 6, 21));
//   const apr_8 = gregorian_to_jd(new Date(2010, 4, 8));
//   const apr_10 = gregorian_to_jd(new Date(2010, 4, 10));
//   all_tests();
//   tithi_tests();
//   nakshatra_tests();
//   yoga_tests();
//   masa_tests();
//   ascendant_tests();
//   navamsa_tests();
//   // new_moon(jd);
// }
