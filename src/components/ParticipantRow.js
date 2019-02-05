import React from 'react';

const ParticipantRow = ({ participant, number }) => {
    const {
        picture,
        name,
        participation
    } = participant;

    return <tr>
        <td>{number}</td>
        <td><img src={picture} width="50" height="50" alt={name} /></td>
        <td>{name}</td>
        <td>{participation.role}</td>
        <td>{participation.createdAt}</td>
        <td>{participation.status}</td>
        <td>
            {participation.status === 'pending' && (
                <React.Fragment>
                    <button type="button" className="btn btn-success">Confirm</button>{" "}
                    <button type="button" className="btn btn-danger">Cancel</button>
                </React.Fragment>
            )}
            {participation.status === 'confirmed' && (
                <button type="button" className="btn btn-danger">Cancel</button>
            )}
        </td>
    </tr>
}

export default ParticipantRow;