<template>
  <div class="container">
    <div class="section status-monitor">
      <span class="section-title" id="status-monitor">Status Monitor</span>
      <div class="monitor-card"></div>
    </div>
    <div class="section">
      <span class="section-title">Points</span>
      <div class="section-body">
        <button class="btn" style="background-color: #5D2A42;  color: #fbf5f3;">1 Point</button>
        <button class="btn" style="background-color: #3a9d8f;  color: #fbf5f3;">2 Points</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Powerplay</span>
      <div class="section-body">
        <label class="switch">
          <input type="checkbox">
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Gameplay</span>
      <div class="section-body">
        <button class="btn" style="background-color: #E76F51; color: #fbf5f3;">Buzzer</button>
        <button class="btn" style="background-color: #D9F9A5;">Halftime</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Celebrations</span>
      <div class="section-body">
        <button class="btn" style="background-color: #FFD639;">Effect 1</button>
        <button class="btn" style="background-color: #FFD639;">Effect 2</button>
        <button class="btn" style="background-color: #FFD639;">Effect 3</button>
        <button class="btn" style="background-color: #FFD639;">Effect 4</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      powerplayChoice: '1',
    };
  },
};
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
