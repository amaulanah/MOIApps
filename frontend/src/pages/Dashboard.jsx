import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <h4>Selamat Datang, {currentUser.nama_karyawan}!</h4>
              <p>Nomor Induk Karyawan: {currentUser.nomor_induk_karyawan}</p>
              <p>Level: {currentUser.level.user_level}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}