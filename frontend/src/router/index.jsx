import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts & Halaman Dasar
import Login from "../pages/LoginPage";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";

// Import Halaman Admin
import AccountControlPage from "../pages/admin/AccountControlPage";

// Import Halaman Sales
import WorkOrderPage from "../pages/sales/WorkOrderPage";
import BomListPage from "../pages/sales/BomListPage";
import CustomersPage from "../pages/sales/CustomersPage";

// Import Halaman Purchasing
import PurchaseRequestPage from "../pages/purchasing/PurchaseRequestPage";
import PurchaseOrderPage from "../pages/purchasing/PurchaseOrderPage";
import SuppliersPage from "../pages/purchasing/SuppliersPage";
import PriceListPage from "../pages/purchasing/PriceListPage";

// Import Halaman Inventory
import MasterPartPage from "../pages/inventory/MasterPartPage";
import IncomingPage from "../pages/inventory/IncomingPage";
import OutgoingPage from "../pages/inventory/OutgoingPage";
import ReturnPage from "../pages/inventory/ReturnPage";
import StockAdjustmentPage from "../pages/inventory/StockAdjustmentPage";
import BalanceStockPage from "../pages/inventory/BalanceStockPage";

//import halaman profile
import ProfilePage from "../pages/profile/ProfilePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', element: <Dashboard /> },

      // Rute Admin
      { path: '/account-control', element: <AccountControlPage /> },
      
      // Rute Sales
      { path: '/work-order', element: <WorkOrderPage /> },
      { path: '/bom-list', element: <BomListPage /> },
      { path: '/customers', element: <CustomersPage /> },
      
      // Rute Purchasing
      { path: '/purchase-request', element: <PurchaseRequestPage /> },
      { path: '/purchase-order', element: <PurchaseOrderPage /> },
      { path: '/suppliers', element: <SuppliersPage /> },
      { path: '/price-list', element: <PriceListPage /> },

      // Rute Inventory
      { path: '/master-part', element: <MasterPartPage /> },
      { path: '/incoming', element: <IncomingPage /> },
      { path: '/outgoing', element: <OutgoingPage /> },
      { path: '/return', element: <ReturnPage /> },
      { path: '/stock-adjustment', element: <StockAdjustmentPage /> },
      { path: '/balance-stock', element: <BalanceStockPage /> },

      //profile
      { path: '/profile', element: <ProfilePage /> },
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

export default router;