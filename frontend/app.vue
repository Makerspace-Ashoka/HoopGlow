<template>
  <div class="container">
    <div class="button-container">
      <button class="btn glow-on-hover start-button" @click="handleShotClock">{{ shotClockLabel }}</button>
      <div class="points-container">
        <button class="btn glow-on-hover" @click="sendRequest('api/dummy1')">1 Point</button>
        <button class="btn glow-on-hover" @click="sendRequest('api/dummy2')">2 Points</button>
        <button class="btn glow-on-hover" @click="sendRequest('api/dummy3')">3 Points</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive references
const activeTimer = ref(false);
const timeRemaining = ref(14); // seconds
const shotClockLabel = ref('Start');

// Handle the shotclock on first button press
const handleShotClock = () => {
  if (activeTimer.value) {
    resetTimer();
  } else {
    startTimer();
    shotClockLabel.value = 'Reset';
  }
};

// Start the countdown timer
const startTimer = () => {
  activeTimer.value = true;
  const countdown = () => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(interval);
      sendRequest('api/dummyend');
      resetTimer();
    }
  };
  const interval = setInterval(countdown, 1000);
};

// Reset the timer
const resetTimer = () => {
  activeTimer.value = false;
  timeRemaining.value = 14;
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
  --btn-start-color: #8842d5;
  --btn-point1-color: #5aa1d6;
  --btn-point2-color: #5ad6a4;
  --btn-point3-color: #d6b55a;
  --btn-hover-glow: rgba(255, 255, 255, 0.3);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button-container {
  width: 80%;
  max-width: 800px;
}

.btn {
  padding: 1rem 2rem;
  margin: 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  color: #fff;
}

.btn.glow-on-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
}

.start-button {
  background-color: #8842d5;
  width: 100%;
}

.points-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.points-container .btn:nth-of-type(1) {
  background-color: #5aa1d6;
}

.points-container .btn:nth-of-type(2) {
  background-color: #5ad6a4;
}

.points-container .btn:nth-of-type(3) {
  background-color: #d6b55a;
}

@media (max-width: 600px) {
  .points-container {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
