const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const message = document.getElementById('message');
const mainScreen = document.querySelector('.main-screen');
const successScreen = document.querySelector('.success-screen');
const startDate = document.getElementById('startDate');
const backgroundMusic = document.getElementById('backgroundMusic');
const successMusic = document.getElementById('successMusic');
const toggleButton = document.getElementById('toggleMusic');

const noButtonTexts = [
  'Thật sự không? 🥺',
  'Nghĩ lại đi mà 😢',
  'Đừng bấm nữa, đau lòng lắm 💔',
  'Thôi mà, Yes đi 🥹',
  'Làm người yêu tớ đi 😍',
  'Nhớ nghĩ kỹ đấy 🤔',
  'Bấm Yes là đẹp đôi 👀',
  'Vẫn còn cố chấp sao? 😅',
  'Thử nghĩ về tương lai đi 🌟',
  'Ok vậy tớ chọn Yes cho 😘'
];

let noCount = 0;
let yesScale = 1;
let isMusicPlaying = true;
let isSuccessScreen = false;

const handleMusicTransition = async (from, to) => {
  if (!isMusicPlaying) return;

  const fadeOutInterval = setInterval(() => {
    if (from.volume > 0.1) {
      from.volume -= 0.1;
    } else {
      clearInterval(fadeOutInterval);
      from.pause();
      from.volume = 1.0;
      playNewMusic(to);
    }
  }, 100);
};

const playNewMusic = async (music) => {
  music.volume = 0;
  try {
    await music.play();
    const fadeInInterval = setInterval(() => {
      if (music.volume < 0.9) {
        music.volume += 0.1;
      } else {
        clearInterval(fadeInInterval);
        music.volume = 1.0;
      }
    }, 100);
  } catch (error) {
    console.log('Music play error:', error);
  }
};

const initializeAudio = async () => {
  isMusicPlaying = false;
  toggleButton.textContent = '🎵';
};

window.addEventListener('DOMContentLoaded', initializeAudio);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (isMusicPlaying) {
      isSuccessScreen ? successMusic.pause() : backgroundMusic.pause();
    }
  } else {
    if (isMusicPlaying) {
      isSuccessScreen ? successMusic.play() : backgroundMusic.play();
    }
  }
});

toggleButton.addEventListener('click', async () => {
  if (isMusicPlaying) {
    if (isSuccessScreen) {
      successMusic.pause();
    } else {
      backgroundMusic.pause();
    }
    toggleButton.textContent = '🎵';
  } else {
    if (isSuccessScreen) {
      await successMusic.play();
    } else {
      await backgroundMusic.play();
    }
    toggleButton.textContent = '⏸️';
  }
  isMusicPlaying = !isMusicPlaying;
});

const animateNoButton = () => {
  noButton.classList.add('shake');
  setTimeout(() => noButton.classList.remove('shake'), 500);

  const heart = document.createElement('div');
  heart.innerHTML = '💔';
  heart.style.position = 'absolute';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.top = `${Math.random() * 100}%`;
  heart.style.animation = 'float 3s ease-out forwards';
  mainScreen.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
};

noButton.addEventListener('click', () => {
  noCount++;
  yesScale = Math.min(yesScale + 0.15, 2);
  yesButton.style.transform = `scale(${yesScale})`;

  if (noCount < noButtonTexts.length) {
    noButton.textContent = noButtonTexts[noCount];
  } else {
    noButton.disabled = true;
    noButton.textContent = 'Hết cách rồi, bấm Yes thôi! 😝';
    noButton.classList.add('opacity-50', 'cursor-not-allowed');
  }

  animateNoButton();

  message.textContent = noCount < noButtonTexts.length
    ? "Bạn vẫn còn cơ hội đổi ý đấy... 😉"
    : "Hết cách rồi, giờ chỉ có thể bấm Yes thôi! 😘";
  message.classList.remove('hidden');
  message.style.marginTop = `${yesScale * 2}rem`;
});

yesButton.addEventListener('click', () => {
  isSuccessScreen = true;
  mainScreen.style.display = 'none';
  successScreen.style.display = 'flex';
  startDate.textContent = `Ngày bắt đầu: ${new Date().toLocaleDateString()}`;

  if (isMusicPlaying) {
    handleMusicTransition(backgroundMusic, successMusic);
  }

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = '0';
      heart.style.animation = `float ${2 + Math.random() * 3}s ease-out forwards`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }, i * 300);
  }
});
