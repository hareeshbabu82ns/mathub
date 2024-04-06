/**
 * Use Swiss ephemeris to calculate tithi, nakshatra, etc.
 */
import swe, { swe_julday } from "swisseph-v2";

export interface Place {
  latitude: number;
  longitude: number;
  timezone: number;
}

const sidereal_year = 365.256360417; // From WolframAlpha
const _rise_flags = swe.SE_BIT_DISC_CENTER + swe.SE_BIT_NO_REFRACTION;
const SE_RAHU = swe.SE_MEAN_NODE; // I've mapped SE_MEAN_NODE to Rahu
const SE_KETU = swe.SE_PLUTO; // I've mapped Pluto to Ketu
export const planet_list = [
  swe.SE_SUN,
  swe.SE_MOON,
  swe.SE_MARS,
  swe.SE_MERCURY,
  swe.SE_JUPITER,
  swe.SE_VENUS,
  swe.SE_SATURN,
  SE_RAHU, // Rahu = MEAN_NODE
  SE_KETU,
  swe.SE_URANUS,
  swe.SE_NEPTUNE,
];

const revati_359_50 = () =>
  swe.swe_set_sid_mode(swe.SE_SIDM_USER, 1926892.343164331, 0);
const galc_cent_mid_mula = () =>
  swe.swe_set_sid_mode(swe.SE_SIDM_USER, 1922011.128853056, 0);
const set_ayanamsa_mode = () => swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
const reset_ayanamsa_mode = () =>
  swe.swe_set_sid_mode(swe.SE_SIDM_FAGAN_BRADLEY, 0, 0);

// const get_planet_name = (planet: number) => {
//   const names = {
//     [swe.SURYA]: 'Surya',
//     [swe.CHANDRA]: 'Candra',
//     [swe.KUJA]: 'Mangala',
//     [swe.BUDHA]: 'Budha',
//     [swe.GURU]: 'Guru',
//     [swe.SUKRA]: 'Sukra',
//     [swe.SANI]: 'Sani',
//     [swe.RAHU]: 'Rahu',
//     [swe.KETU]: 'Ketu',
//     [swe.PLUTO]: 'Ketu',
//   };
//   return names[planet];
// };

const from_dms = (degs: number, mins: number, secs: number) =>
  degs + mins / 60 + secs / 3600;

const to_dms_prec = (deg: number) => {
  const d = Math.floor(deg);
  const mins = (deg - d) * 60;
  const m = Math.floor(mins);
  const s = parseFloat(((mins - m) * 60).toFixed(6));
  return [d, m, s];
};

const to_dms = (deg: number) => {
  const [d, m, s] = to_dms_prec(deg);
  return [d, m, s];
};

const unwrap_angles = (angles: number[]) => {
  const result = angles;
  for (let i = 1; i < angles.length; i++) {
    if (result[i] < result[i - 1]) {
      result[i] += 360;
    }
  }
  return result;
};

const norm180 = (angle: number) => (angle >= 180 ? angle - 360 : angle);
const norm360 = (angle: number) => angle % 360;

const ketu = (rahu: number) => (rahu + 180) % 360;

// const function = (point: number) => {
//   swe.set_sid_mode(swe.SE_SIDM_USER, point, 0.0);
//   const fval = swe.fixstar_ut('Citra', point, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0] - 180;
//   return fval;
// };

const bisection_search = (
  func: (point: number) => number,
  start: number,
  stop: number
) => {
  let left = start;
  let right = stop;
  const epsilon = 5e-10;
  while (true) {
    const mid = (left + right) / 2;
    const fmid = func(mid);
    if (Math.abs(fmid) < epsilon) {
      return mid;
    }
    if (fmid * func(left) < 0) {
      right = mid;
    } else {
      left = mid;
    }
  }
};

