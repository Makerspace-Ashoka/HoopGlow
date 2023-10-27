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
      <div>
        <label>
          <input type="radio" name="powerplay" value="1" v-model="powerplayChoice" /> 1
        </label>
        <label>
          <input type="radio" name="powerplay" value="2" v-model="powerplayChoice" /> 2
        </label>
      </div>
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

/* Adjustments for responsiveness can be added below */
@media (max-width: 768px) {
  .btn {
    margin: 3px;
    padding: 8px 16px;
  }
}
</style>
