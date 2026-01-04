// market.js — yükleme testi
console.log("market.js dosyası YÜKLENDİ");

// Dosya yüklendiği anda çalışır
alert("market.js çalışıyor (dosya yüklendi)");

// DOM tamamen hazır olduğunda çalışır
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM hazır, market.js aktif");

    alert("DOM hazır, market.js tam çalışıyor");

    // Sayfada test için bir buton yoksa otomatik ekler
    let btn = document.getElementById("marketTestBtn");

    if (!btn) {
        btn = document.createElement("button");
        btn.id = "marketTestBtn";
        btn.innerText = "MARKET TEST BUTONU";
        btn.style.padding = "12px";
        btn.style.fontSize = "16px";
        btn.style.cursor = "pointer";
        document.body.appendChild(btn);
    }

    btn.addEventListener("click", () => {
        alert("Market.js event çalışıyor");
        console.log("Butona tıklandı");
    });
});
