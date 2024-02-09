import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const FloatingButton = ({linkTo, icon}) => {
    return <Button className='rounded-circle border border-2 border-white text-white' variant='primary' size='lg'
        style={{position: 'fixed', right: '30px', bottom: '30px'}}>
        <Link to={linkTo} className='text-white text-decoration-none'>
            <FontAwesomeIcon icon={icon} />
        </Link>
    </Button>
}

export default FloatingButton;