import React, { useState, useEffect } from 'react';

export default function SupplierModal({ supplier, onClose, onSave }) {
    const [formData, setFormData] = useState({
        kode_supplier: '',
        nama_supplier: '',
        nomor_telepon_supplier: '',
        email_supplier: '',
        alamat_supplier: '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData(supplier);
        } else {
            setFormData({
                kode_supplier: '', nama_supplier: '', nomor_telepon_supplier: '',
                email_supplier: '', alamat_supplier: '',
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, supplier ? supplier.id : null);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{supplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}</h5>
                                <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group"><label>Kode Supplier</label><input type="text" name="kode_supplier" value={formData.kode_supplier} onChange={handleChange} className="form-control" required disabled/></div>
                                <div className="form-group"><label>Nama Supplier</label><input type="text" name="nama_supplier" value={formData.nama_supplier} onChange={handleChange} className="form-control" required /></div>
                                <div className="form-group"><label>Nomor Telepon</label><input type="text" name="nomor_telepon_supplier" value={formData.nomor_telepon_supplier} onChange={handleChange} className="form-control" /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email_supplier" value={formData.email_supplier} onChange={handleChange} className="form-control" /></div>
                                <div className="form-group"><label>Alamat</label><textarea name="alamat_supplier" value={formData.alamat_supplier} onChange={handleChange} className="form-control" rows="3"></textarea></div>
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