import React from 'react';

const Alert = ({ text }) => {
	return text && <div className="alert alert-primary" role="alert">{text}</div>
}

export default Alert;