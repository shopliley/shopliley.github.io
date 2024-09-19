// Background music control
const bgMusic = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const volumePopup = document.getElementById('volume-popup');

// Start music at 30% volume
bgMusic.volume = 0.3;

// Show volume slider when clicking on the volume icon
volumeIcon.addEventListener('click', () => {
    volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'inline-block' : 'none';
    volumePopup.style.display = 'inline-block';
    setTimeout(() => {
        volumePopup.style.display = 'none';
    }, 5000);
});

// Volume slider control
volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value;
    volumeIcon.textContent = bgMusic.volume == 0 ? '🔇' : '🔊';
});

// Episode Switching
const episodes = [
    {
        title: "Shared Adventure",
        description: "A journey from online gaming to real life.",
        backgroundImage: "images/start.png",
        link: "episode1.html"
    },
    {
        title: "Two-Faced",
        description: "A story of love, business, and societal pressures.",
        backgroundImage: "images/two-faced.png",
        link: "episode2.html"
    },
    {
        title: "Rekindling",
        description: "Reconnecting after a long separation. A story of hope.",
        backgroundImage: "images/rekindling.png",
        link: "episode3.html"
    },
    {
        title: "Fake Letter",
        description: "Sending a letter to leave, sending a letter to restart.",
        backgroundImage: "images/fake-letter.png",
        link: "episode4.html"
    },
    {
        title: "The Taxi - BTS",
        description: "The shocking reveal.",
        backgroundImage: "images/BTS.png",
        link: "episode5.html"
    },
    {
        title: "Fake Promises",
        description: "When there is true love, there can be no breaking up.",
        backgroundImage: "images/fake-promises.png",
        link: "episode6.html"
    },
    {
        title: "The First Meetup",
        description: "A trip to heal all wounds and make lasting memories.",
        backgroundImage: "images/meetup.png",
        link: "episode7.html"
    },
    {
        title: "Anguish",
        description: "Snooping for truth but fell for the tears.",
        backgroundImage: "images/snooping1.png",
        link: "episode8.html"
    },
    {
        title: "Pleading",
        description: "I can’t hate you for breaking my heart.",
        backgroundImage: "images/pleading.png",
        link: "episode9.html"
    }
];

let currentEpisode = 0;

function changeMainEpisode() {
    const { title, description, backgroundImage, link } = episodes[currentEpisode];
    const mainEpisode = document.getElementById('main-episode');
    const episodeTitle = document.getElementById('episode-title');
    const episodeDescription = document.getElementById('episode-description');
    const readNowBtn = document.getElementById('read-now-btn');

    mainEpisode.style.backgroundImage = `url(${backgroundImage})`;
    episodeTitle.textContent = title;
    episodeDescription.textContent = description;
    readNowBtn.onclick = () => window.location.href = link;

    currentEpisode = (currentEpisode + 1) % episodes.length;
}

setInterval(changeMainEpisode, 8000);
changeMainEpisode();

// Carousel Arrows
const carousel = document.getElementById('episodeCarousel');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click', () => {
    carousel.scrollLeft -= 300;  // Scroll left
});

rightArrow.addEventListener('click', () => {
    carousel.scrollLeft += 300;  // Scroll right
});

// Smooth scrolling for carousel
carousel.addEventListener('wheel', (e) => {
    carousel.scrollLeft += e.deltaY > 0 ? 300 : -300;  // Scroll with mouse wheel
});
// Popup Modal Script
document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById('abstract-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const continueBtn = document.getElementById('continue-btn');
    const abstractMessage = document.getElementById('abstract-message');

    // Show the popup on page load
    popup.style.display = 'flex';

    // Fetch the abstract content from abstract.html
    fetch('abstract.html')
        .then(response => response.text())
        .then(data => {
            abstractMessage.innerHTML = data;  // Insert abstract content into the popup
        })
        .catch(error => {
            abstractMessage.innerHTML = "<p>Sorry, the abstract content could not be loaded.</p>";
            console.error('Error loading abstract:', error);
        });

    // Close popup when 'X' is clicked
    closePopupBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Close popup when 'Continue' button is clicked
    continueBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
});
