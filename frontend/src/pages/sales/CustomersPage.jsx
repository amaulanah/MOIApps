import React from 'react';
import CustomerManagement from '../../components/sales/CustomerManagement';

export default function CustomersPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manajemen Customer</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <CustomerManagement />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}