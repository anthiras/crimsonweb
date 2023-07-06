import { parse } from 'date-fns'
import { enUS, da } from 'date-fns/locale'
import i18n from '../shared/i18n';
import getWeek from 'date-fns/getWeek';
import add from 'date-fns/add';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentLocale = () => i18n.language === 'da' ? da : enUS;

// Parse UTC date string and convert to local time
const parseUtcDate = value => utcToZonedTime(parse(value+'Z', "yyyy-MM-dd HH:mm:ssX", new Date()), process.env.REACT_APP_TIMEZONE);

// Parse local date string
const parseLocalDate = value => parse(value, "yyyy-MM-dd HH:mm:ss", new Date());

const formatDate = date => format(date, "Pp", { locale: currentLocale() });

const toUtc = date => zonedTimeToUtc(date, process.env.REACT_APP_TIMEZONE);

const weekNumber = date => getWeek(date, { locale: da });

const yearAndWeek = date => `${date.getFullYear()}${weekNumber(date).toFixed(2)}`;

const addWeeks = (date, weeks) => add(date, { weeks });

function getDateOfISOWeek(y, w) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

export { parseUtcDate, parseLocalDate, formatDate, toUtc, weekNumber, yearAndWeek, addWeeks, getDateOfISOWeek }
