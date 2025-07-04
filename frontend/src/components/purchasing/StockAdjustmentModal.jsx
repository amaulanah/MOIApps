import React, { useState, useEffect } from 'react';

export default function StockAdjustmentModal({ item, onClose, onSave }) {

    // console.log("Data yang DITERIMA oleh modal:", item);

    const [formData, setFormData] = useState({
        quantity: 0,
        uom: 'PCS',
    });

    useEffect(() => {
        if (item) {
            setFormData({
                quantity: item.quantity || 0,
                uom: item.uom || 'PCS',
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    // const payload = new FormData();
    // Object.keys(formData).forEach(key => {
    //     payload.append(key, formData[key]);
    // });
    
    // // Tambahkan baris ini jika belum ada
    // payload.append('_method', 'PUT');

    // onSave(payload, item.id);
    onSave(formData, item.id);
};

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Stok</h5>
                                <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Kode Part</label>
                                    <input type="text" value={item.kode_part} className="form-control" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Nama Part</label>
                                    <input type="text" value={item.nama_part} className="form-control" disabled />
                                </div>
                                <hr />
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Satuan (UOM)</label>
                                    <select name="uom" value={formData.uom} onChange={handleChange} className="form-control" required>
                                        <option>PCS</option><option>UNIT</option><option>ROLL</option><option>METER</option><option>KG</option><option>CM</option><option>MM</option><option>BATANG</option><option>KOTAK</option><option>SET</option><option>PACK</option><option>BUNGKUS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                                <button type="submit" className="btn btn-primary">Simpan Perubahan Stok</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}