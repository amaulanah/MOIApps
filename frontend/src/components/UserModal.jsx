import { useState, useEffect, useRef } from 'react';

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
  const fileInputRef = useRef(null);

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
        joint_date: user.joint_date ? user.joint_date.substring(0, 10) : '',
        delete_photo: false,
      });
      setPhotoPreview(user.profile_photo_url || null); // Gunakan null jika kosong
    } else {
      setFormData({
        nama_karyawan: '',
        nomor_induk_karyawan: '',
        username: '',
        password: '',
        password_confirmation: '',
        level_id: userLevels.length > 0 ? userLevels[0].id : '',
        status_karyawan: 'aktif',
        joint_date: '',
        delete_photo: false,
      });
      setPhotoPreview(null);
      setPhoto(null);
    }
  }, [user, userLevels]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (user) {
      const payload = new FormData();
      
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });

      if (photo) {
        payload.append('photo', photo);
      }
      
      // --- TAMBAHKAN BARIS KRUSIAL INI ---
      payload.append('_method', 'PUT');
      // ------------------------------------
      
      // Untuk Debugging (opsional): Cek isi payload sebelum dikirim
      // for (let pair of payload.entries()) {
      //    console.log(pair[0]+ ', ' + pair[1]); 
      // }

      onSave(payload, user.id);
    } 
    else {
      if (formData.password !== formData.password_confirmation) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }
      onSave(formData, null);
    }
  };

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{user ? 'Edit User' : 'Tambah User Baru'}</h5>
                <button type="button" className="close" onClick={onClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                
                {user && (
                  <div className="form-group text-center border-bottom pb-3 mb-3">
                    <img src={photoPreview} alt="Profile" className="profile-user-img img-fluid img-circle mb-2" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                    <input type="file" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
                    <br/>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => fileInputRef.current.click()}>Pilih Foto</button>
                    {user.profile_photo_path && (
                      <div className="form-check mt-2 d-inline-block ml-2">
                        <input type="checkbox" name="delete_photo" checked={formData.delete_photo} onChange={handleChange} className="form-check-input" id="deletePhotoCheck" />
                        <label className="form-check-label" htmlFor="deletePhotoCheck">Hapus Foto</label>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Nama Karyawan</label>
                  <input type="text" name="nama_karyawan" value={formData.nama_karyawan} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Nomor Induk Karyawan (NIK)</label>
                  <input type="text" name="nomor_induk_karyawan" value={formData.nomor_induk_karyawan} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Tanggal Bergabung (Joint Date)</label>
                    <input type="date" name="joint_date" value={formData.joint_date} onChange={handleChange} className="form-control" required />
                </div>
                <hr />
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder={user ? 'Kosongkan jika tidak ingin diubah' : 'Wajib diisi'} required={!user} />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password</label>
                  <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className="form-control" placeholder={user ? 'Kosongkan jika tidak ingin diubah' : 'Ulangi password'} required={!user} />
                </div>
                <div className="form-group">
                  <label>Level User</label>
                  <select name="level_id" value={formData.level_id} onChange={handleChange} className="form-control" required>
                    <option value="" disabled>Pilih Level</option>
                    {userLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.user_level}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status Karyawan</label>
                  <select name="status_karyawan" value={formData.status_karyawan} onChange={handleChange} className="form-control" required>
                    <option value="aktif">Aktif</option>
                    <option value="tidak aktif">Tidak Aktif</option>
                  </select>
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
    </>
  );
}