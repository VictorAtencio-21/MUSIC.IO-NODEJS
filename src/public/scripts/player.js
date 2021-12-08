import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

// variable la cual contiene ambos iconos
const playIconContainer = document.getElementById('play-icon');
// variable que contiene el estado del boton (play or pause)
let state = 'play';

// carga la animacion del boton play icon al boton de pausa, usando lottie
const animation = lottieWeb.loadAnimation({
  container: playIconContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Demo Animation",
});

animation.goToAndStop(14, true);

// agrega un event listeneral boton cuando se le hace click
playIconContainer.addEventListener('click', () => {
  if(state === 'play') {
    animation.playSegments([14, 27], true);
    state = 'pause';
  } else {
    animation.playSegments([0, 14], true);
    state = 'play';
  }
});

const audio = document.querySelector('audio');

audio.addEventListener('loadedmetadata', () => {
  displayAudioDuration(audio.duration);
});

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }

  const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
  }
  
  if (audio.readyState > 0) {
    displayDuration();
  } else {
    audio.addEventListener('loadedmetadata', () => {
      displayDuration();
    });
  }

  const seekSlider = document.getElementById('seek-slider');

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
}

if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
} else {
  audio.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
  });
}

const audio = document.querySelector('audio');
const bufferedAmount = audio.buffered.end(audio.buffered.length - 1);

const currentTimeContainer = document.getElementById('current-time');

seekSlider.addEventListener('input', () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

playIconContainer.addEventListener('click', () => {
    if(playState === 'play') {
      audio.play();
      playAnimation.playSegments([14, 27], true);
      playState = 'pause';
    } else {
      audio.pause();
      playAnimation.playSegments([0, 14], true);
      playState = 'play';
    }
  });

  seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
  });

  audio.addEventListener('timeupdate', () => {
    seekSlider.value = Math.floor(audio.currentTime);
  });

let rAF = null;

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  rAF = requestAnimationFrame(whilePlaying);
}

playIconContainer.addEventListener('click', () => {
  if(playState === 'play') {
    audio.play();
    playAnimation.playSegments([14, 27], true);
    requestAnimationFrame(whilePlaying);
    playState = 'pause';
  } else {
    audio.pause();
    playAnimation.playSegments([0, 14], true);
    cancelAnimationFrame(rAF);
    playState = 'play';
  }
});

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
      cancelAnimationFrame(raf);
    }
  });
  
  seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
    }
  });

  const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);
  }

const volumeSlider = document.getElementById('volume-slider');
const outputContainer = document.getElementById('volume-output');

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;

  outputContainer.textContent = value;
  audio.volume = value / 100;
});