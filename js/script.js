document.addEventListener('DOMContentLoaded', function() {
    // Music library
    const musicLibrary = [
        {
            title: "Sahiba",
            artist: "Aditya Rikhari",
            cover: "https://i.scdn.co/image/ab67616d00001e020a47bbe7141fdfe0eb2cdba7",
            file: "assets/music/sahiba.mp3"
        },
        {
            title: "Shree Hanuman Chalisa",
            artist: "Hariharan",
            cover: "https://i.scdn.co/image/ab67616d00001e026d9a2050e82ce05424dca5aa",
            file: "assets/music/hanuman_chalisa.mp3"
        }
        // Add more tracks as needed
    ];

    // Audio element
    const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let audioEnabled = false;

    // DOM elements
    const mediaCards = document.querySelectorAll('.media-card');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeDisplay = document.querySelector('.current-time');
    const durationDisplay = document.querySelector('.duration');
    const volumeControl = document.querySelector('.volume-control');
    const nowPlayingCover = document.querySelector('.track-cover');
    const nowPlayingTitle = document.querySelector('.track-title');
    const nowPlayingArtist = document.querySelector('.track-artist');

    // Initialize
    function init() {
        setupMediaCards();
        setupEventListeners();
        
        // Enable audio after first user interaction
        document.body.addEventListener('click', () => {
            audioEnabled = true;
        }, { once: true });
    }

    // Set up media cards with hover play buttons
    function setupMediaCards() {
        mediaCards.forEach((card, index) => {
            // Add hover play button
            const playBtn = document.createElement('button');
            playBtn.className = 'hover-play-btn';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            card.appendChild(playBtn);

            // Click handler for play button
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playTrack(index);
            });

            // Click handler for entire card
            card.addEventListener('click', () => {
                playTrack(index);
            });
        });
    }

    // Play a specific track
    function playTrack(index) {
        if (!audioEnabled) {
            alert('Please click anywhere on the page first to enable audio');
            return;
        }

        if (index < 0 || index >= musicLibrary.length) return;

        currentTrackIndex = index;
        const track = musicLibrary[index];
        
        audio.src = track.file;
        audio.play()
            .then(() => {
                isPlaying = true;
                updateNowPlaying(track);
                updatePlayPauseButton();
                highlightCurrentCard();
            })
            .catch(error => {
                console.error("Playback failed:", error);
            });
    }

    // Update now playing info
    function updateNowPlaying(track) {
        nowPlayingCover.src = track.cover;
        nowPlayingTitle.textContent = track.title;
        nowPlayingArtist.textContent = track.artist;
    }

    // Highlight current playing card
    function highlightCurrentCard() {
        mediaCards.forEach((card, index) => {
            card.classList.toggle('current-playing', index === currentTrackIndex);
        });
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (!audio.src) {
            playTrack(0);
            return;
        }

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.error("Playback error:", error);
            });
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    // Update play/pause button icon
    function updatePlayPauseButton() {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
    }

    // Play next track
    function playNextTrack() {
        const nextIndex = (currentTrackIndex + 1) % musicLibrary.length;
        playTrack(nextIndex);
    }

    // Play previous track
    function playPreviousTrack() {
        const prevIndex = (currentTrackIndex - 1 + musicLibrary.length) % musicLibrary.length;
        playTrack(prevIndex);
    }

    // Update progress bar
    function updateProgressBar() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Player controls
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        if (prevBtn) prevBtn.addEventListener('click', playPreviousTrack);
        if (nextBtn) nextBtn.addEventListener('click', playNextTrack);

        // Progress bar
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const percent = e.offsetX / progressBar.offsetWidth;
                audio.currentTime = percent * audio.duration;
            });
        }

        // Volume control
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                audio.volume = e.target.value;
            });
            audio.volume = volumeControl.value;
        }

        // Audio events
        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audio.duration);
        });
        audio.addEventListener('ended', playNextTrack);
    }

    // Initialize the player
    init();
});