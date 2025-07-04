import React, { useState, useEffect } from 'react';

// Terima 'allPermissions' sebagai prop baru
export default function UserLevelModal({ level, allPermissions, onClose, onSave }) {
    const [levelName, setLevelName] = useState('');
    // State baru untuk menyimpan ID permission yang dicentang
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());

    useEffect(() => {
        // Jika mode edit, isi data yang ada
        if (level) {
            setLevelName(level.user_level);
            // Buat Set dari ID permission yang sudah dimiliki role ini
            // Ini akan otomatis mencentang checkbox yang sesuai
            if (level.permissions) {
                setSelectedPermissions(new Set(level.permissions.map(p => p.id)));
            }
        } else {
            // Reset state untuk mode tambah
            setLevelName('');
            setSelectedPermissions(new Set());
        }
    }, [level]);

    // Fungsi untuk menangani saat checkbox dicentang/dihilangkan centangnya
    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(permissionId)) {
                newSelected.delete(permissionId);
            } else {
                newSelected.add(permissionId);
            }
            return newSelected;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Saat menyimpan, kirim nama level dan array dari ID permission yang dipilih
        const dataToSave = {
            user_level: levelName,
            permissions: Array.from(selectedPermissions)
        };
        onSave(dataToSave, level ? level.id : null);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{level ? 'Edit Role' : 'Tambah Role Baru'}</h5>
                                <button type="button" className="close" onClick={onClose}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nama Role</label>
                                    <input
                                        type="text"
                                        value={levelName}
                                        onChange={(e) => setLevelName(e.target.value)}
                                        className="form-control"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <hr />
                                <h6>Hak Akses Halaman</h6>
                                <div className="form-group">
                                    {/* Tampilkan daftar checkbox dari allPermissions */}
                                    {allPermissions && allPermissions.length > 0 ? (
                                        allPermissions.map(permission => (
                                            <div className="form-check" key={permission.id}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`perm-${permission.id}`}
                                                    checked={selectedPermissions.has(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`perm-${permission.id}`}>
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">Tidak ada data hak akses...</p>
                                    )}
                                </div>
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