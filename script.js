// 1. DATA GUNUNG (Diambil dari Flyer)
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

// State (Penyimpanan data sementara)
let pesanan = {
    gunung: null,
    paket: null,
    hargaDasar: 0,
    mepo: "",
    ojek: false,
    total: 0
};

// Elemen DOM
const containerGunung = document.getElementById('gunung-container');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const sumGunung = document.getElementById('sum-gunung');
const sumPaket = document.getElementById('sum-paket');
const sumMepo = document.getElementById('sum-mepo');
const sumOjek = document.getElementById('sum-ojek');
const sumTotal = document.getElementById('sum-total');
const btnWA = document.getElementById('btn-wa');

// TAMBAHAN: Set minimal tanggal hari ini (biar ga bisa milih tanggal kemarin)
const inputTanggal = document.getElementById('tanggal');
const today = new Date().toISOString().split('T')[0];
inputTanggal.setAttribute('min', today);

// ... (fungsi renderGunung & pilihGunung biarin sama) ...

// 4. FUNGSI PILIH PAKET
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

// TAMBAHAN: FUNGSI INPUT TANGGAL
inputTanggal.addEventListener('change', (e) => {
    pesanan.tanggal = e.target.value;
    
    // Format tanggal jadi cantik (Contoh: 12 Desember 2026)
    const opsiFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    const tanggalCantik = new Date(e.target.value).toLocaleDateString('id-ID', opsiFormat);
    
    sumTanggal.innerText = tanggalCantik;
    hitungTotal();
});

// 5. FUNGSI MEPO & OJEK (Sama kayak sebelumnya)
// ... (biarin sama) ...

// 6. HITUNG TOTAL & VALIDASI
function hitungTotal() {
    let total = pesanan.hargaDasar;
    
    if (pesanan.ojek) {
        total += 200000;
    }
    
    pesanan.total = total;
    sumTotal.innerText = formatRupiah(total);

    // Validasi: Tombol WA aktif jika Gunung, Paket, TANGGAL, dan Mepo sudah dipilih
    if (pesanan.gunung && pesanan.paket && pesanan.tanggal && pesanan.mepo) {
        btnWA.disabled = false;
    } else {
        btnWA.disabled = true;
    }
}

// ... (fungsi formatRupiah biarin sama) ...

// 8. REDIRECT KE WHATSAPP
btnWA.addEventListener('click', () => {
    const noWA = "628551970165"; 
    
    // Format tanggal buat di WA
    const opsiFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    const tanggalWA = new Date(pesanan.tanggal).toLocaleDateString('id-ID', opsiFormat);

    // Teks yang akan otomatis terisi di WA (TAMBAHIN TANGGAL)
    const pesan = `Halo Admin Trip By Puteescape, saya mau booking pendakian:%0A%0A` +
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

// Jalankan fungsi render saat pertama kali dibuka
renderGunung();

// 2. RENDER LIST GUNUNG
function renderGunung() {
    dataGunung.forEach(gunung => {
        const div = document.createElement('div');
        div.className = 'gunung-item';
        div.innerText = gunung.nama;
        div.onclick = () => pilihGunung(gunung, div);
        containerGunung.appendChild(div);
    });
}

// 3. FUNGSI PILIH GUNUNG
function pilihGunung(gunung, element) {
    // Reset UI
    document.querySelectorAll('.gunung-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Update State
    pesanan.gunung = gunung.nama;
    sumGunung.innerText = gunung.nama;

    // Update Harga di Step 2
    document.getElementById('label-harga-all').innerText = formatRupiah(gunung.all);
    document.getElementById('label-harga-bc').innerText = formatRupiah(gunung.bc);
    
    // Simpan harga ke radio button
    document.getElementById('paket-all').dataset.harga = gunung.all;
    document.getElementById('paket-bc').dataset.harga = gunung.bc;

    // Tampilkan Step 2
    step2.classList.remove('hidden');
    step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset pilihan paket sebelumnya
    document.querySelectorAll('input[name="paket"]').forEach(radio => radio.checked = false);
    pesanan.paket = null;
    pesanan.hargaDasar = 0;
    step3.classList.add('hidden');
    hitungTotal();
}

// 4. FUNGSI PILIH PAKET
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

// 5. FUNGSI MEPO & OJEK
document.getElementById('mepo').addEventListener('change', (e) => {
    pesanan.mepo = e.target.value;
    sumMepo.innerText = pesanan.mepo;
    hitungTotal();
});

document.getElementById('add-ojek').addEventListener('change', (e) => {
    pesanan.ojek = e.target.checked;
    sumOjek.innerText = pesanan.ojek ? 'Ya (+Rp 200.000)' : 'Tidak';
    hitungTotal();
});

// 6. HITUNG TOTAL & VALIDASI
function hitungTotal() {
    let total = pesanan.hargaDasar;
    
    if (pesanan.ojek) {
        total += 200000;
    }
    
    pesanan.total = total;
    sumTotal.innerText = formatRupiah(total);

    // Validasi: Tombol WA aktif jika Gunung, Paket, dan Mepo sudah dipilih
    if (pesanan.gunung && pesanan.paket && pesanan.mepo) {
        btnWA.disabled = false;
    } else {
        btnWA.disabled = true;
    }
}

// 7. FORMAT RUPIAH
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// 8. REDIRECT KE WHATSAPP
btnWA.addEventListener('click', () => {
    const noWA = "628551970165"; // Ganti dengan nomor WA lu (awali 62)
    
    // Teks yang akan otomatis terisi di WA
    const pesan = `Halo Admin Trip By Puteescape, saya mau booking pendakian:%0A%0A` +
                  `🏔️ Destinasi: *${pesanan.gunung}*%0A` +
                  `🎒 Paket: *${pesanan.paket}*%0A` +
                  `📍 Meeting Point: *${pesanan.mepo}*%0A` +
                  `🏍️ Tambahan Ojek: *${pesanan.ojek ? 'Ya' : 'Tidak'}*%0A%0A` +
                  `💰 Total Estimasi: *${formatRupiah(pesanan.total)}*%0A%0A` +
                  `Mohon info selanjutnya ya min. Terima kasih!`;

    const urlWA = `https://wa.me/${noWA}?text=${pesan}`;
    window.open(urlWA, '_blank');
});

// Jalankan fungsi render saat pertama kali dibuka
renderGunung();