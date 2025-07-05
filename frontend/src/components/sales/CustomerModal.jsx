import React, { useState, useEffect } from 'react';

export default function CustomerModal({ customer, onClose, onSave }) {
    const [formData, setFormData] = useState({
        kode_customer: '',
        nama_customer: '',
        nomor_telepon_customer: '',
        email_customer: '',
        alamat_customer: '',
    });

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        } else {
            setFormData({
                kode_customer: '', nama_customer: '', nomor_telepon_customer: '',
                email_customer: '', alamat_customer: '',
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, customer ? customer.id : null);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{customer ? 'Edit Customer' : 'Tambah Customer Baru'}</h5>
                                <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group"><label>Kode Customer</label><input type="text" name="kode_customer" value={formData.kode_customer} className="form-control" disabled /></div>
                                <div className="form-group"><label>Nama Customer</label><input type="text" name="nama_customer" value={formData.nama_customer} onChange={handleChange} className="form-control" required /></div>
                                <div className="form-group"><label>Nomor Telepon</label><input type="text" name="nomor_telepon_customer" value={formData.nomor_telepon_customer} onChange={handleChange} className="form-control" /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email_customer" value={formData.email_customer} onChange={handleChange} className="form-control" /></div>
                                <div className="form-group"><label>Alamat</label><textarea name="alamat_customer" value={formData.alamat_customer} onChange={handleChange} className="form-control" rows="3"></textarea></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}