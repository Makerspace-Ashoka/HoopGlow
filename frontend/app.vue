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
      <span class="section-title">Buzzer</span>
      <div class="section-body">
        <label class="buzzer-switch">
          <input type="checkbox" v-model="isBuzzerEngaged" @change="handleBuzzer">
          <span class="buzzer-slider"></span>
        </label>
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
const isBuzzerEngaged = ref(false); // v-bind to buzzer slide switch

// Computed properties
// Note: computed properties don't need .value for accessing later
const powerplayType = computed(() => isPowerplayInputChecked.value ? 2: 1);

// Internal state management
const powerplayInterval = ref(null); // use a single instance of interval
const isPowerplayRunning = ref(false);
const powerplayTimer = ref(DEFAULT_POWERPLAY_TIMER);
const buzzerDisabled = ref(false); // only use it to disable before automatically changing buzzer state
const IS_GAME_NORMAL = ref(true); // only way to resume appropriately from buzzer disengage

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
    'buzzer': 200, // burst red + red + blackout in 3s
    'buzzerPowerplay': 199, // burst red + stay red
    'initPowerplay1': 171,
    'initPowerplay2': 172,
    'presetPP1': 71,
    'presetPP2': 72,
    'presetClear': 9
  };

  const payloads = {
    101:{"playlist":{"ps":[9,11,9],"dur":[2,20,2],"transition":[1,1,3],"repeat":1,"r":false,"end":9},"on":true},
    102:{"playlist":{"ps":[9,10,9],"dur":[2,20,2],"transition":[0,0,3],"repeat":1,"r":false,"end":9},"on":true},
    103:{"playlist":{"ps":[9,5,9],"dur":[2,20,20],"transition":[0,0,3],"repeat":1,"r":false,"end":9},"on":true},
    112:{"playlist":{"ps":[9,10,9],"dur":[2,20,2],"transition":[1,1,3],"repeat":1,"r":false,"end":71},"on":true},
    113:{"playlist":{"ps":[9,5,9],"dur":[2,20,2],"transition":[1,1,3],"repeat":1,"r":false,"end":71},"on":true},
    122:{"playlist":{"ps":[9,10,9],"dur":[2,20,2],"transition":[1,1,3],"repeat":1,"r":false,"end":72},"on":true},
    123:{"playlist":{"ps":[9,5,9],"dur":[2,20,2],"transition":[1,1,3],"repeat":1,"r":false,"end":72},"on":true},
    199:{"playlist":{"ps":[9,19],"dur":[2,10],"transition":[5,5],"repeat":1,"r":false,"end":20},"on":true},
    200:{"playlist":{"ps":[9,19,20],"dur":[2,10,20],"transition":[0,0,3],"repeat":1,"r":false,"end":9},"on":true}, 
    171:{"playlist":{"ps":[9,99],"dur":[2,5],"transition":[0,0],"repeat":1,"r":false,"end":71},"on":true},
    172:{"playlist":{"ps":[9,100],"dur":[2,5],"transition":[5,5],"repeat":1,"r":false,"end":72},"on":true},
    205:{"playlist":{"ps":[97],"dur":[20],"transition":[5],"repeat":1,"r":false,"end":96},"on":true},
    9: {"on":true,"bri":254,"transition":5,"mainseg":0,"seg":[{"id":0,"start":0,"stop":149,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[0,0,0],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"id":1,"start":149,"stop":297,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[0,0,0],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]},
    71: {"on":true,"bri":254,"transition":5,"mainseg":0,"seg":[{"id":0,"start":0,"stop":149,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[0,255,251],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"id":1,"start":149,"stop":297,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[0,255,251],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]},
    72:{"on":true,"bri":254,"transition":5,"mainseg":0,"seg":[{"id":0,"start":0,"stop":149,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[255,0,255],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"id":1,"start":149,"stop":297,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[255,0,255],[0,0,0],[0,0,0]],"fx":0,"sx":242,"ix":255,"pal":4,"sel":true,"rev":true,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]}
  }

  let payload_index = null;
  
  // return general playlist id if not in powerplay
  if (!isPowerplayRunning.value) {
    payload_index = basePlaylists[buttonType];
    return payloads[payload_index];
  }

  // for powerplay playlist ids, add 20 if powerplay 2, 10 if powerplay 1
  const powerplayOffset = 10 * powerplayType.value;
  if (['2Point', '3Point'].includes(buttonType)) {
    payload_index = basePlaylists[buttonType] + powerplayOffset;
    return payloads[payload_index];
  }

  // rest of the buttons
  payload_index = basePlaylists[buttonType];
  return payloads[payload_index];
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

  await callWLED(`initPowerplay${powerplayType.value}`);
  // const payload = { "pl": powerplayType.value === 2 ? 172 : 171 };
  // await sendPOSTRequest("state", JSON.stringify(payload));

  powerplayInterval.value = setInterval(() => {
    if (powerplayTimer.value > 0 && isPowerplayRunning.value) powerplayTimer.value--;
  }, 1000);

  isPowerplayRunning.value = true;
  IS_GAME_NORMAL.value = false; // IMP: first time game is not normal
  powerplayBtnLabel.value = "...";
};

const resetPowerplayTimer = async () => {
  // Send black preset as end of powerplay
  await callWLED("presetClear");
  clearInterval(powerplayInterval.value);
  isPowerplayRunning.value = false;
  powerplayTimer.value = DEFAULT_POWERPLAY_TIMER;
  powerplayBtnLabel.value = 'Start';
};

const handleBuzzer = async () => {
  if (isBuzzerEngaged.value) {
    if (isPowerplayRunning.value && !IS_GAME_NORMAL.value) {
      // TODO: remove before prod
      console.log(`powerplay ${powerplayType.value} in progress...`);

      // pause timer
      isPowerplayRunning.value = false;
      powerplayBtnLabel.value = "Buzzer engaged, timer paused...";
      clearInterval(powerplayInterval.value);

      // Set lights to long red (until buzzer disengages)
      await callWLED("buzzerPowerplay");
    } else {
      // deactivate user actions on buzzer toggle
      // buzzerDisabled.value = true;

      // not a powerplay, call normal buzzer
      await callWLED("buzzer");
      
      // [LONG TERM] TODO: get callback from WLED? this is very hacky and only for user experience
      // so the user does not think buzzer button is glitching
      // disengage buzzer in 2s
      setTimeout(() => {
        isBuzzerEngaged.value = false;
        // buzzerDisabled.value = true;
      }, 500);
    }
  } else {
    // disengaged: we will only come here when user clicks on buzzer toggle from powerplay
    // since it's auto dis-engaged when game is in NORMAL mode

    if (!IS_GAME_NORMAL.value) { // timer was not 0, we had paused powerplay

      // go back to powerplay solid colour on timer resume
      await callWLED(`presetPP${powerplayType.value}`);

      // resume timer
      // TODO: consider if (interval.value) then clear?
      powerplayInterval.value = setInterval(() => {
        if (powerplayTimer.value > 0) powerplayTimer.value--;
      }, 1000);
      isPowerplayRunning.value = true;
      powerplayBtnLabel.value = "...";
    }
  }
}

// Watchers
watch(powerplayTimer, async (newVal) => {
  // IMPORTANT: we set normalMode to true again ONLY here, not inside handleBuzzer.
  // This is the only way to ensure global truth about current game mode. Do not edit normalMode state
  // unless you know what you are doing!!!
  if (newVal === 0) {
    IS_GAME_NORMAL.value = true; // IMP: last second of powerplay over, only place to set normal mode to true

    // calls preset black on WLED to clear LEDs
    await resetPowerplayTimer();
  }
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.switch input:checked + .slider {
    background-color: rgba(33, 150, 243, 0.8);
}

.switch input:checked + .slider:before {
    left: 60px;
    content: "2";
}

.switch input:checked + .slider:after {
    opacity: 0; /* Show it when checked */
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
    background-color: rgba(128,0,128,0.7);
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

/* TODO: major refactor of all sliders */
/* Buzzer Slider - Hacky */
.buzzer-switch {
    position: relative;
    display: inline-block;
    width: 20vh;
    height: 8vh;
}

.buzzer-switch input { 
    display:none;
}

.buzzer-switch input:checked + .buzzer-slider {
  background-color: var(--btn-buzzer-bg-engaged); /* buzzer engaged */
  color: var(--text-color-light);
  /* transform: scale(1.1); */
  box-shadow: 0 0px 0px rgba(0,0,0,0.4);
  transition: transform .3s ease, box-shadow .3s ease;
}

.buzzer-switch input:checked + .buzzer-slider:before {
    left: 13vh;
}

.buzzer-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--btn-buzzer-bg-disengaged); /* buzzer disengaged */
    border-radius: 8vh;
    transition: .4s;
    box-shadow: 0 12px 24px rgba(0,0,0,0.8);
}

.buzzer-slider:before{
    position: absolute;
    height: 6vh;
    width: 6vh;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
    content: "";
    left: 1vh;
    bottom: 1vh;
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
