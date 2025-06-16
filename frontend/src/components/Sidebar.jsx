import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SubMenuItem = ({ to, icon, children }) => (
  <li className="nav-item">
    <NavLink to={to} className="nav-link">
      <i className={`nav-icon ${icon}`}></i>
      <p>{children}</p>
    </NavLink>
  </li>
);

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const [adminOpen, setAdminOpen] = useState(location.pathname.startsWith('/account-control'));
  const [salesOpen, setSalesOpen] = useState(
    ['/work-order', '/bom-list', '/customers'].some(path => location.pathname.startsWith(path))
  );
  const [purchasingOpen, setPurchasingOpen] = useState(
    ['/purchase-request', '/purchase-order', '/suppliers', '/price-list'].some(path => location.pathname.startsWith(path))
  );
  const [inventoryOpen, setInventoryOpen] = useState(
    ['/master-part', '/incoming', '/outgoing', '/return', '/stock-adjustment', '/balance-stock'].some(path => location.pathname.startsWith(path))
  );

  const canAccessAccountControl = ['admin', 'director'].includes(currentUser?.level?.user_level);
  const canAccessSales = true;
  const canAccessPurchasing = true;
  const canAccessInventory = true;

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <NavLink 
        to="/dashboard" 
        className="brand-link" 
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <img 
          src="/momentum.png"
          alt="Nama Aplikasi Anda Logo" 
          className="brand-image elevation-3 momentum-logo" 
        />
      </NavLink>
      <div className="sidebar">
        {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">... User Panel ...</div> */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              {/* Link NavLink membungkus ikon dan paragraf */}
              <NavLink to="/dashboard" className="nav-link">
                {/* 1. Ikon untuk Dashboard */}
                <i className="nav-icon fas fa-tachometer-alt"></i>
                {/* 2. Teks dibungkus dengan tag <p> */}
                <p>Dashboard</p>
              </NavLink>
            </li>

            {canAccessAccountControl && (
              <li className={`nav-item ${adminOpen ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => setAdminOpen(!adminOpen)}>
                  <i className="nav-icon fas fa-user-shield"></i><p>ADMIN CONTROL<i className="right fas fa-angle-left"></i></p>
                </a>
                <ul className="nav nav-treeview">
                  <SubMenuItem to="/account-control" icon="far fa-circle">Account Control</SubMenuItem>
                </ul>
              </li>
            )}
            
            {canAccessSales && (
               <li className={`nav-item ${salesOpen ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => setSalesOpen(!salesOpen)}>
                  <i className="nav-icon fas fa-chart-line"></i><p>SALES<i className="right fas fa-angle-left"></i></p>
                </a>
                <ul className="nav nav-treeview">
                  <SubMenuItem to="/work-order" icon="far fa-circle">Work Order</SubMenuItem>
                  <SubMenuItem to="/bom-list" icon="far fa-circle">Bill of Material</SubMenuItem>
                  <SubMenuItem to="/customers" icon="far fa-circle">Customers</SubMenuItem>
                </ul>
              </li>
            )}
            
            {canAccessPurchasing && (
              <li className={`nav-item ${purchasingOpen ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => setPurchasingOpen(!purchasingOpen)}>
                  <i className="nav-icon fas fa-shopping-cart"></i><p>PURCHASING<i className="right fas fa-angle-left"></i></p>
                </a>
                <ul className="nav nav-treeview">
                  <SubMenuItem to="/purchase-request" icon="far fa-circle">Purchase Request</SubMenuItem>
                  <SubMenuItem to="/purchase-order" icon="far fa-circle">Purchase Order</SubMenuItem>
                  <SubMenuItem to="/suppliers" icon="far fa-circle">Suppliers</SubMenuItem>
                  <SubMenuItem to="/price-list" icon="far fa-circle">Price List</SubMenuItem>
                </ul>
              </li>
            )}

            {canAccessInventory && (
              <li className={`nav-item ${inventoryOpen ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => setInventoryOpen(!inventoryOpen)}>
                  <i className="nav-icon fas fa-warehouse"></i><p>INVENTORY<i className="right fas fa-angle-left"></i></p>
                </a>
                <ul className="nav nav-treeview">
                  <SubMenuItem to="/master-part" icon="far fa-circle">Master Parts</SubMenuItem>
                  <SubMenuItem to="/incoming" icon="far fa-circle">Incoming</SubMenuItem>
                  <SubMenuItem to="/outgoing" icon="far fa-circle">Outgoing</SubMenuItem>
                  <SubMenuItem to="/return" icon="far fa-circle">Return</SubMenuItem>
                  <SubMenuItem to="/stock-adjustment" icon="far fa-circle">Stock Adjustment</SubMenuItem>
                  <SubMenuItem to="/balance-stock" icon="far fa-circle">Balance Stock</SubMenuItem>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}