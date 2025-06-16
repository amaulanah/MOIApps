import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axios';
import Swal from 'sweetalert2';
import { useConfirmation } from '../context/ConfirmationContext';
import UserModal from './UserModal'; 

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [userLevels, setUserLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const confirm = useConfirmation();

  // State untuk Fitur Search, Sort, dan Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'nama_karyawan', direction: 'ascending' });

  // Efek untuk mengatasi masalah scroll pada modal
  useEffect(() => {
    if (isModalOpen) { document.body.classList.add('modal-open'); }
    else { document.body.classList.remove('modal-open'); }
    return () => { document.body.classList.remove('modal-open'); };
  }, [isModalOpen]);

  // Fungsi untuk mengambil data dari API (dengan perbaikan)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, levelsResponse] = await Promise.all([
        axiosClient.get('/users'),
        axiosClient.get('/user-levels'),
      ]);
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setUserLevels(Array.isArray(levelsResponse.data) ? levelsResponse.data : []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Swal.fire('Error', 'Gagal memuat data dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  
  // Logika untuk memproses data (di-skip untuk keringkasan, Anda bisa gunakan versi sebelumnya)
  const processedUsers = useMemo(() => {
    let processed = [...users];
    // ... (Logika search, filter, sort dari jawaban sebelumnya ada di sini) ...
     if (statusFilter !== 'all') {
      processed = processed.filter(user => user.status_karyawan === statusFilter);
    }
    if (searchTerm) {
      processed = processed.filter(user =>
        user.nama_karyawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nomor_induk_karyawan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key !== null) {
      processed.sort((a, b) => {
        const getNestedValue = (obj, path) => path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
        const valA = getNestedValue(a, sortConfig.key);
        const valB = getNestedValue(b, sortConfig.key);
        if (valA < valB) { return sortConfig.direction === 'ascending' ? -1 : 1; }
        if (valA > valB) { return sortConfig.direction === 'ascending' ? 1 : -1; }
        return 0;
      });
    }
    return processed;
  }, [users, searchTerm, statusFilter, sortConfig]);

  // Handler untuk sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') return ' ▲';
    return ' ▼';
  };
  
  const handleSave = async (data, userId) => {
  confirm({
    title: 'Konfirmasi Penyimpanan',
    message: `Anda yakin ingin menyimpan data user ini?`,
    onConfirm: async () => {
      const isEditing = !!userId;
      const url = isEditing ? `/users/${userId}` : '/users';
      const method = 'post'; // <-- Metode SELALU 'post'

      try {
        await axiosClient[method](url, data, {
          headers: isEditing ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        
        Swal.fire('Sukses', `User berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`, 'success');
        handleCloseModal();
        fetchData();
      } catch (error) {
        // ... (logika error handling) ...
        const message = error.response?.data?.message || 'Terjadi kesalahan.';
        const errors = error.response?.data?.errors;
        let htmlMessage = message;
        if (errors) {
          htmlMessage += '<ul class="text-left mt-2">';
          for (const key in errors) {
            htmlMessage += `<li>${errors[key][0]}</li>`;
          }
          htmlMessage += '</ul>';
        }
        Swal.fire({ icon: 'error', title: 'Error', html: htmlMessage });
      }
    }
  });
};

  const handleOpenModal = (user = null) => { setEditingUser(user); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingUser(null); };
  const handleDelete = (user) => { confirm({ title: 'Konfirmasi Hapus', message: `Anda yakin ingin menghapus user "${user.nama_karyawan}"?`, confirmText: 'Ya, Hapus', confirmColor: 'danger', onConfirm: async () => { try { await axiosClient.delete(`/users/${user.id}`); Swal.fire('Dihapus!', 'User telah berhasil dihapus.', 'success'); fetchData(); } catch (error) { const message = error.response?.data?.message || 'Gagal menghapus user.'; Swal.fire('Error', message, 'error'); } } }); };


  return (
    <div>
       {/* ... JSX untuk filter, search, dan tombol tambah ... */}
       <div className="row mb-3 align-items-center">
          <div className="col-md-4">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Cari berdasarkan Nama, Username, NIK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="col-md-3">
              <select 
                  className="form-control" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
              >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
              </select>
          </div>
          <div className="col-md-5 text-right">
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                  <i className="fas fa-plus mr-2"></i> Tambah User
              </button>
          </div>
      </div>

      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                 <th style={{width: '60px'}}>Foto</th>
                 <th onClick={() => requestSort('nama_karyawan')} style={{cursor: 'pointer'}}> Nama Karyawan {getSortIcon('nama_karyawan')} </th>
                 <th onClick={() => requestSort('username')} style={{cursor: 'pointer'}}> Username {getSortIcon('username')} </th>
                 <th onClick={() => requestSort('nomor_induk_karyawan')} style={{cursor: 'pointer'}}> NIK {getSortIcon('nomor_induk_karyawan')} </th>
                 <th onClick={() => requestSort('level.user_level')} style={{cursor: 'pointer'}}> Level {getSortIcon('level.user_level')} </th>
                 <th onClick={() => requestSort('status_karyawan')} style={{cursor: 'pointer'}}> Status {getSortIcon('status_karyawan')} </th>
                 <th style={{ width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {processedUsers.length > 0 ? (
                processedUsers.map(user => (
                  <tr key={user.id}>
                    <td><img src={user.profile_photo_url} alt={user.nama_karyawan} className="img-circle" width="40" height="40" style={{objectFit: 'cover'}}/></td>
                    <td>{user.nama_karyawan}</td>
                    <td>{user.username}</td>
                    <td>{user.nomor_induk_karyawan}</td>
                    <td>{user.level?.user_level || 'N/A'}</td>
                    <td> <span className={`badge ${user.status_karyawan === 'aktif' ? 'badge-success' : 'badge-danger'}`}> {user.status_karyawan} </span> </td>
                    <td>
                      <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(user)}> <i className="fas fa-edit"></i> </button>
                      {user.level?.user_level !== 'admin' && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user)}> <i className="fas fa-trash"></i> </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <UserModal
          user={editingUser}
          userLevels={userLevels}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}