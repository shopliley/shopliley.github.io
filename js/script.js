// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCU7pM7E7zAsA7xnA84Y6Afh2l2D7qq_1w",
    authDomain: "giveawayapp-c4e99.firebaseapp.com",
    projectId: "giveawayapp-c4e99",
    storageBucket: "giveawayapp-c4e99.appspot.com",
    messagingSenderId: "248617781428",
    appId: "1:248617781428:web:e4f0fe75411a323b2a6fe1",
    measurementId: "G-75GVT99SZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 🎵 Background Music Control
const bgMusic = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

if (bgMusic) {
    bgMusic.volume = 0.3;
    volumeIcon?.addEventListener('click', () => {
        volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'inline-block' : 'none';
    });

    volumeSlider?.addEventListener('input', () => {
        bgMusic.volume = volumeSlider.value;
        volumeIcon.textContent = bgMusic.volume == 0 ? '🔇' : '🔊';
    });
}

// 📺 Episode Switching
const episodes = [
    { title: "Please read the Memories", description: "I hate you 1% but I love you 99", backgroundImage: "images/start.png", link: "memories.html" },
    { title: "The First Meetup", description: "A trip to heal all wounds and make lasting memories.", backgroundImage: "images/meetup.png", link: "episode7.html" },
    { title: "Pleading", description: "I can’t hate you for breaking my heart.", backgroundImage: "images/pleading.png", link: "episode9.html" }
];

let currentEpisode = 0;
function changeMainEpisode() {
    const { title, description, backgroundImage, link } = episodes[currentEpisode];
    document.getElementById('main-episode').style.backgroundImage = `url(${backgroundImage})`;
    document.getElementById('episode-title').textContent = title;
    document.getElementById('episode-description').textContent = description;
    document.getElementById('read-now-btn').onclick = () => window.location.href = link;
    currentEpisode = (currentEpisode + 1) % episodes.length;
}

setInterval(changeMainEpisode, 8000);
changeMainEpisode();

// 🎁 GIVEAWAY FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
    const giveawayPopup = document.getElementById("giveaway-popup");
    const closeGiveawayBtn = document.getElementById("close-giveaway-popup");
    const enterGiveawayBtn = document.getElementById("enter-giveaway-btn");
    const giveawayForm = document.getElementById("giveaway-form");
    const participantsList = document.getElementById("entries-list");

    // Show Giveaway Popup if exists
    if (giveawayPopup) giveawayPopup.style.display = "flex";

    // Close Giveaway Popup
    closeGiveawayBtn?.addEventListener("click", function () {
        giveawayPopup.style.display = "none";
    });

    // Redirect to Giveaway Page
    enterGiveawayBtn.addEventListener("click", function () {
        console.log("Navigating to giveaway.html");
        window.location.href = "giveaway.html";
    });

    // ✅ GIVEAWAY FORM SUBMISSION
    if (giveawayForm) {
        giveawayForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("insta-username").value.trim();
            const screenshot = document.getElementById("screenshot").files[0]; // File upload
            const answer = document.getElementById("answer").value.trim();

            if (!username || !screenshot || !answer) {
                alert("⚠️ All fields are required!");
                return;
            }

            try {
                // Upload screenshot to Firebase Storage
                const storageRef = ref(storage, `giveaway_screenshots/${Date.now()}-${screenshot.name}`);
                const snapshot = await uploadBytes(storageRef, screenshot);
                const screenshotURL = await getDownloadURL(snapshot.ref);

                // Save Entry to Firestore
                await addDoc(collection(db, "giveaway_entries"), {
                    username,
                    screenshot: screenshotURL,
                    answer
                });

                alert("🎉 Entry submitted successfully!");
                giveawayForm.reset(); // Reset the form after successful submission
                loadEntries(); // Refresh list
            } catch (error) {
                console.error("Error saving entry: ", error);
                alert("❌ Failed to submit entry.");
            }
        });

        // ✅ LOAD GIVEAWAY PARTICIPANTS
        async function loadEntries() {
            if (!participantsList) return;
            participantsList.innerHTML = "";

            const querySnapshot = await getDocs(collection(db, "giveaway_entries"));
            querySnapshot.forEach((doc) => {
                const entry = doc.data();
                const listItem = document.createElement("li");
                listItem.innerHTML = `<b>${entry.username}</b> - ${entry.answer} <br> 
                                      <img src="${entry.screenshot}" width="100" style="border-radius: 10px; margin-top: 10px;">`;
                participantsList.appendChild(listItem);
            });
        }

        // Load participants on page load
        loadEntries();
    }
});
