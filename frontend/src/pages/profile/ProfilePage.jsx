import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axios';
import Swal from 'sweetalert2';
import { useConfirmation } from '../../context/ConfirmationContext';

const FileInput = ({ label, onFileSelect, fileName, onPreview, currentFile }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <div className="input-group">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" onChange={e => onFileSelect(e.target.files[0])} accept="image/png, image/jpeg, application/pdf" />
                    <label className="custom-file-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

export default function ProfilePage() {
    const { currentUser, setCurrentUser } = useAuth();
    const confirm = useConfirmation();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password_confirmation: '',
        tanggal_lahir: '',
        joint_date: '',
        nomor_telp_utama: '',
        no_telp_sekunder: '',
        email: '',
        alamat_ktp: '',
        alamat_saat_ini: '',
        pendidikan_terakhir: '',
    });

    const [photo, setPhoto] = useState(null);
    const [scanKtp, setScanKtp] = useState(null);
    const [scanIjazah, setScanIjazah] = useState(null);
    const [scanSimA, setScanSimA] = useState(null);
    const [scanSimC, setScanSimC] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    const getLatestFile = (type) => {
        if (!currentUser?.documents || currentUser.documents.length === 0) return null;
        const sortedDocs = [...currentUser.documents]
            .filter(doc => doc.document_type === type)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return sortedDocs[0] || null;
    };

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || '',
                password: '',
                password_confirmation: '',
                tanggal_lahir: currentUser.profile?.tanggal_lahir?.substring(0, 10) || '',
                joint_date: currentUser.profile?.joint_date?.substring(0, 10) || '',
                nomor_telp_utama: currentUser.profile?.nomor_telp_utama || '',
                no_telp_sekunder: currentUser.profile?.no_telp_sekunder || '',
                email: currentUser.profile?.email || '',
                alamat_ktp: currentUser.profile?.alamat_ktp || '',
                alamat_saat_ini: currentUser.profile?.alamat_saat_ini || '',
                pendidikan_terakhir: currentUser.profile?.pendidikan_terakhir || '',
            });
            setPhotoPreview(currentUser.profile_photo_url || null);
        }
    }, [currentUser]);

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePhotoSelect = (file) => {
        setPhoto(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveAll = (e) => {
        e.preventDefault();
        confirm({
            title: 'Simpan Semua Perubahan?',
            message: 'Data profil dan semua file yang Anda pilih akan diunggah dan disimpan.',
            onConfirm: async () => {
                const payload = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key]) {
                        payload.append(key, formData[key]);
                    }
                });
                if (photo) payload.append('photo', photo);
                if (scanKtp) payload.append('scan_ktp', scanKtp);
                if (scanIjazah) payload.append('scan_ijazah', scanIjazah);
                if (scanSimA) payload.append('scan_sim_a', scanSimA);
                if (scanSimC) payload.append('scan_sim_c', scanSimC);

                try {
                    const response = await axiosClient.post('/profile/details', payload, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setCurrentUser(response.data);
                    Swal.fire('Sukses', 'Profil berhasil diperbarui.', 'success');
                    setPhoto(null);
                    setScanKtp(null);
                    setScanIjazah(null);
                    setScanSimA(null);
                    setScanSimC(null);
                } catch (error) {
                    const message = error.response?.data?.message || 'Gagal memperbarui profil.';
                    Swal.fire('Error', message, 'error');
                }
            }
        });
    };

    // --- FUNGSI PREVIEW YANG DIPERBAIKI ---
    const handlePreview = (fileObject) => {
        if (fileObject && fileObject.file_path) {
            // Gunakan variabel dari .env untuk membuat URL yang benar
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const fileUrl = `${backendUrl}/storage/${fileObject.file_path}`;
            window.open(fileUrl, '_blank');
        } else {
            Swal.fire({ icon: 'info', title: 'Informasi', text: 'Dokumen tidak tersedia atau belum diunggah.' });
        }
    };
    
    const latestKTP = getLatestFile('scan_ktp');
    const latestIjazah = getLatestFile('scan_ijazah');
    const latestSimC = getLatestFile('scan_sim_c');
    const latestSimA = getLatestFile('scan_sim_a');

    return (
        <>
            <div className="content-header"><div className="container-fluid"><h1 className="m-0">User Profile</h1></div></div>
            <div className="content">
                <div className="container-fluid">
                    <form onSubmit={handleSaveAll}>
                        <div className="row">
                            {/* Kolom Kiri */}
                            <div className="col-md-4">
                                <div className="card card-primary card-outline">
                                    <div className="card-body box-profile text-center">
                                        <img className="profile-user-img img-fluid img-circle" src={photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.nama_karyawan || 'A')}`} alt="Foto Profil" />
                                        <h3 className="profile-username text-center">{currentUser?.nama_karyawan}</h3>
                                        <p className="text-muted text-center">{currentUser?.level?.user_level}</p>
                                        <FileInput label="Ganti Foto Profil" onFileSelect={handlePhotoSelect} fileName={photo?.name} currentFile={{file_path: currentUser?.profile_photo_path}} onPreview={() => handlePreview({file_path: currentUser?.profile_photo_path})}/>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header"><h3 className="card-title">Info Karyawan</h3></div>
                                    <div className="card-body">
                                        <div className="form-group"><label>Nomor Induk Karyawan</label><input type="text" className="form-control" value={currentUser?.nomor_induk_karyawan || ''} disabled /></div>
                                        <div className="form-group"><label>Tanggal Bergabung</label><input type="date" className="form-control" name="joint_date" value={formData.joint_date} onChange={handleFormChange} disabled/></div>
                                    </div>
                                </div>
                            </div>
                            {/* Kolom Kanan */}
                            <div className="col-md-8">
                                {/* ... Card Detail Login ... */}
                                <div className="card"><div className="card-header"><h3 className="card-title">Detail Login</h3></div>
                                    <div className="card-body">
                                        <div className="form-group"><label>Username</label><input type="text" name="username" className="form-control" value={formData.username} onChange={handleFormChange} required /></div>
                                        <div className="form-group"><label>Password Baru</label><input type="password" name="password" className="form-control" value={formData.password} onChange={handleFormChange} placeholder="Kosongkan jika tidak ingin diubah" /></div>
                                        <div className="form-group"><label>Konfirmasi Password Baru</label><input type="password" name="password_confirmation" className="form-control" value={formData.password_confirmation} onChange={handleFormChange} placeholder="Ulangi password baru" /></div>
                                    </div>
                                </div>
                                {/* ... Card Info Pribadi & Kontak ... */}
                                <div className="card"><div className="card-header"><h3 className="card-title">Info Pribadi & Kontak</h3></div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6"><div className="form-group"><label>Tanggal Lahir</label><input type="date" name="tanggal_lahir" className="form-control" value={formData.tanggal_lahir} onChange={handleFormChange} /></div></div>
                                            <div className="col-sm-6"><div className="form-group"><label>Pendidikan Terakhir</label><input type="text" name="pendidikan_terakhir" className="form-control" value={formData.pendidikan_terakhir} onChange={handleFormChange} /></div></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6"><div className="form-group"><label>Nomor Telepon Utama</label><input type="text" name="nomor_telp_utama" className="form-control" value={formData.nomor_telp_utama} onChange={handleFormChange} /></div></div>
                                            <div className="col-sm-6"><div className="form-group"><label>Nomor Telepon Sekunder</label><input type="text" name="no_telp_sekunder" className="form-control" value={formData.no_telp_sekunder} onChange={handleFormChange} /></div></div>
                                        </div>
                                        <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleFormChange} /></div>
                                        <div className="form-group"><label>Alamat Sesuai KTP</label><textarea name="alamat_ktp" className="form-control" rows="3" value={formData.alamat_ktp} onChange={handleFormChange}></textarea></div>
                                        <div className="form-group"><label>Alamat Saat Ini</label><textarea name="alamat_saat_ini" className="form-control" rows="3" value={formData.alamat_saat_ini} onChange={handleFormChange}></textarea></div>
                                    </div>
                                </div>
                                {/* ... Card Dokumen ... */}
                                <div className="card"><div className="card-header"><h3 className="card-title">Dokumen</h3></div>
                                    <div className="card-body">
                                        <FileInput label="Scan KTP" onFileSelect={setScanKtp} fileName={scanKtp?.name} currentFile={latestKTP} onPreview={() => handlePreview(latestKTP)} />
                                        <FileInput label="Scan Ijazah" onFileSelect={setScanIjazah} fileName={scanIjazah?.name} currentFile={latestIjazah} onPreview={() => handlePreview(latestIjazah)} />
                                        <FileInput label="Scan SIM C" onFileSelect={setScanSimC} fileName={scanSimC?.name} currentFile={latestSimC} onPreview={() => handlePreview(latestSimC)} />
                                        <FileInput label="Scan SIM A" onFileSelect={setScanSimA} fileName={scanSimA?.name} currentFile={latestSimA} onPreview={() => handlePreview(latestSimA)} />
                                    </div>
                                </div>
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