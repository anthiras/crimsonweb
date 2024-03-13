import React from 'react'; 
import { withTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import { weekdayToDate, parseYearAndWeek, yearWeekAndWeekdayToDate, parseLocalDate, allWeeks } from '../shared/DateUtils';
import CourseCard from './CourseCard';
import { Pagination } from './Utilities';
import useWindowDimensions from '../hooks/useWindowDimensions';
import styles from './CourseCalendar.module.css';

const CourseRow = ({t, courses, yearWeeks }) => {
    const coursesByWeek = courses.reduce((result, c) => {
        result[c.yearWeeks[0]] = c;
        return result;
    }, {});

    return <tr>
        {yearWeeks.map(yearWeek => <td key={yearWeek}>
            {coursesByWeek[yearWeek] && 
            <div className='position-relative p-0'>
                <div className='position-absolute z-1' 
                    style={{ width: `calc(${coursesByWeek[yearWeek].weeks}00% + ${coursesByWeek[yearWeek].weeks-1}px)`}}>
                    <CourseCard t={t} course={coursesByWeek[yearWeek]} />
                </div>
            </div>
            }
        </td>)}
    </tr>;
}

const arrangeCoursesIntoRows = courses => {
    let rows = [[]];

    const anyCoursesOverlap = c => {
        let yearWeeks = c.flatMap(c => c.yearWeeks);
        return yearWeeks.length > new Set(yearWeeks).size; // duplicate weeks
    }

    courses.forEach(c => {
        let rowIndex = 0;
        // Go to next row if adding this course would cause an overlap
        while (anyCoursesOverlap([c, ...rows[rowIndex]])) {
            rowIndex++;
            if (rowIndex > rows.length - 1) {
                // Add row
                rows.push([]);
            }
        }
        rows[rowIndex].push(c);
    });

    return rows;
}

const WeekdayRows = ({t, courses, yearWeeks, weekday}) => {
    const rows = arrangeCoursesIntoRows(courses);
    return <>
        <tr className={styles.dates}>
            <th className='sticky-left' rowSpan={rows.length+1}>{t('courses:weekday', { date: weekdayToDate(weekday) })}</th>
            {yearWeeks.map(yearWeek => <DateHeader key={yearWeek} t={t} yearWeek={yearWeek} weekday={weekday} />)}
        </tr>
        {rows.map((c, i) => <CourseRow t={t} courses={c} yearWeeks={yearWeeks} key={i} />)}
    </>;
}

const DateHeader = ({t, yearWeek, weekday }) => {
    const { year, week } = parseYearAndWeek(yearWeek);
    return <td>{t('courses:shortDate', { date: yearWeekAndWeekdayToDate(year, week, weekday)})}</td>
}

const calendarWeeks = courses => {
    const start = parseLocalDate(courses.map(c => c.startsAt).sort()[0]);
    const end = parseLocalDate(courses.map(c => c.endsAt).sort().reverse()[0]);
    return allWeeks(start, end);
}

const allWeekdays = courses => [...new Set(courses.map(c => c.weekday))].sort();

const CourseCalendar = ({t, courses, page, lastPage, list, isFetching }) => {
    const { width } = useWindowDimensions();

    if (!courses.length)
        return <div></div>;

    const yearWeeks = calendarWeeks(courses);
    const weekdays = allWeekdays(courses);

    const pct = width > 992 ? 6 : 11;

    const tableWidth = yearWeeks.length * pct + 12;
    
    return <>
        <div className='w-100 overflow-x-scroll'>
            <table className={'table table-vertical-borders ' + styles.table} style={{ width: tableWidth + '%'}}>
                <thead className='sticky'>
                    <tr>
                        <th className='sticky-left'></th>
                        <th>{t('common:week')} {parseYearAndWeek(yearWeeks[0]).week}</th>
                        {yearWeeks.slice(1).map(week => <th key={week}>{parseYearAndWeek(week).week}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {weekdays.map(weekday =>
                        <WeekdayRows 
                            key={weekday}
                            t={t}
                            courses={courses.filter(c => c.weekday === weekday)}
                            yearWeeks={yearWeeks} weekday={weekday} />
                    )}
                </tbody>
            </table>
        </div>
        {lastPage > 1 && <Container>
            <Pagination page={page} lastPage={lastPage} urlForPage={(page) => '/courses/'+list+'/'+page} />
        </Container>}
    </>;
}

export default withTranslation()(CourseCalendar);