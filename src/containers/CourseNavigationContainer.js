import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';
import { selectCourseList } from '../reducers/courses';
import CourseNavigation from '../components/CourseNavigation'

const selectCourseNavigation = createSelector(
  [selectCourseList],
  (courseList) => {
    const links = courseList == null ? null : courseList['links']
    return {
      links: links
    };
  }
);

const CourseNavigationContainer = () => {
  const { list } = useParams();
  const { links } = useSelector((state) => selectCourseNavigation(state, list));

  return <CourseNavigation list={list} links={links} />
}

export default CourseNavigationContainer;