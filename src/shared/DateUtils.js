import { parse, addDays } from 'date-fns'
import { enUS, da } from 'date-fns/locale'
import i18n from '../shared/i18n';
import getWeek from 'date-fns/getWeek';
import add from 'date-fns/add';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentLocale = () => i18n.language === 'da' ? da : enUS;

// Parse UTC date string and convert to local time
export const parseUtcDate = value => utcToZonedTime(parse(value+'Z', "yyyy-MM-dd HH:mm:ssX", new Date()), process.env.REACT_APP_TIMEZONE);

// Parse local date string
export const parseLocalDate = value => parse(value, "yyyy-MM-dd HH:mm:ss", new Date());

export const formatDate = date => format(date, "P", { locale: currentLocale() });

export const toUtc = date => zonedTimeToUtc(date, process.env.REACT_APP_TIMEZONE);

export const weekNumber = date => getWeek(date, { locale: da });

export const yearAndWeek = date => `${date.getFullYear()}${String(weekNumber(date)).padStart(2, '0')}`;

export const parseYearAndWeek = yearWeek => ({
    year: parseInt(yearWeek.substr(0, 4)),
    week: parseInt(yearWeek.substr(4, 6))
});

export const addWeeks = (date, weeks) => add(date, { weeks });

export function getDateOfISOWeek(y, w) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}


const someSunday = new Date('2024-01-14T13:00:00');
export const weekdayToDate = weekday => addDays(someSunday, weekday);

export const yearWeekAndWeekdayToDate = (year, week, weekday) => {
    const daysToAdd = weekday === 0 ? 6 : weekday - 1;
    return addDays(getDateOfISOWeek(year, week), daysToAdd);
}

export const allWeeks = (dateFrom, dateTo) => {
    const weeks = [];
    let date = dateFrom;
    while (date <= dateTo) {
        weeks.push(yearAndWeek(date));
        date = addWeeks(date, 1);
    }
    return weeks;
}
