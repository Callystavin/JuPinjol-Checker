// Data dummy 

const dbOJK = [
    "akulaku",
    "kredivo",
    "indodana",
    "adakami",
    "kredit pintar",
    "easycash",
    "spinjam",
    "rupiah cepat",
    "smartcoop",
    "pinjamduit",
    "maucash",
    "adada",
    "uatas",
    "bantu-saku",
    "finmas"
];

const dbIlegal = [
    "dana cepat",
    "pinjam kilat",
    "rupiah petir",
    "dompet sakti",
    "uang cair",
    "pinjam gampang",
    "kredit bagus",
    "dana cair"
];

let calcMode = "pinjol";


/* =====================================
   SEARCH PINJOL
===================================== */

function searchPinjol() {

    const query = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const resultBox =
        document.getElementById("searchResult");

    if (query === "") {
        resultBox.classList.add("d-none");
        resultBox.innerHTML = "";
        return;
    }

    resultBox.classList.remove("d-none");

    const isLegal = dbOJK.some(
        item =>
            item.includes(query) ||
            query.includes(item)
    );

    const isKnownIlegal = dbIlegal.some(
        item =>
            item.includes(query) ||
            query.includes(item)
    );


    /* LEGAL */

    if (isLegal) {

        resultBox.className =
            "search-result result-legal rounded-3 p-3 mt-3";

        resultBox.innerHTML = `
            <div class="d-flex align-items-center gap-2 fw-bold text-success mb-2">
                <i class="fa-solid fa-circle-check fs-5"></i>
                <span>TERDAFTAR & BERIZIN RESMI OJK</span>
            </div>

            <p class="mb-0">
                Aplikasi ini tercatat dalam daftar pengawasan OJK.
                Tetap bijak meminjam sesuai kemampuan bayar!
            </p>`
            ;

        return;
    }


    /* ILLEGAL / UNKNOWN */

    resultBox.className =
        "search-result result-illegal rounded-3 p-3 mt-3";

    resultBox.innerHTML = `
        <div class="d-flex align-items-center gap-2 fw-bold text-danger mb-2">
            <i class="fa-solid fa-triangle-exclamation fs-5"></i>
            <span>
                PERINGATAN: INDIKASI ILEGAL /
                TIDAK TERDAFTAR OJK!
            </span>
        </div>

        <p class="mb-0">
            Aplikasi tidak ditemukan dalam database resmi OJK.
            Waspada teror penyebaran data pribadi,
            bunga mencekik, dan denda tidak wajar!
        </p>
    `;
}


/* =====================================
   QUICK SEARCH
===================================== */

function fillSearch(term) {

    const input =
        document.getElementById("searchInput");

    input.value = term;

    searchPinjol();
}


/* =====================================
   SWITCH CALCULATOR MODE
===================================== */

function switchCalcMode(mode) {

    calcMode = mode;

    const btnPinjol = document.getElementById("tabPinjol");
    const btnJudol = document.getElementById("tabJudol");

    const labelNominal = document.getElementById("labelNominal");
    const labelRate = document.getElementById("labelRate");
    const labelDays = document.getElementById("labelDays");
    const labelTotal = document.getElementById("labelTotal");
    const labelExtra = document.getElementById("labelExtra");

    if (mode === "pinjol") {

        btnPinjol.className = "calc-tab active-pin";
        btnJudol.className = "calc-tab inactive";

        labelNominal.innerText = "Nominal Pinjaman (Rp)";
        labelRate.innerText = "Bunga Harian (%)";
        labelDays.innerText = "Lama Penunggakan (Hari)";
        labelTotal.innerText = "Total Beban Pembayaran:";
        labelExtra.innerText = "Bunga Tambahan:";

    } else {

        btnJudol.className = "calc-tab active-judol";
        btnPinjol.className = "calc-tab inactive";

        labelNominal.innerText = "Deposit per Hari (Rp)";
        labelRate.innerText = "Persentase Kalah (%)";
        labelDays.innerText = "Lama Main (Hari)";
        labelTotal.innerText = "Total Uang Disetor:";
        labelExtra.innerText = "Uang yang Hilang:";
    }

    calculateRisk();
}


/* =====================================
   CALCULATE RISK
===================================== */

function calculateRisk() {

    const amount = parseFloat(document.getElementById("calcAmount").value) || 0;
    const rate = parseFloat(document.getElementById("calcRate").value) || 0;
    const days = parseFloat(document.getElementById("calcDays").value) || 0;

    let extra = 0;
    let total = 0;
    let ratio = 0;

    if (calcMode === "pinjol") {

        // Pinjol: bunga menumpuk tiap hari
        extra = amount * (rate / 100) * days;
        total = amount + extra;
        ratio = extra / (amount || 1);

    } else {

        // Judol: tiap hari deposit, sebagian hilang
        total = amount * days;              // total uang disetor
        extra = total * (rate / 100);       // uang yang hilang
        ratio = rate / 100;                 // seberapa besar porsi yang hilang
    }

    // Tampilkan hasil
    document.getElementById("resTotal").innerText =
        "Rp " + Math.round(total).toLocaleString("id-ID");

    document.getElementById("resExtra").innerText =
        (calcMode === "pinjol" ? "+Rp " : "-Rp ") +
        Math.round(extra).toLocaleString("id-ID");

    // Indikator risiko
    const riskBar = document.getElementById("riskBar");
    const riskText = document.getElementById("riskLevelText");

    if (ratio < 0.2) {

        riskBar.style.width = "25%";
        riskBar.className = "risk-bar low";
        riskText.innerText = "Rendah (Tetap Waspada)";
        riskText.className = "risk-text safe";

    } else if (ratio < 0.5) {

        riskBar.style.width = "50%";
        riskBar.className = "risk-bar medium";
        riskText.innerText = "Sedang (Mulai Mencekik)";
        riskText.className = "risk-text warning";

    } else {

        riskBar.style.width = "95%";
        riskBar.className = "risk-bar high";
        riskText.innerText = "Bahaya Ekstrem (Potensi Gagal Bayar & Teror)";
        riskText.className = "risk-text danger";
    }
}


/* =====================================
   CURHAT ANONIM
===================================== */

function submitCurhat(event) {

    event.preventDefault();

    const text =
        document.getElementById("curhatText").value;

    if (text.trim() !== "") {

        alert(
            "Pesan kamu berhasil dikirim secara anonim. " +
            "Terima kasih sudah berani bersuara!"
        );

        document.getElementById(
            "curhatText"
        ).value = "";
    }
}


/* =====================================
   INITIALIZATION
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        calculateRisk();

    }
);
