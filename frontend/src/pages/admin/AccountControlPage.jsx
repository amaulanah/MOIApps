// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import axiosClient from '../../api/axios';
import Swal from 'sweetalert2'; // Kita akan pakai sweetalert2 untuk notifikasi & konfirmasi

// Buat komponen terpisah agar lebih rapi
import UserManagementTab from '../../components/UserManagementTab';
import UserLevelManagementTab from '../../components/UserLevelManagementTab';

export default function AccountControlPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Account Control</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <div className="card card-primary card-tabs">
            <div className="card-header p-0 pt-1">
              <ul className="nav nav-tabs" id="account-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                    href="#users-tab" // Menggunakan href untuk best practice, tapi onClick yang utama
                    role="tab"
                  >
                    Manajemen User
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'levels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('levels')}
                    href="#levels-tab"
                    role="tab"
                  >
                    Manajemen Level User
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="account-tabs-content">
                <div
                  className={`tab-pane fade ${activeTab === 'users' ? 'show active' : ''}`}
                  id="users-tab"
                  role="tabpanel"
                >
                  {/* Hanya render komponen jika tabnya aktif untuk efisiensi */}
                  {activeTab === 'users' && <UserManagementTab />}
                </div>
                <div
                  className={`tab-pane fade ${activeTab === 'levels' ? 'show active' : ''}`}
                  id="levels-tab"
                  role="tabpanel"
                >
                   {/* 2. RENDER KOMPONEN BARU SAAT TAB AKTIF */}
                   {activeTab === 'levels' && <UserLevelManagementTab />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}