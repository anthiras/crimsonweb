import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCourseActions from '../actions/courses'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit';
import { selectCourseList, selectCoursesById } from '../reducers/courses';
import CourseCards from '../components/CourseCards'
import CourseCalendar from '../components/CourseCalendar';

const selectCourseListPage = createSelector(
  [selectCoursesById, selectCourseList, (_s, _l, page) => page],
  (coursesById, courseList, page) => {
    const courseIds = courseList.pages[page];
    const coursesOnCurrentPage = courseIds ? courseIds.map(courseId => coursesById[courseId]) : [];
  
    return {
      courses: coursesOnCurrentPage,
      isFetching: courseList.isFetching,
      lastPage: courseList.lastPage
    }
  }
);

const CourseList = ({ list }) => {
  let { page } = useParams();
  page = page ? parseInt(page) : 1;
  const { fetchCourses } = useCourseActions();
  const { courses, isFetching, lastPage } = useSelector((state) => selectCourseListPage(state, list, page));

  useEffect(() => {
    fetchCourses(list, page);
  }, [list, page]);

  return <CourseCards courses={courses} page={page} lastPage={lastPage} list={list} isFetching={isFetching} />
}


export default CourseList;