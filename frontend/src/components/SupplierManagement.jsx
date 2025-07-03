import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axios';
import Swal from 'sweetalert2';
import SupplierModal from './SupplierModal';

export default function SupplierManagement() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    
    // State untuk Search, Sort, Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nama_supplier', direction: 'ascending' });

    // Efek untuk mengatasi scroll modal
    useEffect(() => {
        if (isModalOpen) { document.body.classList.add('modal-open'); }
        else { document.body.classList.remove('modal-open'); }
        return () => { document.body.classList.remove('modal-open'); };
    }, [isModalOpen]);

    const fetchData = () => {
        setLoading(true);
        axiosClient.get('/suppliers')
            .then(({ data }) => setSuppliers(data))
            .catch(() => Swal.fire('Error', 'Gagal memuat data supplier.', 'error'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchData, []);

    // Logika untuk Search, Sort
    const processedSuppliers = useMemo(() => {
        let sortedItems = [...suppliers];
        if (searchTerm) {
            sortedItems = sortedItems.filter(item =>
                item.nama_supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.kode_supplier.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        sortedItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortedItems;
    }, [suppliers, searchTerm, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleSave = (formData, id) => {
        const request = id
            ? axiosClient.put(`/suppliers/${id}`, formData)
            : axiosClient.post('/suppliers', formData);

        request.then(() => {
            Swal.fire('Sukses', `Supplier berhasil ${id ? 'diperbarui' : 'ditambahkan'}.`, 'success');
            fetchData();
            handleCloseModal();
        }).catch(error => {
            const message = error.response?.data?.message || 'Terjadi kesalahan.';
            Swal.fire('Error', message, 'error');
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Data supplier ini akan dihapus permanen!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/suppliers/${id}`)
                    .then(() => {
                        Swal.fire('Dihapus!', 'Data supplier berhasil dihapus.', 'success');
                        fetchData();
                    })
                    .catch(() => Swal.fire('Error', 'Gagal menghapus data.', 'error'));
            }
        });
    };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cari berdasarkan Kode atau Nama Supplier..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6 text-right">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus mr-2"></i> Tambah Supplier
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('kode_supplier')} style={{cursor: 'pointer'}}>Kode {getSortIcon('kode_supplier')}</th>
                            <th onClick={() => requestSort('nama_supplier')} style={{cursor: 'pointer'}}>Nama Supplier {getSortIcon('nama_supplier')}</th>
                            <th onClick={() => requestSort('nomor_telepon_supplier')} style={{cursor: 'pointer'}}>Telepon {getSortIcon('nomor_telepon_supplier')}</th>
                            <th onClick={() => requestSort('email_supplier')} style={{cursor: 'pointer'}}>Email {getSortIcon('email_supplier')}</th>
                            <th>Alamat</th>
                            <th style={{width: '120px'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : processedSuppliers.length > 0 ? (
                            processedSuppliers.map(item => (
                                <tr key={item.id}>
                                    <td>{item.kode_supplier}</td>
                                    <td>{item.nama_supplier}</td>
                                    <td>{item.nomor_telepon_supplier}</td>
                                    <td>{item.email_supplier}</td>
                                    <td>{item.alamat_supplier}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(item)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center">Data tidak ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <SupplierModal
                    supplier={editingSupplier}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}