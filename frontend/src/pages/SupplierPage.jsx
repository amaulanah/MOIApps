import React from 'react';
import SupplierManagement from '../components/SupplierManagement'; // Sesuaikan path jika perlu

export default function SupplierPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manajemen Supplier</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <SupplierManagement />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}