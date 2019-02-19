import React from 'react';
import { connect } from 'react-redux'
import {
  toggleSignupModal,
  signup,
  cancelSignup
} from '../actions/courses'
import CourseCard from '../components/CourseCard'

const CourseListItem = ({ course, setParticipationStatus, toggleSignupModal, signup, cancelSignup }) => {
	return (<CourseCard 
		course={course} 
		key={course.id} 
		toggleSignupModal={toggleSignupModal} 
		signup={signup} 
		cancelSignup={cancelSignup} />);
}

const actionCreators = {
	toggleSignupModal,
	signup,
	cancelSignup
}

export default connect(null, actionCreators)(CourseListItem);