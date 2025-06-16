import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axios';
import Swal from 'sweetalert2';
import { useConfirmation } from '../../context/ConfirmationContext';

// PERUBAHAN: Komponen FileInput disesuaikan untuk menampilkan nama file asli dan mereset preview
const FileInput = ({ label, currentFile, onFileSelect, onUpload, onDelete }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(file);
      onFileSelect(file);
      // Kosongkan value input agar file yang sama bisa dipilih lagi setelah gagal upload
      e.target.value = null; 
    }
  };

  // Reset preview saat upload/delete berhasil (saat currentFile berubah)
  useEffect(() => {
    setPreview(null);
  }, [currentFile]);


  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-group">
        <div className="custom-file">
          <input type="file" className="custom-file-input" ref={fileInputRef} onChange={handleSelect} accept="image/png, image/jpeg, application/pdf" />
          <label className="custom-file-label" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {/* Tampilkan nama file preview, atau nama file asli jika ada, atau teks default */}
            {preview ? preview.name : (currentFile ? currentFile.original_filename : 'Pilih file')}
          </label>
        </div>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={onUpload} disabled={!preview}>Upload</button>
          {/* Tombol hapus hanya muncul jika ada file */}
          {currentFile && <button className="btn btn-outline-danger" type="button" onClick={onDelete}>Hapus</button>}
        </div>
      </div>
    </div>
  );
};


