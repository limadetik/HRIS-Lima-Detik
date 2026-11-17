import { useMemo, useState } from 'react';

const employees = [
  { id: 1, name: 'Rina Putri', role: 'HR Staff', department: 'HR', status: 'Aktif' },
  { id: 2, name: 'Andi Pratama', role: 'Supervisor', department: 'Operasional', status: 'Aktif' },
  { id: 3, name: 'Siti Nurhaliza', role: 'Administrasi', department: 'Admin', status: 'Aktif' },
  { id: 4, name: 'Budi Santoso', role: 'Sales', department: 'Marketing', status: 'Cuti' },
  { id: 5, name: 'Dewi Lestari', role: 'Staff', department: 'Finance', status: 'Aktif' },
  { id: 6, name: 'Fajar Ramadhan', role: 'Staff', department: 'IT', status: 'Aktif' },
];

const attendanceLogs = [
  { date: 'Senin, 11 Nov', status: 'Hadir', time: '08:00 - 17:00' },
  { date: 'Selasa, 12 Nov', status: 'Hadir', time: '08:05 - 17:00' },
  { date: 'Rabu, 13 Nov', status: 'Terlambat', time: '08:35 - 17:00' },
  { date: 'Kamis, 14 Nov', status: 'Hadir', time: '08:00 - 17:00' },
  { date: 'Jumat, 15 Nov', status: 'Izin', time: 'Cuti' },
];

const leaveRequests = [
  { name: 'Rina Putri', type: 'Cuti Tahunan', days: '3 hari', status: 'Disetujui' },
  { name: 'Andi Pratama', type: 'Izin Sakit', days: '1 hari', status: 'Menunggu' },
  { name: 'Siti Nurhaliza', type: 'Cuti Melahirkan', days: '90 hari', status: 'Diproses' },
];

