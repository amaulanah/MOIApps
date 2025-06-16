import { useState, useEffect } from 'react';
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

  // --- 1. TAMBAHKAN useEffect INI UNTUK MENGATASI MASALAH SCROLL ---
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);
  // --------------------------------------------------------------

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, levelsResponse] = await Promise.all([
        axiosClient.get('/users'),
        axiosClient.get('/user-levels'),
      ]);
      // Pastikan data yang di-set adalah array
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setUserLevels(Array.isArray(levelsResponse.data) ? levelsResponse.data : []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Swal.fire('Error', 'Gagal memuat data dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // --- 2. UBAH FUNGSI handleSave AGAR SESUAI DENGAN UserModal BARU ---
  const handleSave = async (data, userId) => {
    // 'data' bisa berupa Objek (untuk tambah) atau FormData (untuk edit)
    // 'userId' akan berisi ID saat edit, dan null saat tambah
    
    confirm({
      title: 'Konfirmasi Penyimpanan',
      message: `Anda yakin ingin menyimpan data user ini?`,
      onConfirm: async () => {
        const isEditing = !!userId;
        // URL ditentukan oleh adanya userId
        const url = isEditing ? `/users/${userId}` : '/users';
        // Metode untuk edit HARUS 'post' karena kita mengirim FormData
        // UserModal sudah menambahkan _method: 'PUT' di dalamnya.
        const method = 'post'; 

        try {
          await axiosClient[method](url, data, {
            // Tambahkan header khusus jika data adalah FormData
            headers: isEditing ? { 'Content-Type': 'multipart/form-data' } : {}
          });
          
          Swal.fire('Sukses', `User berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`, 'success');
          handleCloseModal();
          fetchData(); // Muat ulang data setelah sukses
        } catch (error) {
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
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: htmlMessage,
          });
        }
      }
    });
  };
  // -----------------------------------------------------------------

  const handleDelete = (user) => {
    confirm({
      title: 'Konfirmasi Hapus',
      message: `Anda yakin ingin menghapus user "${user.nama_karyawan}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      confirmColor: 'danger',
      onConfirm: async () => {
        try {
          await axiosClient.delete(`/users/${user.id}`);
          Swal.fire('Dihapus!', 'User telah berhasil dihapus.', 'success');
          fetchData();
        } catch (error) {
          const message = error.response?.data?.message || 'Gagal menghapus user.';
          Swal.fire('Error', message, 'error');
        }
      }
    });
  };

  return (
    <div>
      <button className="btn btn-primary mb-3" onClick={() => handleOpenModal()}>
        <i className="fas fa-plus mr-2"></i> Tambah User
      </button>

      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {/* <th>Foto</th> */}
                <th>Nama Karyawan</th>
                <th>Username</th>
                <th>NIK</th>
                <th>Level</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  {/* <td><img src={user.profile_photo_url} alt={user.nama_karyawan} className="img-circle" width="40" height="40" style={{objectFit: 'cover'}}/></td> */}
                  <td>{user.nama_karyawan}</td>
                  <td>{user.username}</td>
                  <td>{user.nomor_induk_karyawan}</td>
                  <td>{user.level?.user_level || 'N/A'}</td>
                  <td>
                    <span className={`badge ${user.status_karyawan === 'aktif' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status_karyawan}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(user)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    {user.level?.user_level !== 'admin' && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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