export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const confirm = useConfirmation();

  // State tidak banyak berubah
  const [authDetails, setAuthDetails] = useState({ username: '', password: '', password_confirmation: '' });
  const [profileDetails, setProfileDetails] = useState({});
  const [filesToUpload, setFilesToUpload] = useState({});

  // PERUBAHAN: Fungsi helper baru untuk mencari file terbaru dari array documents
  const getLatestFile = (type) => {
    if (!currentUser?.documents || currentUser.documents.length === 0) return null;
    
    // Filter dokumen berdasarkan tipe, urutkan dari yang terbaru, ambil yang pertama
    const sortedDocs = [...currentUser.documents]
      .filter(doc => doc.document_type === type)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
    return sortedDocs[0] || null;
  };

  useEffect(() => {
    // Logika ini tetap sama, mengambil data awal dari context
    if (currentUser) {
      setAuthDetails(prev => ({ ...prev, username: currentUser.username }));
      setProfileDetails(currentUser.profile || {});
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };
  
  const handleAuthChange = (e) => {
    setAuthDetails({ ...authDetails, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file, type) => {
    setFilesToUpload(prev => ({ ...prev, [type]: file }));
  };

  // Fungsi upload tidak berubah, karena backend sudah menangani pembuatan nama file dan history
  const handleFileUpload = (type) => {
    const file = filesToUpload[type];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    axiosClient.post('/profile/uploadFile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      setCurrentUser(response.data);
      Swal.fire('Sukses', 'File berhasil diunggah.', 'success');
      setFilesToUpload(prev => ({...prev, [type]: null}));
    }).catch(() => Swal.fire('Error', 'Gagal mengunggah file.', 'error'));
  };

  // PERUBAHAN: Fungsi delete sekarang menerima object file, bukan string 'type'
  const handleFileDelete = (fileObject) => {
    if (!fileObject) return; // Jangan lakukan apa-apa jika tidak ada file untuk dihapus

    confirm({
        title: 'Hapus File?',
        message: `Anda yakin ingin menghapus file "${fileObject.original_filename}"?`,
        confirmColor: 'danger',
        onConfirm: async () => {
            try {
                // Kirim document_id ke backend, bukan 'type'
                const response = await axiosClient.post('/profile/deleteFile', { document_id: fileObject.id });
                setCurrentUser(response.data); // Update context dengan data user terbaru dari backend
                Swal.fire('Sukses', 'File berhasil dihapus.', 'success');
            // eslint-disable-next-line no-unused-vars
            } catch (error) { Swal.fire('Error', 'Gagal menghapus file.', 'error'); }
        }
    });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    confirm({
      title: 'Simpan Perubahan?', message: 'Anda yakin ingin menyimpan data profil?',
      onConfirm: async () => {
        try {
          // Promise.all tetap sama, tetapi kita akan reload data user setelahnya
          await Promise.all([
            axiosClient.post('/profile/updateAuthDetails', authDetails),
            axiosClient.post('/profile/updateProfileDetails', profileDetails)
          ]);

          // PERUBAHAN: Panggil API untuk mendapatkan data user yang paling update
          const { data } = await axiosClient.get('/profile/getProfile');
          setCurrentUser(data); 

          Swal.fire('Sukses', 'Profil berhasil diperbarui.', 'success');
          setAuthDetails(prev => ({ ...prev, password: '', password_confirmation: ''}));
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          Swal.fire('Error', 'Gagal memperbarui profil.', 'error');
        }
      }
    });
  };

  // PERUBAHAN: Variabel-variabel ini sekarang menampung object file terbaru
  const latestFotoProfil = getLatestFile('foto_profil');
  const latestKTP = getLatestFile('scan_ktp');
  const latestIjazah = getLatestFile('scan_ijazah');
  const latestSimC = getLatestFile('scan_sim_c');
  const latestSimA = getLatestFile('scan_sim_a');

  // PERUBAHAN: URL untuk foto profil sekarang dibuat di sini
    // const fotoProfilUrl = latestFotoProfil ? `http://localhost:8000/storage/${latestFotoProfil.file_path}?v=${new Date().getTime()}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.nama_karyawan || 'A')}`;
    const fotoProfilUrl = latestFotoProfil
    ? `http://localhost:8000/storage/${latestFotoProfil.file_path}?v=${new Date().getTime()}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.nama_karyawan || 'A')}`;

  return (
    <>
      <div className="content-header"><div className="container-fluid"><h1 className="m-0">User Profile</h1></div></div>
      <div className="content">
        <div className="container-fluid">
          <form onSubmit={handleDetailsSubmit}>
            <div className="row">
              {/* Kolom Kiri */}
              <div className="col-md-4">
                {/* Card Foto Profil */}
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile text-center">
                    <img className="profile-user-img img-fluid img-circle" src={fotoProfilUrl} alt="Foto Profil" />
                    <h3 className="profile-username text-center">{currentUser?.nama_karyawan}</h3>
                    <p className="text-muted text-center">{currentUser?.level?.user_level}</p>
                    
                    {/* PERUBAHAN: Logika onDelete sekarang mengirim seluruh object file */}
                    <FileInput 
                      label="Foto Profil" 
                      currentFile={latestFotoProfil} 
                      onFileSelect={(file) => handleFileSelect(file, 'foto_profil')} 
                      onUpload={() => handleFileUpload('foto_profil')} 
                      onDelete={() => handleFileDelete(latestFotoProfil)} 
                    />
                  </div>
                </div>
                {/* Card Info Karyawan */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title">Info Karyawan</h3></div>
                    <div className="card-body">
                        <div className="form-group"><label>Nomor Induk Karyawan</label><input type="text" className="form-control" value={currentUser?.nomor_induk_karyawan || ''} disabled /></div>
                        <div className="form-group"><label>Tanggal Bergabung (Joint Date)</label><input type="date" className="form-control" name="joint_date" value={profileDetails.joint_date || ''} disabled /></div>
                    </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="col-md-8">
                {/* Card Detail Login */}
                <div className="card"><div className="card-header"><h3 className="card-title">Detail Login</h3></div>
                  <div className="card-body">
                    <div className="form-group"><label>Username</label><input type="text" name="username" className="form-control" value={authDetails.username || ''} onChange={handleAuthChange} required /></div>
                    <div className="form-group"><label>Password Baru</label><input type="password" name="password" className="form-control" value={authDetails.password} onChange={handleAuthChange} placeholder="Kosongkan jika tidak ingin diubah" /></div>
                    <div className="form-group"><label>Konfirmasi Password Baru</label><input type="password" name="password_confirmation" className="form-control" value={authDetails.password_confirmation} onChange={handleAuthChange} placeholder="Ulangi password baru" /></div>
                  </div>
                </div>
                {/* Card Info Pribadi & Kontak */}
                <div className="card"><div className="card-header"><h3 className="card-title">Info Pribadi & Kontak</h3></div>
                  <div className="card-body">
                    <div className="row">
                        <div className="col-sm-6"><div className="form-group"><label>Tanggal Lahir</label><input type="date" name="tanggal_lahir" className="form-control" value={profileDetails.tanggal_lahir || ''} onChange={handleProfileChange} /></div></div>
                        <div className="col-sm-6"><div className="form-group"><label>Pendidikan Terakhir</label><input type="text" name="pendidikan_terakhir" className="form-control" value={profileDetails.pendidikan_terakhir || ''} onChange={handleProfileChange} /></div></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6"><div className="form-group"><label>Nomor Telepon Utama</label><input type="number" name="nomor_telp_utama" className="form-control" value={profileDetails.nomor_telp_utama || ''} onChange={handleProfileChange} /></div></div>
                        <div className="col-sm-6"><div className="form-group"><label>Nomor Telepon Sekunder</label><input type="number" name="no_telp_sekunder" className="form-control" value={profileDetails.no_telp_sekunder || ''} onChange={handleProfileChange} /></div></div>
                    </div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={profileDetails.email || ''} onChange={handleProfileChange} /></div>
                    <div className="form-group"><label>Alamat Sesuai KTP</label><textarea name="alamat_ktp" className="form-control" rows="3" value={profileDetails.alamat_ktp || ''} onChange={handleProfileChange}></textarea></div>
                    <div className="form-group"><label>Alamat Saat Ini</label><textarea name="alamat_saat_ini" className="form-control" rows="3" value={profileDetails.alamat_saat_ini || ''} onChange={handleProfileChange}></textarea></div>
                  </div>
                </div>
                {/* Card Dokumen */}
                <div className="card"><div className="card-header"><h3 className="card-title">Dokumen</h3></div>
                    <div className="card-body">
                        {/* PERUBAHAN: Setiap FileInput sekarang menggunakan object file terbaru */}
                        <FileInput label="Scan KTP" currentFile={latestKTP} onFileSelect={(file) => handleFileSelect(file, 'scan_ktp')} onUpload={() => handleFileUpload('scan_ktp')} onDelete={() => handleFileDelete(latestKTP)} />
                        <FileInput label="Scan Ijazah" currentFile={latestIjazah} onFileSelect={(file) => handleFileSelect(file, 'scan_ijazah')} onUpload={() => handleFileUpload('scan_ijazah')} onDelete={() => handleFileDelete(latestIjazah)} />
                        <FileInput label="Scan SIM C" currentFile={latestSimC} onFileSelect={(file) => handleFileSelect(file, 'scan_sim_c')} onUpload={() => handleFileUpload('scan_sim_c')} onDelete={() => handleFileDelete(latestSimC)} />
                        <FileInput label="Scan SIM A" currentFile={latestSimA} onFileSelect={(file) => handleFileSelect(file, 'scan_sim_a')} onUpload={() => handleFileUpload('scan_sim_a')} onDelete={() => handleFileDelete(latestSimA)} />
                    </div>
                </div>
                {/* Tombol Simpan Global */}
                <div className="mb-3">
                    <button type="submit" className="btn btn-lg btn-success float-right">Simpan Semua Perubahan</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
