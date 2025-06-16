import React from 'react';

// Ini adalah komponen "dumb" yang hanya menampilkan UI
export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Ya', cancelText = 'Batal', confirmColor = 'primary' }) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onCancel} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* Pesan bisa berupa string atau elemen JSX */}
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button type="button" className={`btn btn-${confirmColor}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}