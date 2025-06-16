import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // 1. IMPORT REACTDOM

export default function UserLevelModal({ level, onClose, onSave }) {
  const [levelName, setLevelName] = useState('');

  useEffect(() => {
    if (level) {
      setLevelName(level.user_level);
    } else {
      setLevelName('');
    }
  }, [level]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ user_level: levelName });
  };

  // 2. BUNGKUS SELURUH RETURN DENGAN ReactDOM.createPortal()
  return ReactDOM.createPortal(
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{level ? 'Edit Level User' : 'Tambah Level User Baru'}</h5>
                <button type="button" className="close" onClick={onClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="user_level">Nama Level</label>
                  <input
                    id="user_level"
                    type="text"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    className="form-control"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>,
    document.getElementById('modal-portal') // 3. TENTUKAN TUJUAN PORTAL
  );
}