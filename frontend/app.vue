<template>
  <div class="container">
    <div class="section status-monitor">
      <span class="section-title" id="status-monitor">Status Monitor</span>
      <div class="monitor-card"></div>
    </div>
    <div class="section">
      <span class="section-title">Points</span>
      <div>
        <button class="btn">1 Point</button>
        <button class="btn">2 Points</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Powerplay</span>
      <label class="switch">
        <input type="checkbox">
        <span class="slider"></span>
      </label>
    </div>
    <div class="section">
      <span class="section-title">Gameplay</span>
      <div>
        <button class="btn">Buzzer</button>
        <button class="btn">Halftime</button>
      </div>
    </div>
    <div class="section">
      <span class="section-title">Celebrations</span>
      <div>
        <button class="btn">Effect 1</button>
        <button class="btn">Effect 2</button>
        <button class="btn">Effect 3</button>
        <button class="btn">Effect 4</button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  max-width: 90%;
  margin: 0 auto;
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
  font-weight: bold;
  flex: 1;
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

.btn {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #f0f0f0;
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
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "1";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked + .slider {
    background-color: #2196F3;
}

input:checked + .slider:before {
    transform: translateX(56px);
    content: "2";
}

/* Adjustments for responsiveness can be added below */
@media (max-width: 768px) {
  .btn {
    margin: 3px;
    padding: 8px 16px;
  }
}
</style>