const inverse_lagrange = (x: number[], y: number[], ya: number) => {
  let total = 0;
  for (let i = 0; i < x.length; i++) {
    let term = y[i];
    for (let j = 0; j < x.length; j++) {
      if (j !== i) {
        term *= (ya - x[j]) / (x[i] - x[j]);
      }
    }
    total += term;
  }
  return total;
};

export const gregorian_to_jd = (date: Date) =>
  swe.swe_julday(date.getFullYear(), date.getMonth(), date.getDate(), 0, 1);

const jd_to_gregorian = (jd: number) => swe.swe_revjul(jd, swe.SE_GREG_CAL);

const local_time_to_jdut1 = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minutes = 0,
  seconds = 0,
  timezone = 0.0
) => {
  // const [y, m, d, h, mnt, s]
  const utcTz = swe.swe_utc_time_zone(
    year,
    month,
    day,
    hour,
    minutes,
    seconds,
    timezone
  );
  const jd = swe.swe_utc_to_jd(
    utcTz.year,
    utcTz.month,
    utcTz.day,
    utcTz.hour,
    utcTz.minute,
    utcTz.second,
    swe.SE_GREG_CAL
  ) as { julianDayUT: number; julianDayET: number };

  const jd_et = jd?.julianDayET;
  const jd_ut1 = jd?.julianDayUT;
  return jd_ut1;
};

const nakshatra_pada = (longitude: number) => {
  const one_star = 360 / 27;
  const one_pada = 360 / 108;
  const quotient = Math.floor(longitude / one_star);
  const reminder = longitude - quotient * one_star;
  const pada = Math.floor(reminder / one_pada);
  return [1 + quotient, 1 + pada];
};

const sidereal_longitude = (jd: number, planet: number) => {
  set_ayanamsa_mode();
  const longi = swe.swe_calc_ut(
    jd,
    planet,
    swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL
  ) as { longitude: number };
  reset_ayanamsa_mode();
  return norm360(longi.longitude);
};

const solar_longitude = (jd: number) => sidereal_longitude(jd, swe.SE_SUN);
const lunar_longitude = (jd: number) => sidereal_longitude(jd, swe.SE_MOON);

const sunrise = (jd: number, place: Place): [number, (string | number)[]] => {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const result = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    swe.SE_CALC_RISE,
    0,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const rise = result.transitTime;
  // const rise = result[1][0];
  return [rise + tz / 24, to_dms((rise - jd) * 24 + tz)];
};

const sunset = (jd: number, place: Place): [number, (string | number)[]] => {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const result = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_SET,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const setting = result.transitTime;
  return [setting + tz / 24, to_dms((setting - jd) * 24 + tz)];
};

