const numberInput = document.getElementById("number");
const roundsEl = document.getElementById("rounds");
const methodSelect = document.getElementById("method");
const bombBtn = document.getElementById("bombBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const logsEl = document.getElementById("logs");
const clearBtn = document.getElementById("clearBtn");
const minusBtn = document.getElementById("minus");
const plusBtn = document.getElementById("plus");

let rounds = 15;
let loading = false;

function setRounds(val) {
  rounds = Math.min(50, Math.max(1, val));
  roundsEl.textContent = rounds;
}

minusBtn.addEventListener("click", () => setRounds(rounds - 5));
plusBtn.addEventListener("click", () => setRounds(rounds + 5));

function addLog(msg) {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  const empty = logsEl.querySelector(".term-empty");
  if (empty) empty.remove();

  const line = document.createElement("div");
  line.className = "term-line";
  line.textContent = `[${time}] ${msg}`;
  logsEl.appendChild(line);
  logsEl.scrollTop = logsEl.scrollHeight;
}

function setStatus(state) {
  statusDot.className = "status-dot";
  bombBtn.className = "bomb-btn";

  if (state === "running") {
    statusDot.classList.add("running");
    statusText.textContent = "EXECUTING";
    bombBtn.classList.add("loading");
    bombBtn.innerHTML = '<span class="spinner"></span>BOMBING...';
    bombBtn.disabled = true;
  } else if (state === "done") {
    statusDot.classList.add("done");
    statusText.textContent = "SUCCESS";
    bombBtn.classList.add("done");
    bombBtn.textContent = "✓ COMPLETED";
    bombBtn.disabled = false;
  } else if (state === "error") {
    statusDot.classList.add("error");
    statusText.textContent = "FAILED";
    bombBtn.classList.add("error");
    bombBtn.textContent = "✗ RETRY";
    bombBtn.disabled = false;
  } else {
    statusText.textContent = "READY";
    bombBtn.textContent = "▶ LAUNCH BOMB";
    bombBtn.disabled = false;
  }
}

clearBtn.addEventListener("click", () => {
  logsEl.innerHTML = '<span class="term-empty">Waiting for command...</span>';
  setStatus("idle");
});

bombBtn.addEventListener("click", async () => {
  if (loading) return;

  const number = numberInput.value.trim();
  if (!number) {
    addLog("ERROR: Number required");
    setStatus("error");
    return;
  }

  loading = true;
  setStatus("running");
  addLog(`TARGET LOCKED → ${number}`);
  addLog(`ROUNDS → ${rounds} | METHOD → ${methodSelect.value.toUpperCase()}`);
  addLog("INITIATING SEQUENCE...");

  try {
    const res = await fetch("/api/bomb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        rounds,
        method: methodSelect.value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      addLog(`SUCCESS → Rounds: ${data.rounds}`);
      addLog(`RESPONSE → ${JSON.stringify(data.response).slice(0, 120)}...`);
      addLog("SEQUENCE COMPLETE");
      setStatus("done");
    } else {
      addLog(`FAILED → ${data.message}`);
      setStatus("error");
    }
  } catch (err) {
    addLog(`ERROR → ${err.message || "Network fail"}`);
    setStatus("error");
  } finally {
    loading = false;
  }
});
