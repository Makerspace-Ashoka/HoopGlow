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
        <button class="btn" style="background-color: #5D2A42;  color: #fbf5f3;" @click="handleButton('1Point')">1 Point</button>
        <button class="btn" style="background-color: #3a9d8f;  color: #fbf5f3;" @click="handleButton('2Point')">2 Points</button>
        <button class="btn" style="background-color: #D9F9A5;" @click="handleButton('3Point')">3 Points</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Powerplay</span>
      <div class="section-body">
        <label class="switch">
          <input type="checkbox">
          <span class="slider"></span>
        </label>
        <button class="btn start-powerplay">Start</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Gameplay</span>
      <div class="section-body">
        <button class="btn" style="background-color: #E76F51; color: #fbf5f3;" @click="handleButton('buzzer')">Buzzer</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Celebrations</span>
      <div class="section-body">
        <button class="btn" style="background-color: #FFD639;" @click="handleButton('1Effect')">Effect 1</button>
        <button class="btn" style="background-color: #FFD639;" @click="handleButton('2Effect')">Effect 2</button>
        <button class="btn" style="background-color: #FFD639;" @click="handleButton('3Effect')">Effect 3</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const powerplayType = ref('1');
const timer = ref(60);
const isPowerplayRunning = ref(false);

const handleButton = async (buttonType) => {
  let payload = {};
  switch(buttonType) {
    case '1Point':
      // We will never come here in powerplay
      payload = {"playlist":{"ps":[1,2,4,3],"dur":[10,20,5,100],"transition":[7,7,7,7],"repeat":0,"r":false,"end":0},"on":true};
      break;
    case '2Point':
      payload = {};
      if(isPowerplayRunning.value) {
        payload = {"playlist":{"ps":[7,6,4,3],"dur":[10,20,5,100],"transition":[7,7,7,7],"repeat":0,"r":false,"end":0},"on":true};
      } else {
        // TODO: if powerplay is running then set segment colour after wipe
        payload = {};
      }
      break;
    case '3Point':
      // We only come here in powerplay
      payload = {"playlist":{"ps":[10,9,4,3],"dur":[10,20,10,100],"transition":[7,7,7,7],"repeat":0,"r":false,"end":0},"on":true};
      break;
    case 'buzzer':
      payload = {"playlist":{"ps":[12,13],"dur":[130,70],"transition":[7,7],"repeat":0,"r":false,"end":0},"on":true};
      break;
    case '1Effect':
      payload = {"on":true,"bri":197,"transition":7,"mainseg":0,"seg":[{"id":0,"start":0,"stop":60,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[99,255,250],[191,255,54],[175,255,173]],"fx":60,"sx":220,"ix":255,"pal":0,"sel":true,"rev":false,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]};
      break;
    case '2Effect':
      payload = {"on":true,"bri":197,"transition":7,"mainseg":0,"seg":[{"id":0,"start":0,"stop":60,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[99,255,250],[191,255,54],[175,255,173]],"fx":60,"sx":220,"ix":255,"pal":0,"sel":true,"rev":false,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]};
      break;
    case '3Effect':
      payload = {"on":true,"bri":197,"transition":7,"mainseg":0,"seg":[{"id":0,"start":0,"stop":60,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[99,255,250],[191,255,54],[175,255,173]],"fx":60,"sx":220,"ix":255,"pal":0,"sel":true,"rev":false,"mi":false},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0},{"stop":0}]};
      break;
    // ... add cases for other buttons ...
  }
  // Send API call with the payload
  await sendPOSTRequest("state", JSON.stringify(payload));
  // Example: fetch('API_ENDPOINT', { method: 'POST', body: JSON.stringify(payload) });
};

const startPowerplay = () => {
  // Send API call on start keypress
  // Example: fetch('API_ENDPOINT_START', { method: 'POST', body: JSON.stringify({ powerplayType: powerplayType.value }) });

  isPowerplayRunning.value = true;
  const intervalId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(intervalId);
      isPowerplayRunning.value = false;
      timer.value = 60;  // Reset timer
      // Send another API call when timer runs out
      // Example: fetch('API_ENDPOINT_END', { method: 'POST', body: JSON.stringify({ powerplayType: powerplayType.value }) });
    }
  }, 1000);
};

// Function to send API requests using fetch
const sendPOSTRequest = async (apiCommand, payload) => {
  const IP = "192.168.0.1";
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

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

watch(timer, (newVal) => {
  if (newVal === 0) {
    isPowerplayRunning.value = false;
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
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem 2rem;
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
