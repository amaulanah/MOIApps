import React from 'react';
import StockAdjustmentManagement from '../../components/purchasing/StockAdjustmentManagement';

export default function StockAdjustmentPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0">Stock Adjustment</h1>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <StockAdjustmentManagement />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}