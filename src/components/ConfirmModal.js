import React from 'react';
import Modal from 'react-bootstrap4-modal';

export const ConfirmModal = ({ visible, title, confirmText, cancelText, confirmClassName, cancelClassName, onConfirm, onCancel, children }) => (
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
      <button type="button" className={confirmClassName || "btn btn-primary"} onClick={onConfirm}>
        {confirmText}
      </button>
    </div>
  </Modal>
);