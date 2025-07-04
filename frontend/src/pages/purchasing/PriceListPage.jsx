import React from 'react';
import PriceListManagement from '../../components/purchasing/PriceListManagement'; // Sesuaikan path

export default function PriceListPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Master Price List</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <PriceListManagement />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}