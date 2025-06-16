import { useState, useEffect, useRef } from 'react';

export default function UserModal({ user, userLevels, onClose, onSave }) {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    nama_karyawan: '',
    nomor_induk_karyawan: '',
    username: '',
    password: '',
    password_confirmation: '', // <-- TAMBAHAN: Untuk konfirmasi password
    level_id: '',
    status_karyawan: 'aktif',
    joint_date: '', // <-- TAMBAHAN: Untuk tanggal bergabung
    delete_photo: false, // <-- TAMBAHAN: Untuk opsi hapus foto
  });
  
  // State baru untuk menangani file foto
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  // --- EFEK & LOGIKA ---

  // Mengisi form dengan data user saat komponen dimuat atau prop berubah
  useEffect(() => {
    // Mode EDIT: jika ada prop 'user'
    if (user) {
      setFormData({
        nama_karyawan: user.nama_karyawan || '',
        nomor_induk_karyawan: user.nomor_induk_karyawan || '',
        username: user.username || '',
        password: '',
        password_confirmation: '',
        level_id: user.level_id || '',
        status_karyawan: user.status_karyawan || 'aktif',
        joint_date: user.joint_date || '', // <-- TAMBAHAN: Isi joint_date
        delete_photo: false,
      });
      // Atur pratinjau foto profil
      setPhotoPreview(user.profile_photo_url || '');
    } 
    // Mode ADD: jika tidak ada prop 'user'
    else {
      setFormData({
        nama_karyawan: '',
        nomor_induk_karyawan: '',
        username: '',
        password: '',
        password_confirmation: '',
        level_id: userLevels.length > 0 ? userLevels[0].id : '',
        status_karyawan: 'aktif',
        joint_date: '', // <-- TAMBAHAN: Reset joint_date
        delete_photo: false,
      });
      setPhotoPreview(''); // Tidak ada foto saat menambah user baru
      setPhoto(null);
    }
  }, [user, userLevels]);

  // Handler untuk input teks, select, dan checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handler khusus untuk input file foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Untuk mode EDIT, kita harus mengirim FormData karena ada file
    if (user) {
      const payload = new FormData();
      
      // Tambahkan semua data dari state ke payload
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });

      // Tambahkan file foto jika dipilih oleh user
      if (photo) {
        payload.append('photo', photo);
      }
      
      // Kirim payload FormData dan ID user ke parent component
      onSave(payload, user.id);
    } 
    // Untuk mode ADD, kita cukup kirim objek JSON biasa
    else {
      // Pastikan konfirmasi password sama
      if (formData.password !== formData.password_confirmation) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }
      onSave(formData, null);
    }
  };

  // --- RENDER JSX ---
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
              <div className="modal-body">
                
                {/* BAGIAN FOTO PROFIL (Hanya muncul saat mode edit) */}
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

                {/* BAGIAN DATA DIRI */}
                <div className="form-group">
                  <label>Nama Karyawan</label>
                  <input type="text" name="nama_karyawan" value={formData.nama_karyawan} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Nomor Induk Karyawan (NIK)</label>
                  <input type="text" name="nomor_induk_karyawan" value={formData.nomor_induk_karyawan} onChange={handleChange} className="form-control" required />
                </div>
                {/* <-- INPUT BARU UNTUK JOINT DATE --> */}
                <div className="form-group">
                    <label>Tanggal Bergabung (Joint Date)</label>
                    <input type="date" name="joint_date" value={formData.joint_date} onChange={handleChange} className="form-control" required />
                </div>

                <hr />

                {/* BAGIAN AKUN */}
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder={user ? 'Kosongkan jika tidak ingin diubah' : 'Wajib diisi'} required={!user} />
                </div>
                {/* <-- INPUT BARU UNTUK KONFIRMASI PASSWORD --> */}
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