particlesJS('particles-js', {
    particles: {
        number: { value: 80 }, // 粒子数量
        color: { value: "#ffffff" }, // 粒子颜色
        shape: { type: "circle" }, // 粒子形状
        opacity: { value: 0.5 }, // 粒子透明度
        size: { value: 3 }, // 粒子大小
        line_linked: {
            enable: true, // 是否启用连线
            distance: 150, // 连线距离
            color: "#ffffff", // 连线颜色
            opacity: 0.4, // 连线透明度
            width: 1 // 连线宽度
        },
        move: {
            enable: true, // 是否启用运动
            speed: 6, // 运动速度
            direction: "none", // 运动方向
            out_mode: "out" // 粒子超出画布时的行为
        }
    },
    interactivity: {
        detect_on: "canvas", // 交互检测区域
        events: {
            onhover: { enable: true, mode: "repulse" }, // 悬停效果
            onclick: { enable: true, mode: "push" } // 点击效果
        }
    }
});
document.addEventListener('click', function (event) {
    const clickEffect = document.createElement('div');
    clickEffect.className = 'click-effect';
    clickEffect.style.left = `${event.pageX}px`; // 使用 pageX
    clickEffect.style.top = `${event.pageY}px`; // 使用 pageY
    document.body.appendChild(clickEffect);

    // 动画结束后移除元素
    clickEffect.addEventListener('animationend', () => {
        clickEffect.remove();
    });
});

        // 音乐播放器拖拽功能
    const player = document.getElementById('music-player');
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    player.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
    isDragging = true;
        }

    function drag(e) {
            if (isDragging) {
        e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    player.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

    function dragEnd() {
        isDragging = false;
        }

    // 音乐控制功能
    const audio = document.getElementById('bg-music');
    const playlist = document.getElementById('playlist').children;
    let currentTrack = 0;

    function togglePlay() {
        audio.paused ? audio.play() : audio.pause();
        }

    function changeTrack() {
        currentTrack = (currentTrack + 1) % playlist.length;
    audio.src = playlist[currentTrack].src;
    audio.play();
        }


// 获取设置相关元素
const bgColorInput = document.getElementById('bg-color');
const fontStyleSelect = document.getElementById('font-style');

// 背景颜色设置
bgColorInput.addEventListener('input', (e) => {
    document.body.style.backgroundColor = e.target.value;
});

// 字体风格设置
fontStyleSelect.addEventListener('change', (e) => {
    document.body.style.fontFamily = e.target.value;
});