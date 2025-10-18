// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// ✅ Config yang sudah diperbaiki
const firebaseConfig = {
  apiKey: "AIzaSyC5SoEMSa7HqdMl0Ssaupc-Z8OByR2E1aQ",
  authDomain: "testing-47f1e.firebaseapp.com",
  databaseURL: "https://testing-47f1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testing-47f1e",
  storageBucket: "testing-47f1e.appspot.com",
  messagingSenderId: "1036606294271",
  appId: "1:1036606294271:web:3e556aeaeaca7c75bee4ca",
  measurementId: "G-83R71BXDDW"
};

// 🔥 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const form = document.getElementById("memoryForm");
const memoriesDiv = document.getElementById("memories");

// 🧠 Kirim kenangan baru
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const imageFile = document.getElementById("image").files[0];

  let imageUrl = "";

  if (imageFile) {
    const imgRef = sRef(storage, 'memories/' + Date.now() + '-' + imageFile.name);
    await uploadBytes(imgRef, imageFile);
    imageUrl = await getDownloadURL(imgRef);
  }

  const memoryRef = ref(db, "memories");
  push(memoryRef, {
    name,
    message,
    imageUrl,
    timestamp: serverTimestamp()
  });

  form.reset();
});

// 🪄 Tampilkan semua kenangan realtime
onValue(ref(db, "memories"), (snapshot) => {
  memoriesDiv.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.values(data).reverse().forEach(mem => {
      const div = document.createElement("div");
      div.classList.add("memory");

      if (mem.imageUrl) {
        const img = document.createElement("img");
        img.src = mem.imageUrl;
        div.appendChild(img);
      }

      const nameEl = document.createElement("h3");
      nameEl.textContent = mem.name;

      const msgEl = document.createElement("p");
      msgEl.textContent = mem.message;

      div.appendChild(nameEl);
      div.appendChild(msgEl);

      memoriesDiv.appendChild(div);
    });
  }
});

// 🌠 Animasi bintang nostalgia
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();