// ==========================================
// 1. DATA GUNUNG & HARGA (Sesuai Flyer)
// ==========================================
const dataGunung = [
    { id: 'luhur', nama: 'Gunung Luhur', all: 350000, bc: 260000 },
    { id: 'kencana', nama: 'Gunung Kencana', all: 385000, bc: 285000 },
    { id: 'paku', nama: 'Bukit Pakuan', all: 365000, bc: 280000 },
    { id: 'paniisan', nama: 'Bukit Paniisan', all: 340000, bc: 275000 },
    { id: 'silala', nama: 'B.Silala & Daolong', all: 325000, bc: 255000 },
    { id: 'cibereum', nama: 'Curug Cibereum', all: 370000, bc: 290000 },
    { id: 'seribu', nama: 'Curug Seribu', all: 315000, bc: 250000 },
    { id: 'walet', nama: 'Curug Walet', all: 335000, bc: 270000 },
    { id: 'ratu', nama: 'Kawah Ratu', all: 395000, bc: 300000 },
    { id: 'cisadon', nama: 'Cisadon', all: 255000, bc: 220000 }
];

// ==========================================
// 2. STATE & ELEMEN DOM
// ==========================================
let pesanan = {
    nama: "",
    gunung: null,
    paket: null,
    hargaDasar: 0,
    tanggal: "",
    mepo: "",
    ojek: false,
    total: 0
};

// Ambil elemen dari HTML
const containerGunung = document.getElementById('gunung-container');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

// Input & Ringkasan
const inputNama = document.getElementById('nama');
const inputTanggal = document.getElementById('tanggal');
const inputMepo = document.getElementById('mepo');
const inputOjek = document.getElementById('add-ojek');

const sumNama = document.getElementById('sum-nama');
const sumGunung = document.getElementById('sum-gunung');
const sumPaket = document.getElementById('sum-paket');
const sumTanggal = document.getElementById('sum-tanggal');
const sumMepo = document.getElementById('sum-mepo');
const sumOjek = document.getElementById('sum-ojek');
const sumTotal = document.getElementById('sum-total');
const btnWA = document.getElementById('btn-wa');

// Set minimal tanggal hari ini (Anti Backdate)
const today = new Date().toISOString().split('T')[0];
inputTanggal.setAttribute('min', today);

// ==========================================
// 3. FUNGSI RENDER & PILIH GUNUNG
// ==========================================
function renderGunung() {
    dataGunung.forEach(gunung => {
        const div = document.createElement('div');
        div.className = 'gunung-item';
        div.innerText = gunung.nama;
        div.onclick = () => pilihGunung(gunung, div);
        containerGunung.appendChild(div);
    });
}

function pilihGunung(gunung, element) {
    // Reset pilihan sebelumnya
    document.querySelectorAll('.gunung-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Update State & UI
    pesanan.gunung = gunung.nama;
    sumGunung.innerText = gunung.nama;

    // Update Harga di Step 2
    document.getElementById('label-harga-all').innerText = formatRupiah(gunung.all);
    document.getElementById('label-harga-bc').innerText = formatRupiah(gunung.bc);
    
    // Simpan harga ke tombol radio
    document.getElementById('paket-all').dataset.harga = gunung.all;
    document.getElementById('paket-bc').dataset.harga = gunung.bc;

    // Tampilkan Step 2
    step2.classList.remove('hidden');
    step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset pilihan paket & step 3 jika ganti gunung
    document.querySelectorAll('input[name="paket"]').forEach(radio => radio.checked = false);
    pesanan.paket = null;
    pesanan.hargaDasar = 0;
    step3.classList.add('hidden');
    
    hitungTotal();
}

// ==========================================
// 4. FUNGSI PILIH PAKET
// ==========================================
document.querySelectorAll('input[name="paket"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        pesanan.paket = e.target.value;
        pesanan.hargaDasar = parseInt(e.target.dataset.harga);
        sumPaket.innerText = pesanan.paket;
        
        // Tampilkan Step 3
        step3.classList.remove('hidden');
        hitungTotal();
    });
});

// ==========================================
// 5. FUNGSI INPUT NAMA, TANGGAL, MEPO & OJEK
// ==========================================
inputNama.addEventListener('input', (e) => {
    pesanan.nama = e.target.value;
    sumNama.innerText = pesanan.nama ? pesanan.nama : '-';
    hitungTotal();
});

inputTanggal.addEventListener('change', (e) => {
    pesanan.tanggal = e.target.value;
    const opsiFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    const tanggalCantik = new Date(e.target.value).toLocaleDateString('id-ID', opsiFormat);
    sumTanggal.innerText = tanggalCantik;
    hitungTotal();
});

inputMepo.addEventListener('change', (e) => {
    pesanan.mepo = e.target.value;
    sumMepo.innerText = pesanan.mepo;
    hitungTotal();
});

inputOjek.addEventListener('change', (e) => {
    pesanan.ojek = e.target.checked;
    sumOjek.innerText = pesanan.ojek ? 'Ya (+Rp 200.000)' : 'Tidak';
    hitungTotal();
});

// ==========================================
// 6. FUNGSI HITUNG TOTAL & VALIDASI
// ==========================================
function hitungTotal() {
    let total = pesanan.hargaDasar;
    
    // Tambah harga ojek jika dicentang
    if (pesanan.ojek) {
        total += 200000;
    }
    
    pesanan.total = total;
    sumTotal.innerText = formatRupiah(total);

    // VALIDASI: Tombol WA nyala jika Nama, Gunung, Paket, Tanggal, & Mepo terisi
    if (
        pesanan.nama.trim() !== "" && 
        pesanan.gunung && 
        pesanan.paket && 
        pesanan.tanggal && 
        pesanan.mepo
    ) {
        btnWA.disabled = false;
    } else {
        btnWA.disabled = true;
    }
}

// ==========================================
// 7. FUNGSI FORMAT RUPIAH
// ==========================================
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// ==========================================
// 8. FUNGSI REDIRECT KE WHATSAPP
// ==========================================
btnWA.addEventListener('click', () => {
    const noWA = "628551970165"; // GANTI NOMOR WA LU DI SINI KALO BEDA
    
    const opsiFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    const tanggalWA = new Date(pesanan.tanggal).toLocaleDateString('id-ID', opsiFormat);

    // Susunan Pesan WhatsApp
    const pesan = `Halo Admin Trip By Puteescape, saya mau booking pendakian:%0A%0A` +
                  `👤 Nama Pemesan: *${pesanan.nama}*%0A` + 
                  `🏔️ Destinasi: *${pesanan.gunung}*%0A` +
                  `🎒 Paket: *${pesanan.paket}*%0A` +
                  `📅 Tanggal: *${tanggalWA}*%0A` + 
                  `📍 Meeting Point: *${pesanan.mepo}*%0A` +
                  `🏍️ Tambahan Ojek: *${pesanan.ojek ? 'Ya' : 'Tidak'}*%0A%0A` +
                  `💰 Total Estimasi: *${formatRupiah(pesanan.total)}*%0A%0A` +
                  `Mohon info selanjutnya ya min. Terima kasih!`;

    const urlWA = `https://wa.me/${noWA}?text=${pesan}`;
    window.open(urlWA, '_blank');
});

// ==========================================
// 9. JALANKAN SAAT HALAMAN DIBUKA
// ==========================================
renderGunung();