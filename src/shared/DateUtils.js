import { parse } from 'date-fns'
import { enUS, da } from 'date-fns/locale'
import i18n from '../shared/i18n';
import getWeek from 'date-fns/getWeek'
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
require('date-time-format-timezone');

const currentLocale = () => i18n.language === 'da' ? da : enUS;

// Parse UTC date string and convert to local time
const parseUtcDate = value => utcToZonedTime(parse(value+'Z', "yyyy-MM-dd HH:mm:ssX", new Date()), process.env.REACT_APP_TIMEZONE);

// Parse local date string
const parseLocalDate = value => parse(value, "yyyy-MM-dd HH:mm:ss", new Date());

const formatDate = date => format(date, "Pp", { locale: currentLocale() });

const toUtc = date => zonedTimeToUtc(date, process.env.REACT_APP_TIMEZONE);

const weekNumber = date => getWeek(date, { locale: da });

export { parseUtcDate, parseLocalDate, formatDate, toUtc, weekNumber }
