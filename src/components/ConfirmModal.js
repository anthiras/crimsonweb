import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ConfirmModal = ({ visible, title, confirmText, cancelText, confirmVariant, cancelVariant, onConfirm, onCancel, confirmDisabled, children }) => (
  <Modal show={visible} onHide={onCancel}>
    <Modal.Header>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Button variant={cancelVariant || "secondary"} onClick={onCancel}>
        {cancelText}
      </Button>
      <Button variant={confirmVariant || "danger"} onClick={onConfirm} disabled={confirmDisabled}>
        {confirmText}
      </Button>
    </Modal.Footer>
  </Modal>
);

class NumberBoxModal extends Component 
{
  constructor(props) {
    super(props)
    this.state = { value: props.value };
    this.onConfirm = this.onConfirm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onConfirm() {
    this.props.onConfirm(this.state.value);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onConfirm(this.state.value);
  }

  render() {
    const { visible, title, confirmText, cancelText, confirmVariant, cancelVariant, onCancel } = this.props;
    return (
      <Modal show={visible} onHide={onCancel}>
        <Form onSubmit={this.onSubmit}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type={this.props.type} step={this.props.step} className="form-control" value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant={cancelVariant || "secondary"} onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type="submit" variant={confirmVariant || "danger"}>
            {confirmText}
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

class TextAreaModal extends Component
{
  constructor(props) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onConfirm() {
    this.props.onConfirm(this.props.value);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (<ConfirmModal {...this.props} onConfirm={this.onConfirm}>
      <textarea className="form-control" rows={this.props.rows} onChange={this.onChange} value={this.props.value} />
      {this.props.children}
    </ConfirmModal>);
  }
}

export { ConfirmModal, NumberBoxModal, TextAreaModal };