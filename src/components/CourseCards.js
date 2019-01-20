import React from 'react';
import CourseListItem from '../containers/CourseListItem'

export const CourseCards = ({ courses }) => (
    <div className="card-columns">
        {courses.map(course =>
            <CourseListItem course={course} key={course.id} />
        )}
    </div>
)
