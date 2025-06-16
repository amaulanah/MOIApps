import { useState, useEffect } from 'react';
import axiosClient from '../api/axios';
import Swal from 'sweetalert2';
import { useConfirmation } from '../context/ConfirmationContext';
import UserLevelModal from './UserLevelModal'; // Pastikan mengimpor modal yang benar

export default function UserLevelManagementTab() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const confirm = useConfirmation();

  // Fungsi untuk mengambil data level dari API
  const fetchLevels = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/user-levels');
      setLevels(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data level dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLevels();
  }, []);

  const handleOpenModal = (level = null) => {
    setEditingLevel(level);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
  };

  const handleSave = async (levelData) => {
    confirm({
      title: 'Konfirmasi Penyimpanan',
      message: 'Anda yakin ingin menyimpan data level ini?',
      onConfirm: async () => {
        const isEditing = !!editingLevel;
        const url = isEditing ? `/user-levels/${editingLevel.id}` : '/user-levels';
        const method = isEditing ? 'put' : 'post';

        try {
          await axiosClient[method](url, levelData);
          Swal.fire('Sukses!', `Level berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`, 'success');
          handleCloseModal();
          fetchLevels();
        } catch (error) {
          const message = error.response?.data?.message || 'Terjadi kesalahan.';
          Swal.fire('Error', message, 'error');
        }
      },
    });
  };

  const handleDelete = (level) => {
    confirm({
      title: 'Konfirmasi Hapus',
      message: `Anda yakin ingin menghapus level "${level.user_level}"?`,
      confirmText: 'Ya, Hapus',
      confirmColor: 'danger',
      onConfirm: async () => {
        try {
          await axiosClient.delete(`/user-levels/${level.id}`);
          Swal.fire('Dihapus!', 'Level telah berhasil dihapus.', 'success');
          fetchLevels();
        } catch (error) {
          const message = error.response?.data?.message || 'Gagal menghapus level.';
          Swal.fire('Error', message, 'error');
        }
      },
    });
  };

  return (
    <div>
      {/* Tombol yang benar untuk level user */}
      <button className="btn btn-primary mb-3" onClick={() => handleOpenModal()}>
        <i className="fas fa-plus mr-2"></i> Tambah Level
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        /* Tabel yang benar untuk level user */
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Nama Level</th>
              <th style={{ width: '150px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(level => (
              <tr key={level.id}>
                <td>{level.user_level}</td>
                <td>
                    {/* Tombol Edit HANYA akan muncul jika level BUKAN 'admin' */}
                    {level.user_level === 'admin' ? (
                        <span className="text-muted font-italic">Unavailable</span>
                    ) : (
                        <>
                        <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(level)}>
                            <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(level)}>
                            <i className="fas fa-trash"></i> Hapus
                        </button>
                        </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Memanggil modal yang benar */}
      {isModalOpen && (
        <UserLevelModal
          level={editingLevel}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}