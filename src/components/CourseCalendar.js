import React, { Component } from 'react'; 
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/index";

const courses = [
    {
        "name": "Crossbody salsa open level",
        "startTime": "17:30",
        "endTime": "18:45",
        "weeks": 4,
        "instructors": "Elisa & Jan"
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
        "instructors": "Nic & Bella"
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

const CourseRow = ({t, c}) => (
    <tr key={c.name}>
        <td className='time'>{c.startTime} {c.endTime}</td>
        <td colSpan={c.weeks} className="courserow">
            <div className={"course " + c.status}>
                <div className='course-name'>{c.name}</div>
                {c.status === "confirmed" && <p className="status"><FontAwesomeIcon icon={faCheckCircle} size="lg"/> Tilmeldt</p>}
                <div className='course-instructors'>{c.instructors}</div>
            </div>
        </td>
    </tr>
);

const CourseCalendar = ({t}) => {
    return (
        <table className='table coursetable '>
            <thead>
                <tr className='bg-light'>
                    <th className='left-col'></th>
                    <th>Uge<br/>43</th>
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
                <tr>
                    <td colSpan={9} className="weekday">Tirsdag</td>
                </tr>
                {courses.map(c => CourseRow({t, c }))}
                <tr>
                    <td colSpan={9} className="weekday">Onsdag</td>
                </tr>
                {courses2.map(c => CourseRow({t, c}))}
            </tbody>
        </table>
    );
}

export default withTranslation()(CourseCalendar);