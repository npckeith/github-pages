(function () {
  var WHEEL_COLORS = [
    "#1e4479",
    "#4b6994",
    "#788faf",
    "#a5b4c9",
    "#80c8ee",
    "#cce9f8",
    "#d2dae4",
    "#e9ecf2",
  ];

  var ROTATING_WORDS = [
    "transform",
    "solve",
    "build",
    "shape",
    "innovate",
    "evolve",
    "make progress",
    "wheel",
  ];

  var pickNameBtn = document.getElementById("pick-name-btn");
  var nameDisplay = document.getElementById("name-display");

  var spinBtn = document.getElementById("spin-btn");
  var questionDisplay = document.getElementById("question-display");

  var rotatingWordEl = document.getElementById("rotating-word");

  var canvas = document.getElementById("wheel-canvas");
  var ctx = canvas.getContext("2d");

  var spinning = false;

  function startRotatingWord() {
    var index = 0;
    setInterval(function () {
      index = (index + 1) % ROTATING_WORDS.length;
      rotatingWordEl.classList.add("fade");
      setTimeout(function () {
        rotatingWordEl.textContent = ROTATING_WORDS[index];
        rotatingWordEl.classList.remove("fade");
      }, 300);
    }, 2200);
  }

  function pickName() {
    var name = NAMES[Math.floor(Math.random() * NAMES.length)];
    nameDisplay.textContent = name;
  }

  function drawWheel() {
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = canvas.width / 2 - 8;
    var count = QUESTIONS.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var segAngle = (Math.PI * 2) / count;

    for (var i = 0; i < count; i++) {
      var start = -Math.PI / 2 + i * segAngle;
      var end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = "right";
      ctx.font = "bold 18px Inter, system-ui";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1e4479";
      ctx.strokeText(String(i + 1), radius - 14, 6);
      ctx.fillStyle = "#fff";
      ctx.fillText(String(i + 1), radius - 14, 6);
      ctx.restore();
    }
  }

  function spinWheel() {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;

    var count = QUESTIONS.length;
    var segAngleDeg = 360 / count;
    var targetIndex = Math.floor(Math.random() * count);
    var segCenterDeg = targetIndex * segAngleDeg + segAngleDeg / 2;
    var extraSpins = 5 + Math.floor(Math.random() * 3);
    var targetRotation = extraSpins * 360 + (360 - segCenterDeg);

    canvas.style.transition =
      "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
    canvas.style.transform = "rotate(" + targetRotation + "deg)";

    function onTransitionEnd() {
      canvas.removeEventListener("transitionend", onTransitionEnd);

      questionDisplay.textContent = QUESTIONS[targetIndex];

      canvas.style.transition = "none";
      canvas.style.transform = "rotate(0deg)";
      drawWheel();

      spinning = false;
      spinBtn.disabled = false;
    }

    canvas.addEventListener("transitionend", onTransitionEnd);
  }

  pickNameBtn.addEventListener("click", pickName);
  spinBtn.addEventListener("click", spinWheel);

  drawWheel();
  startRotatingWord();
})();
