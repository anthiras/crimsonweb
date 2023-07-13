import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/index";

const MembershipStep = ({ isCompleted, title, completedMessage, children }) => 
    <Card bg={isCompleted ? 'success' : ''} text={isCompleted ? 'white' : 'dark'} className='mb-2'>
        <Card.Body>
            <Card.Title>{title}</Card.Title>
            {isCompleted && <p>
                <FontAwesomeIcon icon={faCheckCircle} size="lg"/>
                <span> {completedMessage}</span>
            </p>}
            {children}
        </Card.Body>
    </Card>;

export default MembershipStep;
