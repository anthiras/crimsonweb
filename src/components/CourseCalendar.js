import React, { Component } from 'react'; 
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";
import { getDateOfISOWeek } from '../shared/DateUtils';
import styles from './CourseCalendar.module.css';

const courses = [
    {
        "name": "Crossbody salsa open level",
        "startTime": "17:30",
        "endTime": "18:45",
        "weeks": 4,
        "instructors": "Elisa & Jan",
        "weekday": "Tir"
    },
    {
        "name": "Zouk 1",
        "startTime": "19:00",
        "endTime": "20:15",
        "weeks": 8,
        "instructors": "Randi & Peter",
        "status": "confirmed"
    }
];

const courses2 = [
    {
        "name": "Cuban salsa intermediate",
        "startTime": "17:30",
        "endTime": "18:45",
        "weeks": 8,
        "instructors": "Nic & Bella",
        "weekday": "Ons"
    },
    {
        "name": "Cuban salsa beginners",
        "startTime": "17:30",
        "endTime": "18:45",
        "weeks": 8,
        "instructors": "John Doe"
    },
    {
        "name": "Workshop",
        "startTime": "17:30",
        "endTime": "18:45",
        "weeks": 1,
        "instructors": "Elisa & Jan"
    }
];

const CourseRow = ({t, c, yearWeeks }) => (
    <tr key={c.id}>
        <th></th>
        {yearWeeks.map(yearWeek => <td>
            {yearWeek === c.yearWeeks[0] && 
                <div className={styles.course + " " + styles["weeks-"+c.weeks] + " " + (c.status === "confirmed" ? "bg-success text-white" : "")}
                onClick={(e) => console.log(c.name)}>
                <div className={styles.title}>{c.name}</div>
                {c.status === "confirmed" && <p className={styles.status}><FontAwesomeIcon icon={faCheckCircle} size="lg"/> Tilmeldt</p>}
                <div className={styles.subtitle}>{c.startTime} — {c.endTime}</div>
            </div>
            }
        </td>)}
    </tr>
);

const date = (yearWeek, weekday) => 
    getDateOfISOWeek(yearWeek.substr(0, 4), yearWeek.substr(4, 6)) + weekday;

const WeekdayRows = ({t, courses, yearWeeks, weekday}) =>
    <React.Fragment>
        <tr className={styles.dates}>
            <th>{weekday}</th>
            {yearWeeks.map(yearWeek => <td>{date(yearWeek, weekday)}</td>)}
        </tr>
        {courses.map(c => CourseRow({t, c, yearWeeks }))}
    </React.Fragment>;

const allWeeks = courses => [...new Set(courses.flatMap(c => c.weekNumbers))].sort()

const allWeekdays = courses => [...new Set(courses.map(c => c.weekday))].sort();

const CourseTable = ({t, courses }) => {
    const yearWeeks = allWeeks(courses);
    const weekdays = allWeekdays(courses);
    
    return (<table className={'table table-vertical-borders ' + styles.table}>
        <thead className='sticky'>
            <tr>
                <th></th>
                <th>Uge {yearWeeks[0]}</th>
                {yearWeeks.slice(1).map(week => <th>{week}</th>)}
            </tr>
        </thead>
        <tbody>
            {weekdays.map(weekday =>
                <WeekdayRows t={t} courses={courses.filter(c => c.weekday === weekday)} yearWeeks={yearWeeks} weekday={weekday} />
            )}
        </tbody>
    </table>);
}

class CourseCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCourse: null
        };

        this.nextTable = React.createRef();

        this.toggleCourse = this.toggleCourse.bind(this);
        this.next = this.next.bind(this);
    }


    toggleCourse(c) {
        if (this.state.activeCourse === c) {
            this.setState({activeCourse: null});
        } else {
            this.setState({activeCourse: c});
        }
    }

    next() {
        this.nextTable.current.scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        const { t } = this.props;
        const toggleCourse = this.toggleCourse;
        const activeCourse = this.state.activeCourse

        return (
            <div className={'row '+ styles.row}>
            <div className={styles.container}>
            <table className={'table table-vertical-borders ' + styles.table}>
                <thead className='sticky'>
                    <tr>
                        <th>Denne blok</th>
                        <th>Uge 43</th>
                        <th>44</th>
                        <th>45</th> 
                        <th>46</th>
                        <th>47</th>
                        <th>48</th>
                        <th>49</th>
                        <th>50</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.dates}>
                        <th>Tir</th>
                        <td>18. okt</td>
                        <td>25. okt</td>
                        <td>1. nov</td>
                        <td>8. nov</td>
                        <td>15. nov</td>
                        <td>22. nov</td>
                        <td>29. nov</td>
                        <td>6. dec</td>
                    </tr>
                    {courses.map(c => CourseRow({t, c, toggleCourse, isActive: c.name === activeCourse }))}
                    <tr className={styles.dates}>
                        <th>Ons</th>
                        <td>19. okt</td>
                        <td>26. okt</td>
                        <td>2. nov</td>
                        <td>9. nov</td>
                        <td>16. nov</td>
                        <td>23. nov</td>
                        <td>30. nov</td>
                        <td>7. dec</td>
                    </tr>
                    {courses2.map(c => CourseRow({t, c, toggleCourse, isActive: c.name === activeCourse }))}
                </tbody>
            </table>
            <table className={'table table-vertical-borders ' + styles.table} ref={this.nextTable}>
                <thead className='sticky'>
                    <tr>
                        <th><a href="#next" onClick={this.next}>Næste blok</a></th>
                        <th>Uge 43</th>
                        <th>44</th>
                        <th>45</th> 
                        <th>46</th>
                        <th>47</th>
                        <th>48</th>
                        <th>49</th>
                        <th>50</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.dates}>
                        <th>Tir</th>
                        <td>18. okt</td>
                        <td>25. okt</td>
                        <td>1. nov</td>
                        <td>8. nov</td>
                        <td>15. nov</td>
                        <td>22. nov</td>
                        <td>29. nov</td>
                        <td>6. dec</td>
                    </tr>
                    {courses.map(c => CourseRow({t, c, toggleCourse, isActive: c.name === activeCourse }))}
                    <tr className={styles.dates}>
                        <th>Ons</th>
                        <td>19. okt</td>
                        <td>26. okt</td>
                        <td>2. nov</td>
                        <td>9. nov</td>
                        <td>16. nov</td>
                        <td>23. nov</td>
                        <td>30. nov</td>
                        <td>7. dec</td>
                    </tr>
                    {courses2.map(c => CourseRow({t, c, toggleCourse, isActive: c.name === activeCourse }))}
                </tbody>
            </table>
            </div>
            </div>
        );
    }
}

export default withTranslation()(CourseCalendar);