const ppRules = [
  {
    id: 'PP-01',
    title: 'Cuti Tahunan',
    category: 'Cuti',
    article: 'Pasal 5',
    summary: 'Karyawan berhak mendapatkan cuti tahunan sesuai masa kerja dan periode yang berlaku.',
    keywords: ['cuti', 'libur', 'hari libur', 'cuti tahunan', 'liburan'],
    content:
      'Karyawan berhak mengambil cuti tahunan sesuai ketentuan yang berlaku. Pengajuan cuti harus disetujui oleh atasan dan HR sebelum tanggal cuti dimulai.',
  },
  {
    id: 'PP-02',
    title: 'Kehadiran dan keterlambatan',
    category: 'Absensi',
    article: 'Pasal 8',
    summary: 'Keterlambatan berulang dapat diproses sesuai ketentuan, dan karyawan harus memberitahu jika ada kendala hadir.',
    keywords: ['telat', 'terlambat', 'datang', 'absen', 'kehadiran', 'macet'],
    content:
      'Karyawan yang terlambat harus memberitahukan alasan keterlambatan. Jika keterlambatan berulang tanpa alasan yang sah, proses administrasi dapat dilakukan sesuai kebijakan perusahaan.',
  },
  {
    id: 'PP-03',
    title: 'Izin Sakit',
    category: 'Izin',
    article: 'Pasal 10',
    summary: 'Izin sakit dapat diajukan dengan bukti atau informasi yang dibutuhkan, terutama untuk kebutuhan yang lebih dari satu hari.',
    keywords: ['sakit', 'izin sakit', 'demam', 'kondisi', 'kesehatan'],
    content:
      'Izin sakit harus diinformasikan sesegera mungkin. Karyawan dapat mengajukan izin sakit sesuai ketentuan internal dan dapat diminta bukti pendukung bila diperlukan.',
  },
  {
    id: 'PP-04',
    title: 'Kebijakan Privasi dan Data Karyawan',
    category: 'Privasi',
    article: 'Pasal 12',
    summary: 'Data karyawan hanya bisa diakses oleh pihak yang berwenang sesuai kebutuhan pekerjaan.',
    keywords: ['data', 'privasi', 'informasi', 'data pribadi', 'kerahasiaan'],
    content:
      'Setiap data karyawan bersifat rahasia. Penggunaan, akses, dan pembagian data hanya dibatasi untuk kebutuhan operasional yang sah sesuai wewenang perusahaan.',
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('Karyawan');
  const [name, setName] = useState('Rina');
  const [problem, setProblem] = useState(
    'Saya terlambat masuk karena macet tadi pagi dan ingin tahu apakah ada ketentuan yang mengatur hal itu?'
  );
  const [answer, setAnswer] = useState(null);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.status === 'Aktif').length;
  const onTimeRate = 78;
  const pendingLeave = leaveRequests.filter((item) => item.status === 'Menunggu').length;

  const dashboardCards = [
    { label: 'Total Karyawan', value: totalEmployees, tone: 'blue' },
    { label: 'Karyawan Aktif', value: activeEmployees, tone: 'green' },
    { label: 'Kehadiran', value: `${onTimeRate}%`, tone: 'purple' },
    { label: 'Cuti Menunggu', value: pendingLeave, tone: 'orange' },
  ];

  const matchedRule = useMemo(() => {
    const normalized = problem.toLowerCase();
    return (
      ppRules.find((rule) =>
        rule.keywords.some((keyword) => normalized.includes(keyword))
      ) || null
    );
  }, [problem]);

  const handleAsk = () => {
    if (!matchedRule) {
      setAnswer({
        title: 'Belum ada ketentuan yang cocok',
        article: 'Silakan hubungi HR',
        summary:
          'Sistem belum menemukan pasal yang relevan dari PP yang tersedia. Silakan lanjutkan ke HR untuk pengecekan lebih lanjut.',
        content:
          'Jawaban ini bukan keputusan resmi perusahaan, tetapi panduan awal berdasarkan PP yang telah terdata. Jika situasi sensitif atau tidak ada kesesuaian, pengelola HR akan membantu.',
      });
      return;
    }

    setAnswer({
      title: matchedRule.title,
      article: matchedRule.article,
      summary: matchedRule.summary,
      content: matchedRule.content,
    });
  };

  const loginAs = (selectedRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    setName(selectedRole === 'HR' ? 'HR Admin' : selectedRole === 'Atasan' ? 'Andi Pratama' : 'Rina Putri');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="brand">
            <span className="badge">HRIS</span>
            <h1>UMKM Employee Portal</h1>
          </div>

          <p className="subtitle">
            Sistem HRIS untuk 80 karyawan. Login untuk melihat dashboard, data karyawan,
            absensi, cuti, dan peraturan perusahaan.
          </p>

          <div className="role-buttons">
            <button className="primary-btn" onClick={() => loginAs('Karyawan')}>
              Masuk sebagai Karyawan
            </button>
            <button className="secondary-btn" onClick={() => loginAs('Atasan')}>
              Masuk sebagai Atasan
            </button>
            <button className="secondary-btn" onClick={() => loginAs('HR')}>
              Masuk sebagai HR
            </button>
          </div>

          <div className="login-footer">
            <span>Versi demo</span>
            <span>Perusahaan UMKM</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <span className="badge">HRIS</span>
          <h2>Portal HR</h2>
        </div>

        <nav>
          <a className="active" href="#">Dashboard</a>
          <a href="#">Karyawan</a>
          <a href="#">Absensi</a>
          <a href="#">Cuti &amp; Izin</a>
          <a href="#">Peraturan</a>
          <a href="#">Pengaturan</a>
        </nav>

        <div className="sidebar-card">
          <p>Login sebagai</p>
          <strong>{role}</strong>
          <small>{name}</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Selamat datang</p>
            <h1>Dashboard HRIS</h1>
          </div>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </header>

        <section className="stats-grid">
          {dashboardCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.tone}`}>
              <small>{card.label}</small>
              <h3>{card.value}</h3>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Data Karyawan</h3>
              <button className="tiny-btn">Tambah</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Departemen</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.role}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`status-pill ${emp.status === 'Aktif' ? 'active' : 'inactive'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Absensi Terbaru</h3>
              <button className="tiny-btn">Lihat Semua</button>
            </div>

            <ul className="list">
              {attendanceLogs.map((item, index) => (
                <li key={index}>
                  <div>
                    <strong>{item.date}</strong>
                    <span>{item.time}</span>
                  </div>
                  <span className={`status-pill ${item.status === 'Hadir' ? 'active' : item.status === 'Terlambat' ? 'warning' : 'inactive'}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Cuti &amp; Izin</h3>
              <button className="tiny-btn">Ajukan</button>
            </div>

            <ul className="list">
              {leaveRequests.map((item, index) => (
                <li key={index}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.type} · {item.days}
                    </span>
                  </div>
                  <span className={`status-pill ${item.status === 'Disetujui' ? 'active' : item.status === 'Menunggu' ? 'warning' : 'inactive'}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Peraturan Perusahaan</h3>
            </div>

            <div className="pp-list">
              {ppRules.map((rule) => (
                <div key={rule.id} className="pp-item">
                  <span className="pp-tag">{rule.category}</span>
                  <h4>{rule.title}</h4>
                  <p>{rule.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel ask-pp">
          <div className="panel-header">
            <h3>Tanya Peraturan Perusahaan</h3>
          </div>

          <div className="ask-box">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={5}
              placeholder="Tuliskan masalah yang sedang Anda hadapi..."
            />
            <button className="primary-btn" onClick={handleAsk}>
              Cari Panduan PP
            </button>
          </div>

          {answer && (
            <div className="answer-box">
              <div className="answer-header">
                <span>{answer.article}</span>
                <strong>{answer.title}</strong>
              </div>
              <p>{answer.summary}</p>
              <div className="answer-body">{answer.content}</div>
            </div>
          )}

          {!answer && (
            <div className="empty-state">
              Masukkan masalah karyawan untuk melihat kaitan dengan peraturan perusahaan.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
