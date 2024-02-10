import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FloatingButton = ({linkTo, icon}) => {
    const navigate = useNavigate();
    return <Button
        className='rounded-circle border border-2 border-white text-white'
        variant='primary'
        size='lg'
        style={{position: 'fixed', right: '30px', bottom: '30px'}}
        onClick={() => navigate(linkTo)}>
        <FontAwesomeIcon icon={icon} />
    </Button>
}

export default FloatingButton;