<template>
  <div class="container">
    <!-- Game Timer -->
    <!-- <div class="game-timer">
      <span class="countdown">{{ gameTimerRemaining }}m</span>
    </div> -->

    <!-- Shotclock Timer -->
    <div class="timer">
      <span class="countdown">{{ shotClockTimerRemaining }}s</span>
    </div>

     <!-- Timer Controls -->
     <div class="controls">
      <button class="control-btn start" @click="handleShotClock">{{ shotClockLabel }}</button>
      <button class="control-btn reset" @click="resetShotClock">Reset</button>
    </div>

    <!-- Score Buttons -->
    <div class="score-buttons">
      <button class="score-btn" @click="scoreAndPause(1)">1 Point</button>
      <button class="score-btn" @click="scoreAndPause(2)">2 Points</button>
      <button class="score-btn" @click="scoreAndPause(3)">3 Points</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive references
const activeTimer = ref(false);
const shotClockTimerRemaining = ref(14); // seconds
const interval = ref(null); // use a single instance of interval
const shotClockLabel = ref('Start');

// Handle the shotclock on first button press
const handleShotClock = () => {
  if (!activeTimer.value && shotClockTimerRemaining.value === 14) {
    startTimer();
    shotClockLabel.value = 'Pause';
  } else if (activeTimer.value) {
    activeTimer.value = false;
    shotClockLabel.value = 'Resume';
    clearInterval(interval.value); // Clear the interval when pausing
  } else {
    startTimer();
    shotClockLabel.value = 'Pause';
  }
};

const pauseTimer = () => {
  activeTimer.value = false;
  shotClockLabel.value = 'Resume';
  clearInterval(interval.value);
};

const resetShotClock = () => {
  pauseTimer();
  shotClockTimerRemaining.value = 14;
  shotClockLabel.value = 'Start';
};

const scoreAndPause = async (payload) => {
  pauseTimer();
  await sendRequest(`api/dummy${payload}`);
};

// Start the countdown timer
const startTimer = () => {
  if (interval.value) {
    clearInterval(interval.value); // Clear any existing interval
  }
  
  activeTimer.value = true;
  const countdown = () => {
    if (shotClockTimerRemaining.value > 0 && activeTimer.value) {
      shotClockTimerRemaining.value--;
    } else if (shotClockTimerRemaining.value <= 0) {
      clearInterval(interval.value);
      sendRequest('api/dummyend');
      resetTimer();
    }
  };
  
  interval.value = setInterval(countdown, 1000);
};

// Reset the timer
const resetTimer = () => {
  activeTimer.value = false;
  shotClockTimerRemaining.value = 14;
  shotClockLabel.value = 'Start';
};

// Function to send API requests using fetch
const sendRequest = async (apiCommand) => {
  try {
    // replace with your actual server URL
    const url = `http://${IP}/json/${apiCommand}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
      // TODO: add body later
    });

    // check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // we are working with WLED json API
    console.log(data);
    // handle response or update state as needed
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>

<style scoped>
:root {
  --btn-start-color: #e76f51;
  --btn-point1-color: #f4a261;
  --btn-point2-color: #775253;
  --btn-point3-color: #2a9d8f;
  --btn-hover-glow: rgba(255, 255, 255, 0.3);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

/* Shotclock Timer */
.timer {
  margin-bottom: 2rem;
  background-color: #2F3E50;
  border-radius: 10px;
  padding: 1rem 2rem;
}

.countdown {
  font-size: 3rem;
  color: #FFFFFF;
}

/* Timer Controls */
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.start {
  background-color: #E63946;
  color: #FFFFFF;
}

.control-btn.reset {
  background-color: #F1FAEE;
  color: #1D3557;
}

.control-btn:hover {
  transform: scale(1.05);
}

/* Score Buttons */
.score-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.score-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #FFFFFF;
}

.score-btn:nth-child(1) {
  background-color: #FF9B54;
}

.score-btn:nth-child(2) {
  background-color: #8E5572;
}

.score-btn:nth-child(3) {
  background-color: #3A9D8F;
}

.score-btn:hover {
  transform: translateY(-5px);
}

@media (max-width: 480px) {
  .score-buttons {
    flex-direction: column;
  }
}
</style>
