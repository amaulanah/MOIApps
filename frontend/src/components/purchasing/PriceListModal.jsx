import React, { useState, useEffect } from 'react';
import SupplierSelectionModal from './SupplierSelectionModal'; // Impor modal baru

export default function PriceListModal({ item, onClose, onSave }) {
    const [formData, setFormData] = useState({
        kode_part: '', nama_part: '', deskripsi_part: '', quantity: 0,
        uom: 'PCS', harga: 0, mata_uang: 'IDR', kategori: 'TOOLS',
        brand: '', supplier_id: '', kode_supplier: ''
    });
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                supplier_id: item.supplier_id || '',
                kode_supplier: item.supplier?.kode_supplier || '',
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSupplierSelect = (supplier) => {
        setFormData(prev => ({
            ...prev,
            supplier_id: supplier.id,
            kode_supplier: supplier.kode_supplier,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hapus kode_supplier dari data yang dikirim karena backend akan mengabaikannya
        // eslint-disable-next-line no-unused-vars
        const { kode_supplier, ...dataToSave } = formData;
        onSave(dataToSave, item.id);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{item.id ? 'Edit Part' : 'Tambah Part Baru'}</h5>
                                <button type="button" className="close" onClick={onClose}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4 form-group"><label>Kode Part</label><input type="text" value={formData.kode_part} className="form-control" disabled /></div>
                                    <div className="col-md-8 form-group"><label>Nama Part</label><input type="text" name="nama_part" value={formData.nama_part} onChange={handleChange} className="form-control" required /></div>
                                </div>
                                <div className="form-group"><label>Deskripsi</label><textarea name="deskripsi_part" value={formData.deskripsi_part} onChange={handleChange} className="form-control" rows="3"></textarea></div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Quantity</label>
                                        <input type="number" name="quantity" value={formData.quantity} className="form-control" disabled />
                                        <small className="form-text text-muted">Quantity dan UOM hanya bisa diganti oleh role Store.</small>
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Satuan (UOM)</label>
                                        <select name="uom" value={formData.uom} className="form-control" disabled>
                                            <option>PCS</option><option>UNIT</option><option>ROLL</option><option>METER</option><option>KG</option><option>CM</option><option>MM</option><option>BATANG</option><option>KOTAK</option><option>SET</option><option>PACK</option><option>BUNGKUS</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Harga</label>
                                        <div className="input-group">
                                            <input type="number" name="harga" value={formData.harga} onChange={handleChange} className="form-control" required step="any" />
                                            <select name="mata_uang" value={formData.mata_uang} onChange={handleChange} className="form-control" required><option>IDR</option><option>SGD</option><option>USD</option><option>CNY</option><option>JPY</option><option>MYR</option></select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 form-group"><label>Kategori</label><select name="kategori" value={formData.kategori} onChange={handleChange} className="form-control" required><option>TOOLS</option><option>ELECTRICAL PARTS</option><option>STATIONARIES</option><option>MECHANICALS</option><option>MACHINES</option></select></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group"><label>Brand/Merk</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-control" /></div>
                                    <div className="col-md-6 form-group">
                                        <label>Kode Supplier</label>
                                        <div className="input-group">
                                            <input type="text" name="kode_supplier" value={formData.kode_supplier} className="form-control" disabled />
                                            <div className="input-group-append"><button type="button" className="btn btn-outline-primary" onClick={() => setIsSupplierModalOpen(true)}>Pilih</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button><button type="submit" className="btn btn-primary">Simpan</button></div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
            {isSupplierModalOpen && <SupplierSelectionModal onClose={() => setIsSupplierModalOpen(false)} onSupplierSelect={handleSupplierSelect} />}
        </>
    );
}