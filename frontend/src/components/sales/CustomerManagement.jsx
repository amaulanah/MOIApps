import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../api/axios';
import Swal from 'sweetalert2';
import CustomerModal from './CustomerModal';

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nama_customer', direction: 'ascending' });

    useEffect(() => {
        if (isModalOpen) { document.body.classList.add('modal-open'); }
        else { document.body.classList.remove('modal-open'); }
        return () => { document.body.classList.remove('modal-open'); };
    }, [isModalOpen]);

    const fetchData = () => {
        setLoading(true);
        axiosClient.get('/customers')
            .then(({ data }) => setCustomers(data))
            .catch(() => Swal.fire('Error', 'Gagal memuat data customer.', 'error'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchData, []);

    const processedCustomers = useMemo(() => {
        let sortedItems = [...customers];
        if (searchTerm) {
            sortedItems = sortedItems.filter(item =>
                item.nama_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.kode_customer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        sortedItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortedItems;
    }, [customers, searchTerm, sortConfig]);

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

    const handleOpenModal = async (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setIsModalOpen(true);
        } else {
            try {
                const { data } = await axiosClient.get('/customers/next-code');
                setEditingCustomer({ kode_customer: data.next_code });
                setIsModalOpen(true);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                Swal.fire('Error', 'Gagal mendapatkan kode customer baru.', 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSave = (formData, id) => {
        // eslint-disable-next-line no-unused-vars
        const { kode_customer, ...dataToSave } = formData;
        const request = id
            ? axiosClient.put(`/customers/${id}`, dataToSave)
            : axiosClient.post('/customers', dataToSave);

        request.then(() => {
            Swal.fire('Sukses', `Customer berhasil ${id ? 'diperbarui' : 'ditambahkan'}.`, 'success');
            fetchData();
            handleCloseModal();
        }).catch(error => {
            const message = error.response?.data?.message || 'Terjadi kesalahan.';
            Swal.fire('Error', message, 'error');
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Data customer ini akan dihapus permanen!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/customers/${id}`)
                    .then(() => {
                        Swal.fire('Dihapus!', 'Data customer berhasil dihapus.', 'success');
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
                        placeholder="Cari berdasarkan Kode atau Nama Customer..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6 text-right">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus mr-2"></i> Tambah Customer
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('kode_customer')} style={{cursor: 'pointer'}}>Kode {getSortIcon('kode_customer')}</th>
                            <th onClick={() => requestSort('nama_customer')} style={{cursor: 'pointer'}}>Nama Customer {getSortIcon('nama_customer')}</th>
                            <th>Telepon</th>
                            <th>Email</th>
                            <th>Alamat</th>
                            <th style={{width: '120px'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : processedCustomers.map(item => (
                            <tr key={item.id}>
                                <td>{item.kode_customer}</td>
                                <td>{item.nama_customer}</td>
                                <td>{item.nomor_telepon_customer}</td>
                                <td>{item.email_customer}</td>
                                <td>{item.alamat_customer}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenModal(item)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CustomerModal
                    customer={editingCustomer}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}