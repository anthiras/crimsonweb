import React from 'react';
import ParticipantRow from "./ParticipantRow";
import { withTranslation } from 'react-i18next';
import currency from 'currency.js';

const ParticipantList = ({ t, courseId, participants }) => {
    const totalAmountPaid = participants.reduce((a, b) => a.add(b.participation.amountPaid), currency(0))
    
    return <table className="table">
        <thead>
            <tr>
                <th style={{width: "10%"}}>{t('courses:signupDate')}</th>
                <th style={{width: "5%"}}></th>
                <th style={{width: "25%"}}>{t('common:name')}</th>
                <th style={{width: "10%"}}>{t('common:email')}</th>
                <th style={{width: "10%"}}>{t('courses:role')}</th>
                <th style={{width: "10%"}}>{t('common:status')}</th>
                <th style={{width: "15%"}}>{t('courses:amountPaid')}</th>
                <th style={{width: "15%"}} className="text-right">{t('common:actions')}</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{totalAmountPaid.format()}</td>
                <td></td>
            </tr>
        </tfoot>
        <tbody>
            {participants.map((participant, i) => 
                <ParticipantRow 
                    key={participant.id} 
                    participant={participant} 
                    number={i+1}
                    courseId={courseId} />)}
        </tbody>
    </table>
}

export default withTranslation()(ParticipantList);