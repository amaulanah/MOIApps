import React from 'react';

const pageTitle = "Suppliers";

export default function SuppliersPage() {
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{pageTitle}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center">Under Construction 🚧</h3>
              <p className="text-center text-muted">Fitur ini sedang dalam tahap pengembangan.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}