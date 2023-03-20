import React, { Component } from 'react'; 
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";
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

const CourseRow = ({t, c, toggleCourse, isActive }) => (
    <tr key={c.name} className={isActive ? styles.active : ""}>
        <th></th>
        <td>
            <div className={styles.course + " " + styles["weeks-"+c.weeks] + " " + (c.status === "confirmed" ? "bg-success text-white" : "")}
                onClick={(e) => toggleCourse(c.name)}>
                <div className={styles.title}>{c.name}</div>
                {c.status === "confirmed" && <p className={styles.status}><FontAwesomeIcon icon={faCheckCircle} size="lg"/> Tilmeldt</p>}
                <div className={styles.subtitle}>{c.startTime} — {c.endTime}</div>
            </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
);

class CourseCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCourse: null
        };

        this.toggleCourse = this.toggleCourse.bind(this);
    }


    toggleCourse(c) {
        if (this.state.activeCourse === c) {
            this.setState({activeCourse: null});
        } else {
            this.setState({activeCourse: c});
        }
    }

    render() {
        const { t } = this.props;
        const toggleCourse = this.toggleCourse;
        const activeCourse = this.state.activeCourse

        return (
            <table className={'table table-vertical-borders ' + styles.table}>
                <thead className='sticky'>
                    <tr>
                        <th className='text-right'>Uge</th>
                        <th>43</th>
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
        );
    }
}

export default withTranslation()(CourseCalendar);