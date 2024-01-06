import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';
import { Loading, DatePicker } from './Utilities';
import { ConfirmModal } from './ConfirmModal';
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'
import useUserActions from '../actions/users';

const UserProfile = ({ t, user, uiState, allowDelete }) => {
    const {
		submitProfile,
		editProfileField,
		deleteUser
	} = useUserActions();

    const [draft, setDraft] = useState(user);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const setProfileField = (key, value) => {
        var state = Object.assign({}, draft);
        state[key] = value;
        setDraft(state);
        editProfileField();
    }

	const handleInput = (key, e) => {
	    var value = e.target === undefined ? e : e.target.value;
        setProfileField(key, value);
	}

    const handleBirthDate = (value) => {
        setProfileField('birthDate', value);
    }

	const handleSubmit = (e) => {
		e.preventDefault();
        submitProfile(draft);
	}

    const confirmDelete = (e) => {
        setDeleteModalVisible(false);
        deleteUser(draft.id);
    }

    if (user == null) {
        return <Loading />;
    }
    
    const { name, birthDate, gender, email } = draft;

    const buttonText =
        uiState === UISTATE_SAVING ? t('common:saving') :
        uiState === UISTATE_SAVED ? t('common:saved') :
            t('actions:saveInfo');

    return (
        <Form onSubmit={handleSubmit}>
            <section>
                <legend>{t('titles:myProfile')}</legend>
                <Form.Group controlId='name' className="mb-2">
                    <Form.Label>{t('common:name')}</Form.Label>
                    <Form.Control type="text" required value={name || ''} onChange={(e)=>handleInput('name', e)} />
                </Form.Group>
                <Form.Group controlId='email' className="mb-2">
                    <Form.Label>{t('common:email')}</Form.Label>
                    <Form.Control type="text" plaintext readOnly value={email || ''} />
                </Form.Group>
                <Form.Group controlId='birthDate' className="mb-2">
                    <Form.Label>{t('users:birthDate')}</Form.Label>
                    <DatePicker date={birthDate} onChange={handleBirthDate} id="birthDate" />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>{t('users:gender')}</Form.Label>
                    <Form.Check type='radio' name='gender' value="male" id="gender_male" onChange={(e) => handleInput('gender', e)}
                        checked={gender === "male"} required label={t('users:male')} />
                    <Form.Check type="radio" name="gender" value="female" id="gender_female" onChange={(e) => handleInput('gender', e)}
                        checked={gender === "female"} required label={t('users:female')} />
                </Form.Group>
                <Form.Group className="mb-2">
                    {uiState === UISTATE_SAVE_FAILED && <Alert variant="danger">{t('common:errorSaving')}</Alert>}
                    <Button type="submit" variant={uiState === UISTATE_SAVED ? "success" : "primary"}>{buttonText}</Button>
                    {" "}
                    {allowDelete && <Button type="button" variant="danger" onClick={() => setDeleteModalVisible(true)}>{t('actions:deleteProfile')}</Button>}
                </Form.Group>
                <ConfirmModal 
                    visible={deleteModalVisible} 
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteModalVisible(false)} 
                    title={t('common:pleaseConfirm')} 
                    confirmText={t('common:delete')} 
                    cancelText={t('common:cancel')} >
                    {t('users:confirmDeleteProfile')}
                </ConfirmModal>
            </section>
        </Form>
    );
};

export default withTranslation()(UserProfile);