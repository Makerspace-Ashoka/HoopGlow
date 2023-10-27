<template>
  <div class="container">
    <div class="section status-monitor">
      <span class="section-title" id="status-monitor">Status Monitor</span>
      <div class="monitor-card">
        <div class="monitor-text">{{ timer }}</div>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Points</span>
      <div class="section-body">
        <button class="btn" style="background-color: #5D2A42;  color: #fbf5f3;" @click="callWLED('1Point')">1 Point</button>
        <button class="btn" style="background-color: #3a9d8f;  color: #fbf5f3;" @click="callWLED('2Point')">2 Points</button>
        <button class="btn" style="background-color: #D9F9A5;" @click="callWLED('3Point')">3 Points</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Powerplay</span>
      <div class="section-body">
        <label class="switch">
          <input type="checkbox" v-model="isInputChecked">
          <span class="slider"></span>
        </label>
        <button class="btn start-powerplay" @click="handlePowerplay">{{ powerplayBtnLabel }}</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Gameplay</span>
      <div class="section-body">
        <button class="btn" style="background-color: #E76F51; color: #fbf5f3;" @click="handleBuzzer">Buzzer</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Celebrations</span>
      <div class="section-body">
        <button class="btn" style="background-color: #FFD639;" @click="callWLED('1Effect')">Effect 1</button>
        <button class="btn" style="background-color: #FFD639;" @click="callWLED('2Effect')">Effect 2</button>
        <button class="btn" style="background-color: #FFD639;" @click="callWLED('3Effect')">Effect 3</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// bound to frontend
const powerplayBtnLabel = ref('Start');
const isInputChecked = ref(false); // temp tied to powerplay slide switch

const powerplayType = computed(() => isInputChecked.value ? 2: 1);
const powerplayInterval = ref(null); // use a single instance of interval
const isPowerplayRunning = ref(false);
const timer = ref(60);

const callWLED = async (buttonType) => {
  let payload = {};
  switch(buttonType) {
    case '1Point':
      // We will never come here in powerplay
      // 1point playlist
      payload = { "pl":  101};
      break;
    case '2Point':
      if(isPowerplayRunning.value && powerplayType === 2) {
        // powerplay 2, 2point playlist
        payload = { "pl":  122};
      } else if(isPowerplayRunning.value && powerplayType === 1) {
        // powerplay 1, 2point playlist
        payload = { "pl":  112};
      } else {
        // 2point playlist
        payload = { "pl":  102};
      }
      break;
    case '3Point':
      if(isPowerplayRunning.value && powerplayType === 2) {
        // powerplay 2, 3point playlist
        payload = { "pl":  123};
      } else if(isPowerplayRunning.value && powerplayType === 1) {
        // powerplay 1, 3point playlist
        payload = { "pl":  113};
      } else {
        // 3point playlist
        payload = { "pl":  103};
      }
      break;
    case '1Effect':
      payload = { "pl":  201};
      break;
    case '2Effect':
      payload = { "pl":  202};
      break;
    case '3Effect':
      payload = { "pl":  203};
      break;
  }
  // send API call with the payload
  await sendPOSTRequest("state", JSON.stringify(payload));
};

const handlePowerplay = async () => {
  if(!isPowerplayRunning.value) { // only attempt if powerplay timer has stopped
    let payload = {};

    // set up payload with preset id mapped to powerplay type
    if(powerplayType.value === 2) {
      payload = { "ps": 172 };
    } else { // type = 1
      payload = { "ps": 171 };
    }
    // call wled with preset to set colour
    await sendPOSTRequest("state", JSON.stringify(payload));

    // start 60s countdown
    isPowerplayRunning.value = true;
    const countdown = () => {
      if (timer.value > 0 && isPowerplayRunning.value) {
        timer.value--;
      } // stopping interval is handled in watch()
    };
    
    powerplayInterval.value = setInterval(countdown, 1000);

    // UI changes
    powerplayBtnLabel.value = "..."
  }
};

const resetPowerplayTimer = () => {
  clearInterval(powerplayInterval.value); // highly unlikely but clear any running intervals
  isPowerplayRunning.value = false;
  timer.value = 60;

  // UI changes
  powerplayBtnLabel.value = "Start";
}

const handleBuzzer = async () => {
  // buzzer playlist on WLED
  payload = { "pl":  200};
}

// Function to send API requests using fetch
const sendPOSTRequest = async (apiCommand, payload) => {
  // TODO: delete before prod
  console.info(payload);
  const IP = "192.168.20.139";
  try {
    // replace with your actual server URL
    const url = `http://${IP}/json/${apiCommand}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });

    // check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // TODO: delete these lines before prod
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

watch(timer, (newVal) => {
  if (newVal === 0) {
    resetPowerplayTimer();
  }
});

</script>

<style scoped>
.container {
  background: rgba(255,255,255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* Optional: Adds depth */
    backdrop-filter: blur(10px);  /* Key to the glass effect */
    border: 1px solid rgba(255, 255, 255, 0.2);  /* Slight border to define the container */
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  margin: 10vh 8vw;
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;
}

.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px dashed lightgrey;
  padding-bottom: 20px;
}

.section-title {
  font-weight: 700;
  flex: 1;
  font-size: 24px;
  padding-left: 10%;
}

#status-monitor {
  display: none;
}

.monitor-card {
  width: 50%;
  height: 100px;
  margin: 0 auto;
  background-color: #2f3e50;
  border-radius: 10px;
  padding: 1rem 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-text {
  font-size: 3rem;
  color: #fbf5f3;
}

.section-body {
  padding-right: 10%
}

.btn {
  margin: 5px;
  padding: 1rem 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  border-radius: 10px;
  font-size: 1.1rem;
}

.btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-5px);
}

.start-powerplay {
  background-color: #D1F5BE;
  margin-left: 2rem;
}

.switch {
    position: relative;
    display: inline-block;
    width: 90px;
    height: 34px;
}

.switch input { 
    display:none;
}

.slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: purple;
    border-radius: 34px;
    transition: .4s;
}

.slider:before{
    position: absolute;
    height: 26px;
    width: 26px;
    line-height: 26px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
    content: "";
}

.slider:before {
    display: flex;  /* Use flexbox to center the content */
    align-items: center;  /* Vertical alignment */
    justify-content: center; 
    content: "1";
    left: 4px;
    bottom: 4px;
}

.slider:after {
    content: "2";
    right: 4px;
    bottom: 4px;
    opacity: 0; /* Hide it initially */
}

input:checked + .slider {
    background-color: #2196F3;
}

input:checked + .slider:before {
    left: 60px;
    content: "2";
}

input:checked + .slider:after {
    opacity: 0; /* Show it when checked */
}

/* Adjustments for responsiveness can be added below */
@media (max-width: 768px) {
  .btn {
    margin: 3px;
    padding: 8px 16px;
  }
}

/* For tablet devices */
@media (max-width: 768px) {
  .container {
      max-width: 95%;
  }
}

/* For mobile devices */
@media (max-width: 480px) {
  .container {
      max-width: 100%;
  }
}
</style>
