import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';
import { UISTATE_SAVED, UISTATE_SAVE_FAILED, UISTATE_SAVING } from '../shared/uiState'
import useUserActions from '../actions/users';

const UserName = ({ t, user, uiState }) => {
    const {
		submitProfile,
		editProfileField,
	} = useUserActions();

    const [name, setName] = useState(user.name);

	const handleInput = (e) => {
	    var value = e.target === undefined ? e : e.target.value;
        setName(value);
        editProfileField();
	}

	const handleSubmit = (e) => {
		e.preventDefault();
        submitProfile({ id: user.id, name });
	}

    const buttonText =
        uiState === UISTATE_SAVING ? t('common:saving') :
        uiState === UISTATE_SAVED ? t('common:saved') :
            t('actions:saveInfo');

    return (<Container fluid>
        <Form onSubmit={handleSubmit}>
            <section>
                <Form.Group controlId='name' className="mb-2">
                    <Form.Label>{t('common:name')}</Form.Label>
                    <Form.Control type="text" required value={name || ''} onChange={handleInput} pattern="[^@]+" title={t('users:nameNotEmail')} />
                </Form.Group>
                <Form.Group className="mb-2">
                    {uiState === UISTATE_SAVE_FAILED && <Alert variant="danger">{t('common:errorSaving')}</Alert>}
                    <Button type="submit" variant={uiState === UISTATE_SAVED ? "success" : "primary"}>{buttonText}</Button>
                </Form.Group>
            </section>
        </Form>
        </Container>
    );
};

export default withTranslation()(UserName);