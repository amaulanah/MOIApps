import axios from "axios";

// Buat instance Axios dengan konfigurasi dasar
const axiosClient = axios.create({
  // URL base dari API Laravel Anda. Pastikan port-nya sesuai.
  baseURL: 'http://localhost:8000/api' 
});

// Interceptor untuk request.
// Ini akan dijalankan SEBELUM setiap request dikirim.
axiosClient.interceptors.request.use((config) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem('ACCESS_TOKEN');
  // Tambahkan header Authorization ke setiap request
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor untuk response.
// Ini akan dijalankan SETELAH menerima response dari API.
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');

      // TAMBAHKAN BARIS INI: Paksa muat ulang halaman
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;