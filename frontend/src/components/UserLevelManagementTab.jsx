import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axios';
import Swal from 'sweetalert2';
import UserLevelModal from './UserLevelModal';

export default function UserLevelManagementTab() {
    const [userLevels, setUserLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState(null);
    const [allPermissions, setAllPermissions] = useState([]);

    // --- FUNGSI fetchData YANG DIPERBAIKI ---
    const fetchData = () => {
        setLoading(true);
        // Ambil data user level dan semua permission secara bersamaan
        Promise.all([
            axiosClient.get('/user-levels'),
            axiosClient.get('/permissions')
        ]).then(([userLevelsResponse, permissionsResponse]) => {
            setUserLevels(userLevelsResponse.data);
            setAllPermissions(permissionsResponse.data);
        }).catch(() => {
            Swal.fire('Error', 'Gagal memuat data dari server.', 'error');
        }).finally(() => {
            setLoading(false);
        });
    };

    // useEffect sekarang hanya memanggil satu fungsi
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (isModalOpen) { document.body.classList.add('modal-open'); }
        else { document.body.classList.remove('modal-open'); }
        return () => { document.body.classList.remove('modal-open'); };
    }, [isModalOpen]);

    const handleOpenModal = (level = null) => {
        setEditingLevel(level);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLevel(null);
    };

    const handleSave = (formData, id) => {
        const request = id
            ? axiosClient.put(`/user-levels/${id}`, formData)
            : axiosClient.post('/user-levels', formData);

        request.then(() => {
            Swal.fire('Sukses!', 'Data level user berhasil disimpan.', 'success');
            fetchData();
            handleCloseModal();
        }).catch(error => {
            const message = error.response?.data?.message || 'Gagal menyimpan data.';
            Swal.fire('Error', message, 'error');
        });
    };

    const handleDelete = (level) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: `Anda akan menghapus role "${level.user_level}". Tindakan ini tidak dapat dibatalkan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/user-levels/${level.id}`)
                    .then(() => {
                        Swal.fire('Dihapus!', 'Role telah berhasil dihapus.', 'success');
                        fetchData();
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || 'Gagal menghapus role.';
                        Swal.fire('Error', message, 'error');
                    });
            }
        });
    };

    return (
        <div>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <i className="fas fa-plus mr-2"></i> Tambah Role Baru
                </button>
            </div>

            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Nama Role</th>
                        <th>Hak Akses</th>
                        <th style={{ width: '120px' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="3" className="text-center">Loading...</td></tr>
                    ) : userLevels.map(level => (
                        <tr key={level.id}>
                            <td>{level.user_level}</td>
                            <td>
                                {level.permissions.map(perm => (
                                    <span key={perm.id} className="badge badge-info mr-1">{perm.name}</span>
                                ))}
                            </td>
                            <td>
                                <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(level)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                {level.user_level !== 'admin' && (
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(level)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <UserLevelModal
                    level={editingLevel}
                    allPermissions={allPermissions}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}