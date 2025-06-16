import { useEffect,useState } from "react";
import { Navigate, Outlet } from "react-router-dom"; // Pastikan Outlet diimpor
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useIdleTimer } from 'react-idle-timer';
import Swal from 'sweetalert2';

export default function MainLayout() {
  // =================================================================
  // SEMUA HOOKS HARUS DIPANGGIL DI SINI, DI BAGIAN ATAS
  // =================================================================

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);

  
  const { token, currentUser, setCurrentUser, setToken } = useAuth();

  const handleOnIdle = () => {
    Swal.fire({
      title: 'Sesi Anda Telah Berakhir',
      text: 'Anda akan dialihkan ke halaman login karena tidak ada aktivitas.',
      icon: 'warning',
      timer: 5000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didClose: () => {
        // Logout dari sisi frontend setelah notifikasi ditutup
        setToken(null);
        setCurrentUser({});
      }
    });
  };

  useIdleTimer({
    timeout: 1000 * 60 * 60, // 1 jam
    onIdle: handleOnIdle,
    debounce: 500
  });

  useEffect(() => {
    // Logika untuk mengambil data user hanya dijalankan jika ada token
    // dan data user belum ada.
    if (token && (!currentUser || Object.keys(currentUser).length === 0)) {
      axiosClient.get('/user').then(({ data }) => {
        setCurrentUser(data);
      }).catch(err => {
        console.error("Gagal mengambil data user:", err);
      });
    }
  }, [token, currentUser, setCurrentUser]); // Tambahkan token sebagai dependency

  // =================================================================
  // LOGIKA KONDISIONAL DAN RETURN JSX DIMULAI DARI SINI
  // =================================================================

  // Jika tidak ada token, paksa user kembali ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Tampilkan loading jika token ada tapi data user belum siap
  if (!currentUser || !currentUser.level) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Jika semua sudah siap, tampilkan layout utama
  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <footer className="main-footer mt-3">
        <div className="float-right d-none d-sm-inline">
          <strong>APPLICATION IS UNDER DEVELOPMENT</strong>
        </div>
        <strong>Copyright &copy; {`${year}`} PT MOMENTUM OTOMASI INDONESIA.</strong> All rights reserved.
      </footer>
    </div>
  );
}