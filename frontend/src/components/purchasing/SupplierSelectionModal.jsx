import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axios';

// Modal ini untuk memilih supplier
export default function SupplierSelectionModal({ onClose, onSupplierSelect }) {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/suppliers')
            .then(({ data }) => setSuppliers(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (supplier) => {
        onSupplierSelect(supplier);
        onClose();
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Pilih Supplier</h5>
                            <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Kode</th>
                                            <th>Nama Supplier</th>
                                            <th>Email</th>
                                            <th style={{ width: '100px' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                                        ) : suppliers.map(supplier => (
                                            <tr key={supplier.id}>
                                                <td>{supplier.kode_supplier}</td>
                                                <td>{supplier.nama_supplier}</td>
                                                <td>{supplier.email_supplier}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-success" onClick={() => handleSelect(supplier)}>
                                                        Pilih
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}