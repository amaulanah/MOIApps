import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../api/axios';
import Swal from 'sweetalert2';
import PriceListModal from './PriceListModal'; // Menggunakan modal yang benar

// --- FUNGSI HELPER BARU UNTUK FORMAT HARGA ---
const formatCurrency = (harga, mata_uang) => {
    const number = parseFloat(harga);
    if (isNaN(number)) {
        return '-';
    }

    const options = {
        style: 'currency',
        currency: mata_uang,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    // Gunakan Intl.NumberFormat untuk pemformatan yang benar
    // dan ganti beberapa simbol default agar sesuai keinginan Anda
    let formatted = new Intl.NumberFormat('en-US', options).format(number);

    switch (mata_uang) {
        case 'IDR':
            // Mengubah format default $ menjadi Rp
            return `Rp ${new Intl.NumberFormat('id-ID').format(number)}`;
        case 'SGD':
            return `S$${number.toLocaleString('en-US')}`;
        case 'USD':
            return `$${number.toLocaleString('en-US')}`;
        case 'CNY':
            return `¥${number.toLocaleString('en-US')}`;
        case 'JPY':
            return `¥${number.toLocaleString('en-US')}`;
        case 'MYR':
            return `RM${number.toLocaleString('en-US')}`;
        default:
            return formatted;
    }
};
// ------------------------------------------

export default function PriceListManagement() {
    const [priceList, setPriceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nama_part', direction: 'ascending' });

    useEffect(() => {
        if (isModalOpen) { document.body.classList.add('modal-open'); }
        else { document.body.classList.remove('modal-open'); }
        return () => { document.body.classList.remove('modal-open'); };
    }, [isModalOpen]);

    const fetchData = () => {
        setLoading(true);
        axiosClient.get('/price-lists')
            .then(({ data }) => setPriceList(data))
            .catch(() => Swal.fire('Error', 'Gagal memuat data price list.', 'error'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchData, []);

    const processedItems = useMemo(() => {
        let sortedItems = [...priceList];
        if (searchTerm) {
            sortedItems = sortedItems.filter(item =>
                item.nama_part.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.kode_part.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        sortedItems.sort((a, b) => {
            const valA = sortConfig.key.includes('.') ? getNestedValue(a, sortConfig.key) : a[sortConfig.key];
            const valB = sortConfig.key.includes('.') ? getNestedValue(b, sortConfig.key) : b[sortConfig.key];
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortedItems;
    }, [priceList, searchTerm, sortConfig]);

    const getNestedValue = (obj, path) => path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
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

    const handleOpenModal = async (item = null) => {
        if (item) {
            setEditingItem(item);
            setIsModalOpen(true);
        } else {
            try {
                const { data } = await axiosClient.get('/price-lists/next-code');
                setEditingItem({ kode_part: data.next_code });
                setIsModalOpen(true);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                Swal.fire('Error', 'Gagal mendapatkan kode part baru.', 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = (formData, id) => {
        const request = id
            ? axiosClient.put(`/price-lists/${id}`, formData)
            : axiosClient.post('/price-lists', formData);

        request.then(() => {
            Swal.fire('Sukses', `Part berhasil ${id ? 'diperbarui' : 'ditambahkan'}.`, 'success');
            fetchData();
            handleCloseModal();
        }).catch(error => {
            const message = error.response?.data?.message || 'Terjadi kesalahan.';
            Swal.fire('Error', message, 'error');
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Data part ini akan dihapus permanen!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/price-lists/${id}`)
                    .then(() => {
                        Swal.fire('Dihapus!', 'Data part berhasil dihapus.', 'success');
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
                        placeholder="Cari berdasarkan Kode atau Nama Part..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6 text-right">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus mr-2"></i> Tambah Part Baru
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    {/* --- PERUBAHAN HEADER TABEL --- */}
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('kode_part')} style={{cursor: 'pointer'}}>Kode Part {getSortIcon('kode_part')}</th>
                            <th onClick={() => requestSort('nama_part')} style={{cursor: 'pointer'}}>Nama Part {getSortIcon('nama_part')}</th>
                            <th onClick={() => requestSort('quantity')} style={{cursor: 'pointer'}}>Qty/UOM {getSortIcon('quantity')}</th>
                            <th onClick={() => requestSort('harga')} style={{cursor: 'pointer'}}>Harga {getSortIcon('harga')}</th>
                            <th onClick={() => requestSort('kategori')} style={{cursor: 'pointer'}}>Kategori {getSortIcon('kategori')}</th>
                            <th onClick={() => requestSort('supplier.nama_supplier')} style={{cursor: 'pointer'}}>Supplier {getSortIcon('supplier.nama_supplier')}</th>
                            <th style={{width: '120px'}}>Aksi</th>
                        </tr>
                    </thead>
                    {/* --- PERUBAHAN BODY TABEL --- */}
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                        ) : processedItems.length > 0 ? (
                            processedItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.kode_part}</td>
                                    <td>{item.nama_part}</td>
                                    <td>{`${item.quantity} ${item.uom}`}</td>
                                    <td>{formatCurrency(item.harga, item.mata_uang)}</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.supplier?.nama_supplier || 'N/A'}</td>
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
                            <tr><td colSpan="7" className="text-center">Data tidak ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PriceListModal
                    item={editingItem}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}