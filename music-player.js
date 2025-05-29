// music-player.js
class MusicPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 30px;
          right: 30px;
          width: 280px;
          background: rgba(40, 40, 40, 0.95);
          border: 1px solid rgba(255, 106, 0, 0.3);
          border-radius: 15px;
          padding: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          cursor: move;
          z-index: 1000;
        }
        .music-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }
        .music-btn {
          padding: 6px 12px;
          background: rgba(75, 15, 56, 0.4);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .music-btn:hover {
          background: rgb(255, 0, 220);
        }
        audio {
          display: none;
        }
      </style>
      <div id="music-player">
        <h3>音乐播放器 ♫</h3>
        <audio id="bg-music" loop></audio>
        <div class="music-controls">
          <button class="music-btn" id="toggle-btn">播放/暂停</button>
          <button class="music-btn" id="change-btn">切换音乐</button>
        </div>
      </div>
    `;

        this.audio = this.shadowRoot.getElementById('bg-music');
        this.currentTrack = 0;
        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
    }

    connectedCallback() {
        this.setupPlaylist();
        this.setupControls();
        this.setupDrag();
    }

    setupPlaylist() {
        this.playlist = [
            'musics/1.mp3',
            'musics/2.mp3',
            'musics/3.mp3',
            'musics/4.mp3'
        ];
        this.audio.src = this.playlist[this.currentTrack];
    }

    setupControls() {
        this.shadowRoot.getElementById('toggle-btn').addEventListener('click', this.togglePlay);
        this.shadowRoot.getElementById('change-btn').addEventListener('click', this.changeTrack);
    }

    setupDrag() {
        this.addEventListener('mousedown', this.dragStart);
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.dragEnd);
    }

    togglePlay = () => {
        this.audio.paused ? this.audio.play() : this.audio.pause();
    }

    changeTrack = () => {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.audio.src = this.playlist[this.currentTrack];
        this.audio.play();
    }

    // 拖拽相关方法
    dragStart = (e) => {
        this.initialX = e.clientX - this.currentX;
        this.initialY = e.clientY - this.currentY;
        this.isDragging = true;
    }

    drag = (e) => {
        if (this.isDragging) {
            e.preventDefault();
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
            this.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
        }
    }

    dragEnd = () => {
        this.isDragging = false;
    }
}

customElements.define('music-player', MusicPlayer);