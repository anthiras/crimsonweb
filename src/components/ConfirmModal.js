import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';

const ConfirmModal = ({ visible, title, confirmText, cancelText, confirmClassName, cancelClassName, onConfirm, onCancel, children }) => (
  <Modal visible={visible}>
    <div className="modal-header">
      <h5 className="modal-title">{title}</h5>
    </div>
    <div className="modal-body">
      {children}
    </div>
    <div className="modal-footer">
      <button type="button" className={cancelClassName || "btn btn-secondary"} onClick={onCancel}>
        {cancelText}
      </button>
      <button type="button" className={confirmClassName || "btn btn-danger"} onClick={onConfirm}>
        {confirmText}
      </button>
    </div>
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
    const { visible, title, confirmText, cancelText, confirmClassName, cancelClassName, onCancel } = this.props;
    return (
      <Modal visible={visible}>
        <form onSubmit={this.onSubmit}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
        </div>
        <div className="modal-body">
          <input type={this.props.type} step={this.props.step} className="form-control" value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
        </div>
        <div className="modal-footer">
          <button type="button" className={cancelClassName || "btn btn-secondary"} onClick={onCancel}>
            {cancelText}
          </button>
          <button type="submit" className={confirmClassName || "btn btn-danger"}>
            {confirmText}
          </button>
        </div>
        </form>
      </Modal>
    );
  }
}

class TextAreaModal extends Component
{
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.onConfirm = this.onConfirm.bind(this);
  }

  onConfirm() {
    this.props.onConfirm(this.state.value);
  }

  render() {
    return (<ConfirmModal {...this.props} onConfirm={this.onConfirm}>
      <textarea className="form-control" rows={this.props.rows} onChange={(e) => this.setState({value: e.target.value})}></textarea>
    </ConfirmModal>);
  }
}

export { ConfirmModal, NumberBoxModal, TextAreaModal };