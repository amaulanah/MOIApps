import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Komponen FileInput tidak perlu diubah, kita letakkan di sini agar lengkap
const FileInput = ({ label, onFileSelect, fileName, onPreview, currentFile }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <div className="input-group">
                <div className="custom-file">
                    <input
                        type="file"
                        className="custom-file-input"
                        id={label} // Tambahkan id unik untuk label
                        onChange={e => onFileSelect(e.target.files[0])}
                        accept="image/png, image/jpeg, application/pdf"
                    />
                    <label className="custom-file-label" htmlFor={label} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fileName || (currentFile ? currentFile.original_filename : 'Pilih file')}
                    </label>
                </div>
                {currentFile && 
                    <div className="input-group-append">
                        <button className="btn btn-outline-info" type="button" onClick={onPreview}>Preview</button>
                    </div>
                }
            </div>
        </div>
    );
};


export default function UserModal({ user, userLevels, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama_karyawan: '',
    nomor_induk_karyawan: '',
    username: '',
    password: '',
    password_confirmation: '',
    level_id: '',
    status_karyawan: 'aktif',
    joint_date: '',
    delete_photo: false,
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [scanKtp, setScanKtp] = useState(null);
  const [scanIjazah, setScanIjazah] = useState(null);
  const [scanSimA, setScanSimA] = useState(null);
  const [scanSimC, setScanSimC] = useState(null);

  // --- TAMBAHKAN FUNGSI HELPER INI ---
  const getLatestFile = (type) => {
    // Prop 'user' yang diterima modal sudah berisi relasi 'documents'
    if (!user?.documents || user.documents.length === 0) return null;
    const sortedDocs = [...user.documents]
        .filter(doc => doc.document_type === type)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sortedDocs[0] || null;
  };
  // ------------------------------------

  useEffect(() => {
    if (user) {
      setFormData({
        nama_karyawan: user.nama_karyawan || '',
        nomor_induk_karyawan: user.nomor_induk_karyawan || '',
        username: user.username || '',
        password: '',
        password_confirmation: '',
        level_id: user.level_id || '',
        status_karyawan: user.status_karyawan || 'aktif',
        joint_date: user.profile?.joint_date ? user.profile.joint_date.substring(0, 10) : '',
        delete_photo: false,
      });
      setPhotoPreview(user.profile_photo_url || '');
    } else {
      setFormData({
        nama_karyawan: '', nomor_induk_karyawan: '', username: '',
        password: '', password_confirmation: '', level_id: userLevels.length > 0 ? userLevels[0].id : '',
        status_karyawan: 'aktif', joint_date: '', delete_photo: false,
      });
    }
  }, [user, userLevels]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
        setPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const handlePreview = (fileObject) => {
    if (fileObject && fileObject.file_path) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const fileUrl = `${backendUrl}/storage/${fileObject.file_path}`;
        window.open(fileUrl, '_blank');
    } else {
        Swal.fire('Info', 'Dokumen tidak tersedia.', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach(key => { payload.append(key, formData[key]); });
    if (photo) payload.append('photo', photo);
    if (scanKtp) payload.append('scan_ktp', scanKtp);
    if (scanIjazah) payload.append('scan_ijazah', scanIjazah);
    if (scanSimA) payload.append('scan_sim_a', scanSimA);
    if (scanSimC) payload.append('scan_sim_c', scanSimC);
    if (user) {
      payload.append('_method', 'PUT');
    }
    onSave(payload, user ? user.id : null);
  };
  
  // --- PANGGIL FUNGSI HELPER DI SINI ---
  const latestKTP = getLatestFile('scan_ktp');
  const latestIjazah = getLatestFile('scan_ijazah');
  const latestSimC = getLatestFile('scan_sim_c');
  const latestSimA = getLatestFile('scan_sim_a');
  // --------------------------------------

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{user ? 'Edit User' : 'Tambah User Baru'}</h5>
                <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                
                {/* ... Bagian Foto Profil dan form lainnya ... */}
                {user && (
                    <div className="form-group text-center border-bottom pb-3 mb-3">
                        <img src={photoPreview} alt="Profile" className="profile-user-img img-fluid img-circle mb-2" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                        <br/>
                        <input type="file" style={{display: 'none'}} id="photoInputModal" onChange={handlePhotoChange} accept="image/*" />
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => document.getElementById('photoInputModal').click()}>Pilih Foto</button>
                        {user.profile_photo_path && (
                            <div className="form-check mt-2 d-inline-block ml-2">
                                <input type="checkbox" name="delete_photo" checked={formData.delete_photo} onChange={handleInputChange} className="form-check-input" id="deletePhotoCheckModal" />
                                <label className="form-check-label" htmlFor="deletePhotoCheckModal">Hapus Foto</label>
                            </div>
                        )}
                    </div>
                )}
                
                {/* ... Form Data Diri dan Akun ... */}
                <div className="form-group"><label>Nama Karyawan</label><input type="text" name="nama_karyawan" value={formData.nama_karyawan} onChange={handleInputChange} className="form-control" required /></div>
                <div className="form-group"><label>Nomor Induk Karyawan</label><input type="text" name="nomor_induk_karyawan" value={formData.nomor_induk_karyawan} onChange={handleInputChange} className="form-control" required /></div>
                <div className="form-group"><label>Joint Date</label><input type="date" name="joint_date" value={formData.joint_date} onChange={handleInputChange} className="form-control" required /></div>
                <hr/>
                <div className="form-group"><label>Username</label><input type="text" name="username" value={formData.username} onChange={handleInputChange} className="form-control" required /></div>
                <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control" placeholder={user ? 'Kosongkan jika tidak diubah' : ''} required={!user} /></div>
                <div className="form-group"><label>Konfirmasi Password</label><input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleInputChange} className="form-control" /></div>
                <div className="form-group"><label>Level</label><select name="level_id" value={formData.level_id} onChange={handleInputChange} className="form-control" required><option value="">-- Pilih Level --</option>{userLevels.map(level => <option key={level.id} value={level.id}>{level.user_level}</option>)}</select></div>
                <div className="form-group"><label>Status</label><select name="status_karyawan" value={formData.status_karyawan} onChange={handleInputChange} className="form-control" required><option value="aktif">Aktif</option><option value="tidak aktif">Tidak Aktif</option></select></div>

                {user && (
                    <>
                        <hr />
                        <h5>Dokumen</h5>
                        {/* --- PERBAIKAN PADA BAGAIMANA PROPS DIKIRIM --- */}
                        <FileInput label="Scan KTP" onFileSelect={setScanKtp} fileName={scanKtp?.name} currentFile={latestKTP} onPreview={() => handlePreview(latestKTP)} />
                        <FileInput label="Scan Ijazah" onFileSelect={setScanIjazah} fileName={scanIjazah?.name} currentFile={latestIjazah} onPreview={() => handlePreview(latestIjazah)} />
                        <FileInput label="Scan SIM A" onFileSelect={setScanSimA} fileName={scanSimA?.name} currentFile={latestSimA} onPreview={() => handlePreview(latestSimA)} />
                        <FileInput label="Scan SIM C" onFileSelect={setScanSimC} fileName={scanSimC?.name} currentFile={latestSimC} onPreview={() => handlePreview(latestSimC)} />
                        {/* ------------------------------------------- */}
                    </>
                )}

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
    </>
  );
}