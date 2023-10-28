<template>
  <div class="container-wrapper">
  <div class="container">
    <div class="section status-monitor">
      <span class="section-title" id="status-monitor">Status Monitor</span>
      <div class="monitor-card">
        <div class="monitor-text">{{ powerplayTimer }}</div>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Points</span>
      <div class="section-body">
        <button class="btn btn-1point" @click="callWLED('1Point')"  :disabled="isPowerplayRunning">1 Point</button>
        <button class="btn btn-2point" @click="callWLED('2Point')">2 Points</button>
        <button class="btn btn-3point" @click="callWLED('3Point')">3 Points</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Powerplay</span>
      <div class="section-body">
        <label class="switch">
          <input type="checkbox" v-model="isPowerplayInputChecked" :disabled="isPowerplayRunning">
          <span class="slider"></span>
        </label>
        <button class="btn btn-start-powerplay" @click="handlePowerplay">{{ powerplayBtnLabel }}</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Gameplay</span>
      <div class="section-body">
        <button class="btn  btn-buzzer" @click="handleBuzzer">Buzzer</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Celebrations</span>
      <div class="section-body">
        <button class="btn  btn-effect" @click="callWLED('1Effect')" :disabled="isPowerplayRunning">Effect 1</button>
        <button class="btn  btn-effect" @click="callWLED('2Effect')" :disabled="isPowerplayRunning">Effect 2</button>
        <button class="btn  btn-effect" @click="callWLED('3Effect')" :disabled="isPowerplayRunning">Effect 3</button>
        <button class="btn  btn-effect" @click="callWLED('4Effect')" :disabled="isPowerplayRunning">Filler</button>
        <button class="btn  btn-effect" @click="callWLED('5Effect')" :disabled="isPowerplayRunning">Strobe</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Constants
const IP = "192.168.40.111";
const DEFAULT_POWERPLAY_TIMER = 60; // in seconds

// Frontend bindings
const powerplayBtnLabel = ref('Start');
const isPowerplayInputChecked = ref(false); // v-bind to powerplay slide switch

// Computed properties
// Note: computed properties don't need .value for accessing later
const powerplayType = computed(() => isPowerplayInputChecked.value ? 2: 1);

// Internal state management
const powerplayInterval = ref(null); // use a single instance of interval
const isPowerplayRunning = ref(false);
const powerplayTimer = ref(DEFAULT_POWERPLAY_TIMER);

// Utility Functions
const buildPayloadForButtonType = (buttonType) => {
  const basePlaylists = {
    '1Point': 101,
    '2Point': 102,
    '3Point': 103,
    '1Effect': 201,
    '2Effect': 202,
    '3Effect': 203,
    '4Effect': 204,
    '5Effect': 205,
    'buzzer': 200
  };

  // return general playlist id if not in powerplay
  if (!isPowerplayRunning.value) return { "pl": basePlaylists[buttonType] };

  // for powerplay playlist ids, add 20 if powerplay 2, 10 if powerplay 1
  const powerplayOffset = 10 * powerplayType.value;
  if (['2Point', '3Point'].includes(buttonType)) return { "pl": basePlaylists[buttonType] + powerplayOffset };

  // rest of the buttons
  return { "pl": basePlaylists[buttonType] };
};

const sendPOSTRequest = async (apiCommand, payload) => {
  console.info(payload); // TODO: delete before prod

  try {
    const url = `http://${IP}/json/${apiCommand}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(await response.json()); // TODO: delete before prod
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Event handlers
const callWLED = async (buttonType) => {
  const payload = buildPayloadForButtonType(buttonType);
  await sendPOSTRequest("state", JSON.stringify(payload));
};

const handlePowerplay = async () => {
  if(isPowerplayRunning.value) return;

  const payload = { "pl": powerplayType.value === 2 ? 172 : 171 };
  await sendPOSTRequest("state", JSON.stringify(payload));

  powerplayInterval.value = setInterval(() => {
    if (powerplayTimer.value > 0 && isPowerplayRunning.value) powerplayTimer.value--;
  }, 1000);

  isPowerplayRunning.value = true;
  powerplayBtnLabel.value = "...";
};

const resetPowerplayTimer = () => {
  clearInterval(powerplayInterval.value);
  isPowerplayRunning.value = false;
  powerplayTimer.value = DEFAULT_POWERPLAY_TIMER;
  powerplayBtnLabel.value = 'Start';
};

const handleBuzzer = async () => {
  const payload = { "pl":  200};
  await sendPOSTRequest("state", JSON.stringify(payload));
}

// Watchers
watch(powerplayTimer, (newVal) => {
  if (newVal === 0) resetPowerplayTimer();
});

</script>

<style scoped>
.container-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Take full viewport height */
}

.container {
  background: rgba(255,255,255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 90vh;
  max-width: 90%;
  margin: auto;
  overflow: auto;
  padding: 2rem;
}

.section {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 10px;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px dashed lightgrey;
  padding-bottom: 20px;
}

.section-title {
  font-weight: 700;
  flex: 1;
  font-size: 1.2rem;
  padding-left: 10%;
  color: var(--text-color-dark);
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

#status-monitor {
  display: none;
}

.monitor-card {
  width: 50%;
  height: 100px;
  margin: 0 auto;
  background-color: var(--monitor-card-bg);
  border-radius: 10px;
  padding: 1rem 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-text {
  font-size: 3rem;
  color: var(--text-color-light);
}

.section-body {
  padding-right: 10%;
  margin-left: auto;
}

.btn {
  height: 50px;
  margin: 5px 10px;
  padding: 1rem 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  border-radius: 10px;
  font-size: 1rem;
}

.btn:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.btn:disabled {
  background-color: var(--btn-disabled-bg);
  color: var(--text-color-light);
  cursor: not-allowed;
  transform: none;
}

.btn:active {
  transform: translateY(-10px);
}

.btn-1point {
    background-color: var(--btn-1point-bg);
    color: var(--text-color-light);
}

.btn-2point {
    background-color: var(--btn-2point-bg);
    color: var(--text-color-light);
}

.btn-3point {
    background-color: var(--btn-3point-bg);
    color: var(--text-color-dark); 
}

.btn-buzzer {
    background-color: var(--btn-buzzer-bg);
    color: var(--text-color-light);
}

.btn-effect {
    background-color: var(--btn-effect-bg);
    color: var(--text-color-dark);
}


.btn-start-powerplay {
  background-color: var(--btn-start-bg);
  color: var(--text-color-dark);
  margin-left: 2rem;
}

.switch {
    position: relative;
    display: inline-block;
    width: 90px;
    height: 34px;
    margin-right: 15vw;
}

.switch input { 
    display:none;
}

.switch input:disabled + .slider { 
  background-color: var(--btn-disabled-bg);
  cursor: not-allowed;
}

.switch input:disabled + .slider:before { 
  background-color: ccc;
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
    color: var(--text-color-dark);
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
  .container {
    max-width: 95%;
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
      padding: 1rem;
  }
}
</style>