export const moonrise = (jd: number, place: Place) => {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const date = swe.swe_revjul(jd, swe.SE_GREG_CAL);
  const localTime = local_time_to_jdut1(
    date.year,
    date.month,
    date.day,
    date.hour,
    0,
    0,
    tz
  );
  const result = swe.swe_rise_trans(
    // jd - tz / 24,
    localTime,
    swe.SE_MOON,
    "",
    0,
    swe.SE_CALC_RISE,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const setting = result.transitTime; // julian-day number
  // Convert to local time
  // return to_dms(setting * 24 + tz);
  return to_dms((setting - jd) * 24 + tz);
};

const moonset = (jd: number, place: Place) => {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const result = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_MOON,
    "",
    0,
    swe.SE_CALC_SET,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const setting = result.transitTime;
  return to_dms((setting - jd) * 24 + tz);
};

const tithi = (jd: number, place: Place): [number, number[]] => {
  const tz = place.timezone;
  const rise: any = sunrise(jd, place)[0] - tz / 24;
  const moon_phase: any = lunar_phase(rise);
  const today = Math.ceil(moon_phase / 12);
  const degrees_left = today * 12 - moon_phase;
  const offsets = [0.25, 0.5, 0.75, 1.0];
  const lunar_long_diff = offsets.map(
    (t) => (lunar_longitude(rise + t) - lunar_longitude(rise)) % 360
  );
  const solar_long_diff = offsets.map(
    (t) => (solar_longitude(rise + t) - solar_longitude(rise)) % 360
  );
  const relative_motion = lunar_long_diff.map(
    (moon, i) => moon - solar_long_diff[i]
  );
  const y = relative_motion;
  const x = offsets;
  const approx_end = inverse_lagrange(x, y, degrees_left);
  const ends = (rise + approx_end - jd) * 24 + tz;
  const answer: [number, number[]] = [today, to_dms(ends)];
  const moon_phase_tmrw: any = lunar_phase(rise + 1);
  const tomorrow = Math.ceil(moon_phase_tmrw / 12);
  const isSkipped = (tomorrow - today) % 30 > 1;
  if (isSkipped) {
    // Handle skipped tithi
  }
  return answer;
};

const nakshatra = (jd: number, place: Place) => {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const rise = sunrise(jd, place)[0] - tz / 24;
  const offsets = [0.0, 0.25, 0.5, 0.75, 1.0];
  const longitudes = offsets.map((t) => lunar_longitude(rise + t));
  const nak = Math.ceil((longitudes[0] * 27) / 360);
  // Return nakshatra
};

function yoga(jd: number, place: Place): [number, number[]] {
  /* Yoga at given jd and place.
     1 = Vishkambha, 2 = Priti, ..., 27 = Vaidhrti
  */
  // 1. Find time of sunrise
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const rise = sunrise(jd, place)[0] - tz / 24; // Sunrise at UT 00:00

  // 2. Find the Nirayana longitudes and add them
  const lunar_long = lunar_longitude(rise);
  const solar_long = solar_longitude(rise);
  const total = (lunar_long + solar_long) % 360;

  // There are 27 Yogas spanning 360 degrees
  const yog = Math.ceil((total * 27) / 360);

  // 3. Find how many longitudes is there left to be swept
  const degrees_left = yog * (360 / 27) - total;

  // 3. Compute longitudinal sums at intervals of 0.25 days from sunrise
  const offsets = [0.25, 0.5, 0.75, 1.0];
  const lunar_long_diff = offsets.map(
    (t) => (lunar_longitude(rise + t) - lunar_longitude(rise)) % 360
  );
  const solar_long_diff = offsets.map(
    (t) => (solar_longitude(rise + t) - solar_longitude(rise)) % 360
  );
  const total_motion = lunar_long_diff.map(
    (moon, index) => moon + solar_long_diff[index]
  );

  // 4. Find end time by 4-point inverse Lagrange interpolation
  const y = total_motion;
  const x = offsets;

  // compute fraction of day (after sunrise) needed to traverse 'degrees_left'
  const approx_end = inverse_lagrange(x, y, degrees_left);
  const ends = (rise + approx_end - jd) * 24 + tz;

  const answer: [number, number[]] = [Math.floor(yog), to_dms(ends)];

  // 5. Check for skipped yoga
  const lunar_long_tmrw = lunar_longitude(rise + 1);
  const solar_long_tmrw = solar_longitude(rise + 1);
  const total_tmrw = (lunar_long_tmrw + solar_long_tmrw) % 360;
  const tomorrow = Math.ceil((total_tmrw * 27) / 360);
  const isSkipped = (tomorrow - yog) % 27 > 1;

  if (isSkipped) {
    // Handle skipped yoga
  }

  return answer;
}

function karana(jd: number, place: Place): number[] {
  // 1. Find time of sunrise
  const rise = sunrise(jd, place)[0];
  // 2. Find karana at this JDN
  const solar_long = solar_longitude(rise);
  const lunar_long = lunar_longitude(rise);
  const moon_phase = (lunar_long - solar_long) % 360;
  const today = Math.ceil(moon_phase / 6);
  const degrees_left = today * 6 - moon_phase;
  return [today];
}

function vaara(jd: number): number {
  // Weekday for given Julian day. 0 = Sunday, 1 = Monday,..., 6 = Saturday
  return Math.floor((jd + 1) % 7);
}

function masa(jd: number, place: Place): [number, boolean] {
  // Returns lunar month and if it is adhika or not.
  // 1 = Chaitra, 2 = Vaisakha, ..., 12 = Phalguna
  const ti = tithi(jd, place)[0];
  const critical = sunrise(jd, place)[0];
  const last_new_moon = new_moon(critical, ti, -1);
  const next_new_moon = new_moon(critical, ti, +1);
  const this_solar_month = raasi(last_new_moon);
  const next_solar_month = raasi(next_new_moon);
  const is_leap_month = this_solar_month === next_solar_month;
  const maasa = this_solar_month + 1;
  if (maasa > 12) {
    // Handle case when maasa is greater than 12
  }
  return [maasa, is_leap_month];
}

// epoch-midnight to given midnight
// Days elapsed since beginning of Kali Yuga
const ahargana = (jd: number) => jd - 588465.5;

function elapsed_year(jd: number, maasa_num: number): number[] {
  const ahar = ahargana(jd); // or (jd + sunrise(jd, place)[0])
  const kali = Math.floor((ahar + (4 - maasa_num) * 30) / sidereal_year);
  const saka = kali - 3179;
  const vikrama = saka + 135;
  return [kali, saka, vikrama];
}

// # New moon day: sun and moon have same longitude (0 degrees = 360 degrees difference)
// # Full moon day: sun and moon are 180 deg apart

function new_moon(jd: number, tithi_: number, opt: number = -1): number {
  let start = 0;
  if (opt === -1) {
    start = jd - tithi_; // previous new moon
  }
  if (opt === 1) {
    start = jd + (30 - tithi_); // next new moon
  }
  // Search within a span of (start +- 2) days
  const x: number[] = [
    -2, -1.75, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25,
    1.5, 1.75, 2,
  ];
  const y: number[] = x.map((offset) => lunar_phase(start + offset));
  const y0: number = inverse_lagrange(x, y, 360);
  return start + y0;
}

function raasi(jd: number): number {
  const solar_nirayana: number = solar_longitude(jd);
  // 12 rasis occupy 360 degrees, so each one is 30 degrees
  return Math.ceil(solar_nirayana / 30);
}

function lunar_phase(jd: number): number {
  const solar_long: number = solar_longitude(jd);
  const lunar_long: number = lunar_longitude(jd);
  const moon_phase: number = (lunar_long - solar_long) % 360;
  return moon_phase;
}

function samvatsara(jd: number, maasa_num: number): number {
  const [kali]: number[] = elapsed_year(jd, maasa_num);
  // Change 14 to 0 for North Indian tradition
  // See the function "get_Jovian_Year_name_south" in pancanga.pl
  let samvat: number =
    (kali + 27 + Math.floor((kali * 211 - 108) / 18000)) % 60;
  if (kali >= 4009) {
    samvat = (samvat - 14) % 60;
  }
  return samvat;
}

function ritu(masa_num: number): number {
  return Math.floor((masa_num - 1) / 2);
}

function day_duration(jd: number, place: Place): [number, number[]] {
  const srise = sunrise(jd, place)[0]; // julian day num
  const sset = sunset(jd, place)[0]; // julian day num
  const diff = (sset - srise) * 24; // In hours
  return [diff, to_dms(diff)];
}

// The day duration is divided into 8 parts
// Similarly night duration

function gauri_chogadiya(jd: number, place: Place): string[] {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const srise = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const sset = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_SET,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const day_dur = sset.transitTime - srise.transitTime;

  const end_times: string[] = [];
  for (let i = 1; i < 9; i++) {
    end_times.push(
      to_dms((srise.transitTime + (i * day_dur) / 8 - jd) * 24 + tz).join(", ")
    );
  }

  // Night duration = time from today's sunset to tomorrow's sunrise
  const srise_tmrw = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const night_dur = srise_tmrw.transitTime - sset.transitTime;
  for (let i = 1; i < 9; i++) {
    end_times.push(
      to_dms((sset.transitTime + (i * night_dur) / 8 - jd) * 24 + tz).join(", ")
    );
  }

  return end_times;
}

function trikalam(jd: number, place: Place, option: string = "rahu"): string[] {
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const srise = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const sset = swe.swe_rise_trans(
    jd - tz / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_SET,
    lon,
    lat,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const day_dur = sset.transitTime - srise.transitTime;
  const weekday = vaara(jd);

  const offsets: { [key: string]: number[] } = {
    rahu: [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25],
    gulika: [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0.0],
    yamaganda: [0.5, 0.375, 0.25, 0.125, 0.0, 0.75, 0.625],
  };

  const start_time = srise.transitTime + day_dur * offsets[option][weekday];
  const end_time = start_time + 0.125 * day_dur;

  // to local timezone
  const start_time_local = (start_time - jd) * 24 + tz;
  const end_time_local = (end_time - jd) * 24 + tz;
  return [to_dms(start_time_local).join(","), to_dms(end_time_local).join(",")]; // decimal hours to H:M:S
}

function rahu_kalam(jd: number, place: Place): string[] {
  return trikalam(jd, place, "rahu");
}

function yamaganda_kalam(jd: number, place: Place): string[] {
  return trikalam(jd, place, "yamaganda");
}

function gulika_kalam(jd: number, place: Place): string[] {
  return trikalam(jd, place, "gulika");
}

function durmuhurtam(jd: number, place: Place): [number[], number[]] {
  const { latitude, longitude, timezone } = place;

  // Night = today's sunset to tomorrow's sunrise
  const sset = swe.swe_rise_trans(
    jd - timezone / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_SET,
    longitude,
    latitude,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const srise = swe.swe_rise_trans(
    jd + 1 - timezone / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    longitude,
    latitude,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const night_dur = srise.transitTime - sset.transitTime;

  // Day = today's sunrise to today's sunset
  const sriseDay = swe.swe_rise_trans(
    jd - timezone / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    longitude,
    latitude,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const day_dur = sset.transitTime - sriseDay.transitTime;

  const weekday = vaara(jd);

  // There is one durmuhurtam on Sun, Wed, Sat; the rest have two
  const offsets = [
    [10.4, 0.0], // Sunday
    [6.4, 8.8], // Monday
    [2.4, 4.8], // Tuesday, [day_duration , night_duration]
    [5.6, 0.0], // Wednesday
    [4.0, 8.8], // Thursday
    [2.4, 6.4], // Friday
    [1.6, 0.0],
  ]; // Saturday

  // second durmuhurtam of tuesday uses night_duration instead of day_duration
  const dur = [day_dur, day_dur];
  const base = [srise.transitTime, srise.transitTime];
  if (weekday === 2) {
    dur[1] = night_dur;
    base[1] = sset.transitTime;
  }

  // compute start and end timings
  const start_times: number[] = [0, 0];
  const end_times: number[] = [0, 0];
  for (let i = 0; i < 2; i++) {
    const offset = offsets[weekday][i];
    if (offset !== 0.0) {
      start_times[i] = base[i] + (dur[i] * offsets[weekday][i]) / 12;
      end_times[i] = start_times[i] + (day_dur * 0.8) / 12;

      // convert to local time
      start_times[i] = (start_times[i] - jd) * 24 + timezone;
      end_times[i] = (end_times[i] - jd) * 24 + timezone;
    }
  }

  return [start_times, end_times]; // in decimal hours
}

function abhijit_muhurta(jd: number, place: Place): [number, number] {
  const { latitude, longitude, timezone } = place;
  const srise = swe.swe_rise_trans(
    jd - timezone / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_RISE,
    longitude,
    latitude,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const sset = swe.swe_rise_trans(
    jd - timezone / 24,
    swe.SE_SUN,
    "",
    0,
    swe.SE_CALC_SET,
    longitude,
    latitude,
    _rise_flags,
    0,
    0
  ) as { name: string; transitTime: number };
  const day_dur = sset.transitTime - srise.transitTime;

  const start_time = srise.transitTime + (7 / 15) * day_dur;
  const end_time = srise.transitTime + (8 / 15) * day_dur;

  // to local time
  return [(start_time - jd) * 24 + timezone, (end_time - jd) * 24 + timezone];
}

// 'jd' can be any time: ex, 2015-09-19 14:20 UTC
// today = swe.julday(2015, 9, 19, 14 + 20./60)

function planetary_positions(
  jd: number,
  place: Place
): [number, number, number[], number[]][] {
  const jd_ut = jd - place.timezone / 24;

  const positions: [number, number, number[], number[]][] = [];
  for (const planet of planet_list) {
    let nirayana_long: number;
    if (planet !== SE_KETU) {
      nirayana_long = sidereal_longitude(jd_ut, planet);
    } else {
      // Ketu
      nirayana_long = ketu(sidereal_longitude(jd_ut, SE_RAHU));
    }

    // 12 zodiac signs span 360°, so each one takes 30°
    // 0 = Mesha, 1 = Vrishabha, ..., 11 = Meena
    const constellation = Math.floor(nirayana_long / 30);
    const coordinates = to_dms(nirayana_long % 30);
    positions.push([
      planet,
      constellation,
      coordinates,
      nakshatra_pada(nirayana_long),
    ]);
  }

  return positions;
}

function ascendant(jd: number, place: Place): number[] {
  /* Lagna (=ascendant) calculation at any given time & place */
  const { latitude: lat, longitude: lon, timezone: tz } = place;
  const jd_utc = jd - tz / 24;

  set_ayanamsa_mode(); // needed for swe.houses_ex()

  // returns two arrays, cusps and ascmc, where ascmc[0] = Ascendant
  const nirayana_lagna = swe.swe_houses_ex(
    jd_utc,
    swe.SEFLG_SIDEREAL,
    lat,
    lon,
    ""
  ) as { house: number[] };

  // 12 zodiac signs span 360°, so each one takes 30°
  // 0 = Mesha, 1 = Vrishabha, ..., 11 = Meena
  const constellation = Math.floor(nirayana_lagna.house[0] / 30);
  const coordinates = to_dms(nirayana_lagna.house[0] % 30);

  reset_ayanamsa_mode();
  return [
    constellation,
    ...coordinates,
    ...nakshatra_pada(nirayana_lagna.house[0]),
  ];
}

// http://www.oocities.org/talk2astrologer/LearnAstrology/Details/Navamsa.html
// Useful for making D9 divisional chart
function navamsa_from_long(longitude: number): number {
  /* Calculates the navamsa-sign in which given longitude falls
     0 = Aries, 1 = Taurus, ..., 11 = Pisces
  */
  const one_pada = 360 / (12 * 9); // There are also 108 navamsas
  const one_sign = 12 * one_pada; // = 40 degrees exactly
  const signs_elapsed = longitude / one_sign;
  const fraction_left = signs_elapsed % 1;
  return Math.floor(fraction_left * 12);
}

function navamsa(jd: number, place: Place): [number, number][] {
  /* Calculates navamsa of all planets */
  const jd_utc = jd - place.timezone / 24;

  const positions: [number, number][] = [];
  for (const planet of planet_list) {
    if (planet !== SE_KETU) {
      const nirayana_long = sidereal_longitude(jd_utc, planet);
      positions.push([planet, navamsa_from_long(nirayana_long)]);
    } else {
      // Ketu
      const nirayana_long = ketu(sidereal_longitude(jd_utc, SE_RAHU));
      positions.push([planet, navamsa_from_long(nirayana_long)]);
    }
  }

  return positions;
}
