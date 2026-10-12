(function () {
  "use strict";

  var STORAGE_KEY = "brutal_os_v3_state";
  var SOUND_KEY = "brutal_os_v3_sound";
  var RING_CIRCUMFERENCE = 779.1;
  var MONTHS = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  var DAYS = [
    "DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"
  ];

  var MATERIALS = [
    { id: "bw", kind: "bw", label: "Peso corporal", short: "BW", icon: "BW", note: "Siempre disponible" },
    { id: "kb4", kind: "kb", weight: 4, label: "KB 4 kg", short: "KB4", icon: "4", note: "1 unidad" },
    { id: "kb8", kind: "kb", weight: 8, label: "KB 8 kg", short: "KB8", icon: "8", note: "1 unidad" },
    { id: "kb16", kind: "kb", weight: 16, label: "KB 16 kg", short: "KB16", icon: "16", note: "1 unidad" },
    { id: "kb20a", kind: "kb", weight: 20, label: "KB20 · A", short: "KB20 · A", icon: "20", note: "20 kg · independiente" },
    { id: "kb20b", kind: "kb", weight: 20, label: "KB20 · B", short: "KB20 · B", icon: "20", note: "20 kg · independiente" },
    { id: "kb28", kind: "kb", weight: 28, label: "KB 28 kg", short: "KB28", icon: "28", note: "1 unidad" },
    { id: "trx", kind: "trx", label: "TRX", short: "TRX", icon: "TX", note: "Suspensión" },
    { id: "wheel", kind: "wheel", label: "Rueda abdominal", short: "Rueda", icon: "◎", note: "Core" },
    { id: "hipband", kind: "hipband", label: "Gomas cadera", short: "Goma cadera", icon: "GC", note: "Banda cerrada" },
    { id: "footband", kind: "footband", label: "Gomas pies", short: "Gomas pies", icon: "GP", note: "Set ligero" }
  ];

  var OBJECTIVES = [
    { id: "strength", label: "Fuerza", icon: "FZ", note: "Control y tensión" },
    { id: "power", label: "Potencia", icon: "PT", note: "Rápido y explosivo" },
    { id: "endurance", label: "Resistencia", icon: "RS", note: "Volumen sostenido" },
    { id: "fat", label: "Fat burner", icon: "FB", note: "Condicionamiento" },
    { id: "mobility", label: "Movilidad", icon: "MV", note: "Rango y control" },
    { id: "core", label: "Core", icon: "CR", note: "Estabilidad" }
  ];

  var DURATIONS = [20, 30, 45, 60];

  var WILDCARDS = [
    { id: "express", title: "EXPRESS FULL BODY", meta: "20 MIN", description: "Fuerza y ritmo sin perder movilidad.", goals: ["strength", "fat"], duration: 20 },
    { id: "mobility", title: "MOVILIDAD TOTAL", meta: "20 MIN", description: "Rango, control y respiración.", goals: ["mobility"], duration: 20 },
    { id: "core", title: "CORE + MOVILIDAD", meta: "20 MIN", description: "Estabilidad, rueda y control.", goals: ["core", "mobility"], duration: 20 },
    { id: "complete", title: "FULL BODY 30", meta: "30 MIN", description: "Fuerza y resistencia equilibradas.", goals: ["strength", "endurance"], duration: 30 }
  ];

  var EXERCISES = [
    { id: "march", name: "Marcha activa", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "cardio", rx: "RITMO SUAVE" },
    { id: "catcow", name: "Gato-camello", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "spine", rx: "CONTROL VERTEBRAL" },
    { id: "worlds", name: "World’s greatest stretch", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "mobility", rx: "ALTERNA LADOS" },
    { id: "hiprot", name: "Rotaciones de cadera", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "hips", rx: "AMPLIO Y SUAVE" },
    { id: "thoracic", name: "Rotación torácica", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "spine", rx: "CAMBIA DE LADO" },
    { id: "deeppry", name: "Sentadilla profunda + apertura", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "squat", rx: "MOVILIDAD" },
    { id: "inchworm", name: "Inchworm", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "full", rx: "PASOS CORTOS" },
    { id: "glutewarm", name: "Puente de glúteo", phase: "warmup", goals: ["mobility"], kind: "bw", pattern: "hinge", rx: "PAUSA ARRIBA" },
    { id: "halowarm", name: "Halo con kettlebell", phase: "warmup", goals: ["mobility"], kind: "kb", weights: [4, 8, 16], tier: 0, pattern: "shoulders", rx: "5 POR LADO" },
    { id: "bandwalkwarm", name: "Pasos laterales con goma", phase: "warmup", goals: ["mobility"], kind: "hipband", pattern: "hips", rx: "CONTROLADOS" },

    { id: "swing", name: "Swing a dos manos", phase: "main", goals: ["power", "endurance", "fat"], kind: "kb", weights: [8, 16, 20, 28], tier: 2, pattern: "hinge", rx: "12 REPETICIONES" },
    { id: "deadlift", name: "Kettlebell deadlift", phase: "main", goals: ["strength", "endurance"], kind: "kb", weights: [8, 16, 20, 28], tier: 2, pattern: "hinge", rx: "8 REPETICIONES" },
    { id: "goblet", name: "Goblet squat", phase: "main", goals: ["strength", "endurance", "fat"], kind: "kb", weights: [8, 16, 20, 28], tier: 1, pattern: "squat", rx: "8 REPETICIONES" },
    { id: "reverse-lunge", name: "Zancada inversa goblet", phase: "main", goals: ["strength", "endurance"], kind: "kb", weights: [4, 8, 16, 20], tier: 1, pattern: "lunge", rx: "6 POR LADO" },
    { id: "row", name: "Remo unilateral", phase: "main", goals: ["strength", "endurance"], kind: "kb", weights: [8, 16, 20, 28], tier: 1, pattern: "pull", rx: "8 POR LADO" },
    { id: "floorpress", name: "Floor press unilateral", phase: "main", goals: ["strength"], kind: "kb", weights: [4, 8, 16, 20], tier: 1, pattern: "push", rx: "8 POR LADO" },
    { id: "strictpress", name: "Press estricto", phase: "main", goals: ["strength"], kind: "kb", weights: [4, 8, 16, 20], tier: 1, pattern: "push", rx: "6 POR LADO" },
    { id: "pushpress", name: "Push press unilateral", phase: "main", goals: ["power", "strength"], kind: "kb", weights: [4, 8, 16, 20], tier: 1, pattern: "push", rx: "6 POR LADO" },
    { id: "clean", name: "Clean unilateral", phase: "main", goals: ["power", "strength"], kind: "kb", weights: [8, 16, 20], tier: 1, pattern: "full", rx: "6 POR LADO" },
    { id: "suitcase", name: "Suitcase carry", phase: "main", goals: ["strength", "core", "endurance"], kind: "kb", weights: [8, 16, 20, 28], tier: 2, pattern: "carry", rx: "CAMBIA A MITAD" },
    { id: "halo", name: "Halo", phase: "main", goals: ["mobility", "core"], kind: "kb", weights: [4, 8, 16], tier: 0, pattern: "shoulders", rx: "6 POR LADO" },
    { id: "tgu-partial", name: "TGU parcial hasta sentado", phase: "main", goals: ["core", "mobility", "strength"], kind: "kb", weights: [4, 8, 16], tier: 0, pattern: "full", rx: "3 POR LADO" },
    { id: "kb-deadbug", name: "Dead bug con KB", phase: "main", goals: ["core"], kind: "kb", weights: [4, 8, 16], tier: 0, pattern: "core", rx: "8 POR LADO" },
    { id: "double-deadlift", name: "Doble kettlebell deadlift", phase: "main", goals: ["strength"], kind: "kb", weights: [20], count: 2, tier: 2, pattern: "hinge", rx: "6 REPETICIONES" },
    { id: "double-squat", name: "Doble front squat", phase: "main", goals: ["strength"], kind: "kb", weights: [20], count: 2, tier: 2, pattern: "squat", rx: "6 REPETICIONES" },
    { id: "double-row", name: "Doble remo inclinado", phase: "main", goals: ["strength"], kind: "kb", weights: [20], count: 2, tier: 2, pattern: "pull", rx: "8 REPETICIONES" },

    { id: "pushup", name: "Flexiones", phase: "main", goals: ["strength", "endurance", "fat"], kind: "bw", pattern: "push", rx: "8–15 REPETICIONES" },
    { id: "airsquat", name: "Sentadilla controlada", phase: "main", goals: ["strength", "endurance"], kind: "bw", pattern: "squat", rx: "12 REPETICIONES" },
    { id: "jumposquat", name: "Sentadilla con salto", phase: "main", goals: ["power", "fat"], kind: "bw", pattern: "squat", rx: "8 REPETICIONES" },
    { id: "burpee", name: "Burpees", phase: "main", goals: ["fat", "endurance"], kind: "bw", pattern: "full", rx: "RITMO CONSTANTE" },
    { id: "climber", name: "Escaladores", phase: "main", goals: ["fat", "endurance", "core"], kind: "bw", pattern: "core", rx: "RITMO ALTO" },
    { id: "bearcrawl", name: "Bear crawl", phase: "main", goals: ["core", "endurance", "fat"], kind: "bw", pattern: "full", rx: "IDA Y VUELTA" },
    { id: "plank", name: "Plancha hardstyle", phase: "main", goals: ["core", "strength"], kind: "bw", pattern: "core", rx: "TENSIÓN TOTAL" },
    { id: "sideplank", name: "Plancha lateral", phase: "main", goals: ["core"], kind: "bw", pattern: "core", rx: "CAMBIA A MITAD" },
    { id: "hollow", name: "Hollow hold", phase: "main", goals: ["core"], kind: "bw", pattern: "core", rx: "LUMBAR AL SUELO" },
    { id: "deadbug", name: "Dead bug", phase: "main", goals: ["core", "mobility"], kind: "bw", pattern: "core", rx: "8 POR LADO" },
    { id: "bird-dog", name: "Bird dog", phase: "main", goals: ["core", "mobility"], kind: "bw", pattern: "core", rx: "6 POR LADO" },
    { id: "cossack", name: "Cossack squat", phase: "main", goals: ["mobility", "strength"], kind: "bw", pattern: "squat", rx: "5 POR LADO" },
    { id: "shinbox", name: "Shin box", phase: "main", goals: ["mobility"], kind: "bw", pattern: "hips", rx: "TRANSICIONES LENTAS" },
    { id: "thoracic-main", name: "Rotación torácica en suelo", phase: "main", goals: ["mobility"], kind: "bw", pattern: "spine", rx: "6 POR LADO" },
    { id: "lunge-stretch", name: "Zancada + rotación", phase: "main", goals: ["mobility"], kind: "bw", pattern: "hips", rx: "CAMBIA A MITAD" },
    { id: "squat-flow", name: "Flujo de sentadilla profunda", phase: "main", goals: ["mobility"], kind: "bw", pattern: "squat", rx: "RESPIRA" },

    { id: "trx-row", name: "Remo TRX", phase: "main", goals: ["strength", "endurance"], kind: "trx", pattern: "pull", rx: "10 REPETICIONES" },
    { id: "trx-press", name: "Press de pecho TRX", phase: "main", goals: ["strength", "endurance"], kind: "trx", pattern: "push", rx: "10 REPETICIONES" },
    { id: "trx-facepull", name: "Face pull TRX", phase: "main", goals: ["strength", "mobility"], kind: "trx", pattern: "pull", rx: "12 REPETICIONES" },
    { id: "trx-squat", name: "Sentadilla TRX", phase: "main", goals: ["endurance", "mobility"], kind: "trx", pattern: "squat", rx: "12 REPETICIONES" },
    { id: "trx-hamcurl", name: "Curl femoral TRX", phase: "main", goals: ["strength", "core"], kind: "trx", pattern: "hinge", rx: "10 REPETICIONES" },
    { id: "trx-pike", name: "Pike TRX", phase: "main", goals: ["core"], kind: "trx", pattern: "core", rx: "8 REPETICIONES" },
    { id: "trx-fallout", name: "Fallout TRX", phase: "main", goals: ["core", "strength"], kind: "trx", pattern: "core", rx: "8 REPETICIONES" },

    { id: "wheel-rollout", name: "Rueda abdominal", phase: "main", goals: ["core", "strength"], kind: "wheel", pattern: "core", rx: "6–10 REPETICIONES" },
    { id: "wheel-hold", name: "Plancha sobre rueda", phase: "main", goals: ["core"], kind: "wheel", pattern: "core", rx: "POSICIÓN FIRME" },

    { id: "monsterwalk", name: "Monster walk", phase: "main", goals: ["strength", "endurance", "mobility"], kind: "hipband", pattern: "hips", rx: "10 PASOS POR LADO" },
    { id: "lateralwalk", name: "Pasos laterales con goma", phase: "main", goals: ["endurance", "fat", "mobility"], kind: "hipband", pattern: "hips", rx: "12 PASOS POR LADO" },
    { id: "clamshell", name: "Clam shell con goma", phase: "main", goals: ["strength", "mobility"], kind: "hipband", pattern: "hips", rx: "12 POR LADO" },
    { id: "bandbridge", name: "Puente de glúteo con goma", phase: "main", goals: ["strength", "endurance"], kind: "hipband", pattern: "hinge", rx: "15 REPETICIONES" },

    { id: "foot-march", name: "Marcha resistida con gomas", phase: "main", goals: ["endurance", "fat"], kind: "footband", pattern: "hips", rx: "PASOS CONTROLADOS" },
    { id: "foot-abduction", name: "Abducción con gomas de pies", phase: "main", goals: ["strength", "mobility"], kind: "footband", pattern: "hips", rx: "10 POR LADO" },
    { id: "foot-kickback", name: "Extensión de cadera con goma", phase: "main", goals: ["strength", "endurance"], kind: "footband", pattern: "hinge", rx: "10 POR LADO" },

    { id: "breathing", name: "Respiración 90/90", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "breath", rx: "EXHALACIÓN LARGA" },
    { id: "hipflexor", name: "Apertura de flexor de cadera", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "hips", rx: "CAMBIA A MITAD" },
    { id: "posterior", name: "Cadena posterior", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "hinge", rx: "SIN REBOTES" },
    { id: "childpose", name: "Child’s pose + dorsales", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "spine", rx: "RESPIRA" },
    { id: "pecstretch", name: "Apertura de pectoral", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "shoulders", rx: "CAMBIA A MITAD" },
    { id: "ankles", name: "Movilidad de tobillo", phase: "cooldown", goals: ["mobility"], kind: "bw", pattern: "ankles", rx: "RODILLA AL FRENTE" }
  ];

  var BLOCK_SETTINGS = {
    strength: { label: "FUERZA", work: 45, description: "Repeticiones limpias y controladas." },
    power: { label: "POTENCIA", work: 35, description: "Velocidad, intención y técnica." },
    endurance: { label: "RESISTENCIA", work: 45, description: "Ritmo sostenible y volumen." },
    fat: { label: "CONDICIONAMIENTO", work: 40, description: "Trabajo continuo de cuerpo completo." },
    mobility: { label: "MOVILIDAD", work: 50, description: "Rango, control y respiración." },
    core: { label: "CORE", work: 40, description: "Estabilidad y tensión del tronco." }
  };

  var $ = function (id) { return document.getElementById(id); };
  var DEFAULT_MATERIALS = MATERIALS.map(function (item) { return item.id; });
  var state = loadState();
  var soundOn = loadSound();
  var currentSession = null;
  var currentSummary = null;
  var steps = [];
  var currentStepIndex = 0;
  var stepRemaining = 0;
  var running = false;
  var tickHandle = null;
  var stepEndAt = 0;
  var startedAt = 0;
  var pausedTotal = 0;
  var pauseStartedAt = 0;
  var lastBeepSecond = -1;
  var wakeLock = null;
  var modalWasRunning = false;
  var toastHandle = null;
  var audioContext = null;

  function freshProfile(defaultObjectives) {
    return {
      materials: DEFAULT_MATERIALS.slice(),
      objectives: defaultObjectives.slice(),
      duration: 30,
      history: [],
      favorites: []
    };
  }

  function defaultState() {
    return {
      version: 3,
      activeProfile: "boy",
      profiles: {
        boy: freshProfile(["strength", "mobility"]),
        girl: freshProfile(["strength", "mobility"])
      }
    };
  }

  function loadState() {
    var fallback = defaultState();
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || parsed.version !== 3 || !parsed.profiles) return fallback;
      ["boy", "girl"].forEach(function (profileId) {
        if (!parsed.profiles[profileId]) parsed.profiles[profileId] = freshProfile(["strength", "mobility"]);
        var profile = parsed.profiles[profileId];
        if (!Array.isArray(profile.materials)) profile.materials = DEFAULT_MATERIALS.slice();
        if (!Array.isArray(profile.objectives) || !profile.objectives.length) profile.objectives = ["strength"];
        if (!DURATIONS.includes(profile.duration)) profile.duration = 30;
        if (!Array.isArray(profile.history)) profile.history = [];
        if (!Array.isArray(profile.favorites)) profile.favorites = [];
      });
      if (!["boy", "girl"].includes(parsed.activeProfile)) parsed.activeProfile = "boy";
      return parsed;
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      showToast("No se pudo guardar en este dispositivo.");
    }
  }

  function loadSound() {
    try {
      return localStorage.getItem(SOUND_KEY) !== "0";
    } catch (error) {
      return true;
    }
  }

  function saveSound() {
    try {
      localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0");
    } catch (error) {}
  }

  function activeProfile() {
    return state.profiles[state.activeProfile];
  }

  function profileLabel() {
    return state.activeProfile === "girl" ? "GIRL" : "BOY";
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function labelForObjective(id) {
    var item = OBJECTIVES.find(function (objective) { return objective.id === id; });
    return item ? item.label : id;
  }

  function formatClock(totalSeconds) {
    var seconds = Math.max(0, Math.round(totalSeconds));
    var minutes = Math.floor(seconds / 60);
    var rest = String(seconds % 60).padStart(2, "0");
    return minutes + ":" + rest;
  }

  function shuffle(list) {
    var copy = list.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var temp = copy[index];
      copy[index] = copy[randomIndex];
      copy[randomIndex] = temp;
    }
    return copy;
  }

  function escapeText(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setDate() {
    var now = new Date();
    $("todayName").textContent = DAYS[now.getDay()];
    $("todayDate").textContent = now.getDate() + " " + MONTHS[now.getMonth()] + " " + now.getFullYear();
  }

  function setProfile(profileId) {
    if (!state.profiles[profileId]) return;
    state.activeProfile = profileId;
    document.documentElement.dataset.profile = profileId;
    saveState();
    renderHome();
    showToast("Perfil " + profileLabel() + " activo");
  }

  function renderProfileSwitch() {
    document.querySelectorAll("[data-profile-choice]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.profileChoice === state.activeProfile));
    });
    document.documentElement.dataset.profile = state.activeProfile;
  }

  function renderMaterials() {
    var selected = activeProfile().materials;
    $("materialGrid").innerHTML = MATERIALS.map(function (item) {
      var on = selected.includes(item.id);
      var disabled = item.id === "bw";
      return (
        '<button type="button" class="choice-button" data-material="' + item.id + '"' +
        ' aria-pressed="' + String(on) + '"' + (disabled ? ' aria-disabled="true"' : "") + ">" +
          '<span class="choice-icon" aria-hidden="true">' + escapeText(item.icon) + "</span>" +
          '<span class="choice-label"><strong>' + escapeText(item.label) + "</strong>" +
          "<small>" + escapeText(item.note) + "</small></span>" +
        "</button>"
      );
    }).join("");

    document.querySelectorAll("[data-material]").forEach(function (button) {
      button.addEventListener("click", function () {
        toggleMaterial(button.dataset.material);
      });
    });
  }

  function toggleMaterial(materialId) {
    if (materialId === "bw") {
      showToast("El peso corporal siempre está disponible.");
      return;
    }
    var profile = activeProfile();
    if (profile.materials.includes(materialId)) {
      profile.materials = profile.materials.filter(function (id) { return id !== materialId; });
    } else {
      profile.materials.push(materialId);
    }
    if (!profile.materials.includes("bw")) profile.materials.unshift("bw");
    saveState();
    renderMaterials();
  }

  function renderObjectives() {
    var selected = activeProfile().objectives;
    $("objectiveGrid").innerHTML = OBJECTIVES.map(function (item) {
      var order = selected.indexOf(item.id);
      var on = order >= 0;
      return (
        '<button type="button" class="choice-button" data-objective="' + item.id + '" aria-pressed="' + String(on) + '">' +
          '<span class="choice-icon" aria-hidden="true">' + escapeText(item.icon) + "</span>" +
          '<span class="choice-label"><strong>' + escapeText(item.label) + "</strong>" +
          "<small>" + escapeText(item.note) + "</small></span>" +
          (on ? '<span class="choice-order" aria-label="Prioridad ' + (order + 1) + '">' + (order + 1) + "</span>" : "") +
        "</button>"
      );
    }).join("");
    $("objectiveCount").textContent = selected.length + "/2";

    document.querySelectorAll("[data-objective]").forEach(function (button) {
      button.addEventListener("click", function () {
        toggleObjective(button.dataset.objective);
      });
    });
  }

  function toggleObjective(objectiveId) {
    var profile = activeProfile();
    var position = profile.objectives.indexOf(objectiveId);
    if (position >= 0) {
      if (profile.objectives.length === 1) {
        showToast("La sesión necesita al menos un objetivo.");
        return;
      }
      profile.objectives.splice(position, 1);
    } else {
      if (profile.objectives.length >= 2) {
        showToast("Puedes combinar un máximo de dos objetivos.");
        return;
      }
      profile.objectives.push(objectiveId);
    }
    saveState();
    renderObjectives();
  }

  function renderDurations() {
    var selected = activeProfile().duration;
    $("durationGrid").innerHTML = DURATIONS.map(function (minutes) {
      return (
        '<button type="button" class="duration-button" data-duration="' + minutes +
        '" aria-pressed="' + String(selected === minutes) + '">' + minutes + "′</button>"
      );
    }).join("");

    document.querySelectorAll("[data-duration]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeProfile().duration = Number(button.dataset.duration);
        saveState();
        renderDurations();
      });
    });
  }

  function renderWildcards() {
    $("wildcardList").innerHTML = WILDCARDS.map(function (preset) {
      return (
        '<button type="button" class="wildcard-card" data-wildcard="' + preset.id + '">' +
          "<span>" + escapeText(preset.meta) + "</span>" +
          "<strong>" + escapeText(preset.title) + "</strong>" +
          "<small>" + escapeText(preset.description) + "</small>" +
        "</button>"
      );
    }).join("");
    document.querySelectorAll("[data-wildcard]").forEach(function (button) {
      button.addEventListener("click", function () {
        var preset = WILDCARDS.find(function (item) { return item.id === button.dataset.wildcard; });
        if (!preset) return;
        activeProfile().objectives = preset.goals.slice();
        activeProfile().duration = preset.duration;
        saveState();
        renderObjectives();
        renderDurations();
        generateSession(preset.title);
      });
    });
  }

  function renderFavorites() {
    var favorites = activeProfile().favorites;
    $("favoriteCount").textContent = String(favorites.length);
    if (!favorites.length) {
      $("favoritesList").innerHTML = '<div class="empty-state">Guarda una sesión terminada y aparecerá aquí para repetirla.</div>';
      return;
    }
    $("favoritesList").innerHTML = favorites.slice().reverse().map(function (session) {
      return (
        '<button type="button" class="session-row" data-favorite-id="' + session.id + '">' +
          '<span class="row-mark" aria-hidden="true">★</span>' +
          '<span class="row-copy"><strong>' + escapeText(session.name) + "</strong>" +
          "<span>" + session.duration + " MIN · " + escapeText(session.goals.map(labelForObjective).join(" + ")) + "</span></span>" +
          '<span class="row-arrow" aria-hidden="true">›</span>' +
        "</button>"
      );
    }).join("");
    document.querySelectorAll("[data-favorite-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        var session = activeProfile().favorites.find(function (item) { return item.id === button.dataset.favoriteId; });
        if (!session) return;
        currentSession = clone(session);
        currentSession.fromFavorite = true;
        renderPreview();
        openOverlay("preview");
      });
    });
  }

  function renderHistory() {
    var history = activeProfile().history;
    $("historyCount").textContent = String(history.length);
    if (!history.length) {
      $("historyList").innerHTML = '<div class="empty-state">Tu primer entrenamiento completado quedará registrado aquí.</div>';
      return;
    }
    $("historyList").innerHTML = history.slice(0, 8).map(function (entry) {
      return (
        '<div class="history-row">' +
          '<span class="row-mark" aria-hidden="true">✓</span>' +
          '<span class="row-copy"><strong>' + escapeText(entry.name) + "</strong>" +
          "<span>" + escapeText(entry.dateLabel) + " · " + entry.actualMinutes + " MIN</span></span>" +
          '<span class="tag accent">' + escapeText(entry.goals.map(labelForObjective).join(" + ")) + "</span>" +
        "</div>"
      );
    }).join("");
  }

  function renderHome() {
    renderProfileSwitch();
    renderMaterials();
    renderObjectives();
    renderDurations();
    renderFavorites();
    renderWildcards();
    renderHistory();
    updateSoundButtons();
  }

  function selectedKettlebells(materialIds, weights) {
    return MATERIALS.filter(function (material) {
      return material.kind === "kb" && materialIds.includes(material.id) && weights.includes(material.weight);
    }).sort(function (a, b) { return a.weight - b.weight; });
  }

  function canUseExercise(exercise, materialIds) {
    if (exercise.kind === "bw") return materialIds.includes("bw");
    if (exercise.kind === "kb") {
      var kettlebells = selectedKettlebells(materialIds, exercise.weights || []);
      if ((exercise.count || 1) === 1) return kettlebells.length > 0;
      var grouped = {};
      kettlebells.forEach(function (kb) {
        grouped[kb.weight] = (grouped[kb.weight] || 0) + 1;
      });
      return Object.keys(grouped).some(function (weight) { return grouped[weight] >= exercise.count; });
    }
    return materialIds.some(function (id) {
      var material = MATERIALS.find(function (item) { return item.id === id; });
      return material && material.kind === exercise.kind;
    });
  }

  function chooseKettlebell(exercise, materialIds) {
    var kettlebells = selectedKettlebells(materialIds, exercise.weights || []);
    if ((exercise.count || 1) === 2) {
      var equalWeights = [];
      kettlebells.forEach(function (kb) {
        if (kettlebells.filter(function (other) { return other.weight === kb.weight; }).length >= 2 &&
            !equalWeights.includes(kb.weight)) {
          equalWeights.push(kb.weight);
        }
      });
      equalWeights.sort(function (a, b) { return a - b; });
      if (!equalWeights.length) return null;
      var doubleWeight = state.activeProfile === "girl" ? equalWeights[0] : equalWeights[equalWeights.length - 1];
      return "2×KB" + doubleWeight;
    }
    if (!kettlebells.length) return null;
    var uniqueWeights = kettlebells.map(function (kb) { return kb.weight; }).filter(function (weight, index, list) {
      return list.indexOf(weight) === index;
    });
    var tier = exercise.tier || 0;
    var index;
    if (tier === 0) index = 0;
    else if (tier === 1) index = Math.floor((uniqueWeights.length - 1) / 2);
    else index = uniqueWeights.length - 1;
    if (state.activeProfile === "girl") index = Math.max(0, index - 1);
    return "KB" + uniqueWeights[index];
  }

  function materialLabelForExercise(exercise, materialIds) {
    if (exercise.kind === "kb") return chooseKettlebell(exercise, materialIds);
    if (exercise.kind === "bw") return "PESO CORPORAL";
    var material = MATERIALS.find(function (item) {
      return materialIds.includes(item.id) && item.kind === exercise.kind;
    });
    return material ? material.short.toUpperCase() : "";
  }

  function prepareExercise(exercise, materialIds) {
    var copy = clone(exercise);
    copy.load = materialLabelForExercise(exercise, materialIds);
    copy.prescription = [copy.load, copy.rx].filter(Boolean).join(" · ");
    return copy;
  }

  function poolFor(phase, goal, materialIds) {
    return EXERCISES.filter(function (exercise) {
      return exercise.phase === phase &&
        (phase !== "main" || exercise.goals.includes(goal)) &&
        canUseExercise(exercise, materialIds);
    });
  }

  function pickExercises(pool, count, materialIds) {
    if (!pool.length) {
      pool = EXERCISES.filter(function (exercise) {
        return exercise.phase === "main" && exercise.kind === "bw";
      });
    }
    var sequence = [];
    var previousPattern = null;
    var deck = [];
    while (sequence.length < count) {
      if (!deck.length) deck = shuffle(pool);
      var candidateIndex = deck.findIndex(function (item) { return item.pattern !== previousPattern; });
      if (candidateIndex < 0) candidateIndex = 0;
      var candidate = deck.splice(candidateIndex, 1)[0];
      sequence.push(prepareExercise(candidate, materialIds));
      previousPattern = candidate.pattern;
    }
    return sequence;
  }

  function sessionMinuteSplit(duration) {
    if (duration === 20) return { warm: 3, cool: 2 };
    if (duration === 30) return { warm: 4, cool: 3 };
    if (duration === 45) return { warm: 5, cool: 4 };
    return { warm: 6, cool: 5 };
  }

  function makeBlock(id, label, goal, phase, minutes, workSeconds, materialIds, description) {
    var pool = poolFor(phase, goal, materialIds);
    return {
      id: id,
      label: label,
      goal: goal,
      phase: phase,
      minutes: minutes,
      work: workSeconds,
      description: description,
      exercises: pickExercises(pool, minutes, materialIds)
    };
  }

  function compileSteps(session) {
    var slots = [];
    session.blocks.forEach(function (block, blockIndex) {
      block.exercises.forEach(function (exercise) {
        slots.push({ block: block, blockIndex: blockIndex, exercise: exercise });
      });
    });
    var compiled = [];
    slots.forEach(function (slot, index) {
      var isLast = index === slots.length - 1;
      var workDuration = isLast ? 60 : slot.block.work;
      compiled.push({
        type: "work",
        duration: workDuration,
        blockIndex: slot.blockIndex,
        blockLabel: slot.block.label,
        phase: slot.block.phase,
        name: slot.exercise.name,
        prescription: slot.exercise.prescription
      });
      if (!isLast) {
        var nextSlot = slots[index + 1];
        compiled.push({
          type: "transition",
          duration: 60 - slot.block.work,
          blockIndex: slot.blockIndex,
          blockLabel: slot.block.label,
          phase: "transition",
          name: "Transición",
          prescription: "",
          nextName: nextSlot.exercise.name,
          nextPrescription: nextSlot.exercise.prescription,
          nextBlockIndex: nextSlot.blockIndex
        });
      }
    });
    return compiled;
  }

  function generateSession(nameOverride) {
    var profile = activeProfile();
    var split = sessionMinuteSplit(profile.duration);
    var mainMinutes = profile.duration - split.warm - split.cool;
    var primaryMinutes = profile.objectives.length === 2 ? Math.max(1, Math.round(mainMinutes * .65)) : mainMinutes;
    var secondaryMinutes = mainMinutes - primaryMinutes;
    var blocks = [];
    var primary = profile.objectives[0];
    var secondary = profile.objectives[1];
    var primarySettings = BLOCK_SETTINGS[primary];

    blocks.push(makeBlock(
      "warmup",
      "MOVILIDAD + ACTIVACIÓN",
      "mobility",
      "warmup",
      split.warm,
      45,
      profile.materials,
      "Preparación dinámica para todo el cuerpo."
    ));

    blocks.push(makeBlock(
      "primary",
      primarySettings.label + " · PRINCIPAL",
      primary,
      "main",
      primaryMinutes,
      primarySettings.work,
      profile.materials,
      primarySettings.description
    ));

    if (secondary && secondaryMinutes > 0) {
      var secondarySettings = BLOCK_SETTINGS[secondary];
      blocks.push(makeBlock(
        "secondary",
        secondarySettings.label + " · COMPLEMENTARIO",
        secondary,
        "main",
        secondaryMinutes,
        secondarySettings.work,
        profile.materials,
        secondarySettings.description
      ));
    }

    blocks.push(makeBlock(
      "cooldown",
      "MOVILIDAD FINAL",
      "mobility",
      "cooldown",
      split.cool,
      50,
      profile.materials,
      "Baja pulsaciones y recupera rango."
    ));

    var sessionName = nameOverride || profile.objectives.map(labelForObjective).join(" + ").toUpperCase();
    currentSession = {
      id: uid("session"),
      profile: state.activeProfile,
      name: sessionName,
      focus: "FULL BODY",
      goals: profile.objectives.slice(),
      duration: profile.duration,
      materials: profile.materials.slice(),
      createdAt: new Date().toISOString(),
      description: "Sesión full body con movilidad integrada y transiciones incluidas en el tiempo total.",
      blocks: blocks
    };
    currentSession.steps = compileSteps(currentSession);
    $("generatorHint").textContent = "";
    renderPreview();
    openOverlay("preview");
  }

  function aggregateExercises(block) {
    var map = {};
    var order = [];
    block.exercises.forEach(function (exercise) {
      var key = exercise.name + "|" + exercise.prescription;
      if (!map[key]) {
        map[key] = { name: exercise.name, prescription: exercise.prescription, count: 0 };
        order.push(key);
      }
      map[key].count += 1;
    });
    return order.map(function (key) { return map[key]; });
  }

  function isFavorite(sessionId) {
    return activeProfile().favorites.some(function (session) { return session.id === sessionId; });
  }

  function updateFavoriteButtons() {
    var favorite = currentSession ? isFavorite(currentSession.id) : false;
    $("previewFavoriteButton").textContent = favorite ? "★" : "☆";
    $("previewFavoriteButton").setAttribute("aria-pressed", String(favorite));
    $("previewFavoriteButton").setAttribute("aria-label", favorite ? "Quitar de favoritos" : "Guardar en favoritos");
    $("saveFavoriteButton").textContent = favorite ? "★ GUARDADO EN FAVORITOS" : "☆ GUARDAR FAVORITO";
    $("saveFavoriteButton").setAttribute("aria-pressed", String(favorite));
  }

  function renderPreview() {
    if (!currentSession) return;
    $("previewTitle").textContent = currentSession.focus;
    $("previewProfile").textContent = profileLabel() + " · " + currentSession.focus;
    $("previewName").textContent = currentSession.name;
    $("previewMinutes").textContent = String(currentSession.duration);
    $("previewDescription").textContent = currentSession.description;
    $("previewTags").innerHTML =
      currentSession.goals.map(function (goal, index) {
        return '<span class="tag ' + (index === 0 ? "accent" : "") + '">' + escapeText(labelForObjective(goal)) + (index === 0 ? " · PRINCIPAL" : "") + "</span>";
      }).join("") +
      '<span class="tag">' + currentSession.blocks.length + " BLOQUES</span>" +
      '<span class="tag">' + currentSession.materials.filter(function (id) { return id !== "bw"; }).length + " MATERIALES</span>";

    $("previewBlocks").innerHTML = currentSession.blocks.map(function (block) {
      var rows = aggregateExercises(block);
      return (
        '<article class="block-card">' +
          '<header class="block-card-header"><strong>' + escapeText(block.label) + "</strong>" +
          "<span>" + block.minutes + " MIN</span></header>" +
          '<ul class="block-exercises">' +
          rows.map(function (row) {
            return "<li><span>" + escapeText(row.name) + (row.count > 1 ? " ×" + row.count : "") +
              "</span><small>" + escapeText(row.prescription) + "</small></li>";
          }).join("") +
          "</ul>" +
        "</article>"
      );
    }).join("");
    updateFavoriteButtons();
  }

  function openOverlay(id) {
    var overlay = $(id);
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    $("home").setAttribute("inert", "");
    overlay.scrollTop = 0;
    var focusTarget = overlay.querySelector("button");
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function closeOverlay(id) {
    var overlay = $(id);
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    if (!$("preview").classList.contains("active") &&
        !$("player").classList.contains("active") &&
        !$("summary").classList.contains("active")) {
      $("home").removeAttribute("inert");
    }
  }

  function startSession() {
    if (!currentSession) return;
    closeOverlay("preview");
    steps = clone(currentSession.steps);
    currentStepIndex = 0;
    $("countdownFirstExercise").textContent = firstWorkStep().name;
    $("countdown").classList.add("active");
    $("countdown").setAttribute("aria-hidden", "false");
    var count = 5;
    $("countdownNumber").textContent = String(count);
    beep(520, .07);
    var countdownHandle = setInterval(function () {
      count -= 1;
      if (count > 0) {
        $("countdownNumber").textContent = String(count);
        beep(520 + (5 - count) * 70, .07);
        vibrate(20);
      } else {
        clearInterval(countdownHandle);
        $("countdown").classList.remove("active");
        $("countdown").setAttribute("aria-hidden", "true");
        beginPlayer();
      }
    }, 1000);
  }

  function firstWorkStep() {
    return steps.find(function (step) { return step.type === "work"; }) || { name: "Primera actividad" };
  }

  function beginPlayer() {
    $("player").classList.add("active");
    $("player").setAttribute("aria-hidden", "false");
    $("home").setAttribute("inert", "");
    $("playerSessionName").textContent = currentSession.name;
    renderBlockStrip();
    startedAt = Date.now();
    pausedTotal = 0;
    pauseStartedAt = 0;
    running = false;
    loadStep(0);
    setRunning(true);
    requestWakeLock();
  }

  function renderBlockStrip() {
    $("blockStrip").innerHTML = currentSession.blocks.map(function (block, index) {
      return '<button type="button" class="block-chip" data-block-jump="' + index + '">' +
        (index + 1) + " · " + escapeText(block.label.replace(" · PRINCIPAL", "").replace(" · COMPLEMENTARIO", "")) +
        "</button>";
    }).join("");
    document.querySelectorAll("[data-block-jump]").forEach(function (button) {
      button.addEventListener("click", function () {
        jumpToBlock(Number(button.dataset.blockJump));
      });
    });
  }

  function updateBlockStrip() {
    var step = steps[currentStepIndex];
    var currentBlock = step.type === "transition" && Number.isInteger(step.nextBlockIndex)
      ? step.nextBlockIndex
      : step.blockIndex;
    document.querySelectorAll("[data-block-jump]").forEach(function (button) {
      var blockIndex = Number(button.dataset.blockJump);
      if (blockIndex === currentBlock) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.classList.toggle("done", blockIndex < currentBlock);
    });
    var active = document.querySelector('[data-block-jump="' + currentBlock + '"]');
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function jumpToBlock(blockIndex) {
    var index = steps.findIndex(function (step) {
      return step.blockIndex === blockIndex && step.type === "work";
    });
    if (index < 0) return;
    currentStepIndex = index;
    loadStep(index);
    beep(620, .08);
  }

  function nextWorkAfter(index) {
    for (var position = index + 1; position < steps.length; position += 1) {
      if (steps[position].type === "work") return steps[position];
    }
    return null;
  }

  function loadStep(index) {
    var step = steps[index];
    if (!step) return;
    currentStepIndex = index;
    stepRemaining = step.duration;
    lastBeepSecond = -1;
    var stage = $("playerStage");
    stage.className = "player-stage";
    if (!running) stage.classList.add("paused");

    if (step.type === "transition") {
      stage.classList.add("transition");
      $("stageState").textContent = "TRANSICIÓN";
      $("timerCaption").textContent = "PREPARA";
      $("stageLead").textContent = "SIGUIENTE";
      $("stageExercise").textContent = step.nextName;
      $("stagePrescription").textContent = step.nextPrescription;
      $("nextExercise").textContent = "";
    } else {
      if (step.phase === "warmup" || step.phase === "cooldown") stage.classList.add("warm");
      $("stageState").textContent = step.phase === "warmup"
        ? "CALENTAMIENTO"
        : step.phase === "cooldown" ? "MOVILIDAD FINAL" : "EJERCICIO";
      $("timerCaption").textContent = "TRABAJO";
      $("stageLead").textContent = "";
      $("stageExercise").textContent = step.name;
      $("stagePrescription").textContent = step.prescription;
      var next = nextWorkAfter(index);
      $("nextExercise").textContent = next ? next.name : "FIN DE SESIÓN";
    }

    var visibleBlockIndex = step.type === "transition" && Number.isInteger(step.nextBlockIndex)
      ? step.nextBlockIndex
      : step.blockIndex;
    $("playerBlockPosition").textContent = "BLOQUE " + (visibleBlockIndex + 1) + "/" + currentSession.blocks.length;
    updateBlockStrip();
    paintPlayer();
    if (running) stepEndAt = Date.now() + stepRemaining * 1000;
    vibrate(step.type === "transition" ? 25 : [35, 45, 35]);
  }

  function completedPlannedSeconds() {
    var sum = 0;
    for (var index = 0; index < currentStepIndex; index += 1) sum += steps[index].duration;
    if (steps[currentStepIndex]) sum += steps[currentStepIndex].duration - stepRemaining;
    return sum;
  }

  function paintPlayer() {
    var step = steps[currentStepIndex];
    if (!step) return;
    $("timerValue").textContent = stepRemaining < 60 ? String(stepRemaining) : formatClock(stepRemaining);
    $("timerRingFill").style.strokeDashoffset = String(
      RING_CIRCUMFERENCE * (1 - stepRemaining / step.duration)
    );
    var done = completedPlannedSeconds();
    var total = currentSession.duration * 60;
    $("playerProgress").style.width = Math.min(100, done / total * 100) + "%";
    $("playerElapsed").textContent = formatClock(done);
    $("playerRemaining").textContent = formatClock(total - done);
  }

  function setRunning(shouldRun) {
    if (running === shouldRun) return;
    running = shouldRun;
    $("playerStage").classList.toggle("paused", !running);
    $("playPauseButton").textContent = running ? "Ⅱ" : "▶";
    $("playPauseButton").setAttribute("aria-label", running ? "Pausar sesión" : "Reanudar sesión");
    $("playPauseButton").setAttribute("aria-pressed", String(running));
    if (running) {
      if (pauseStartedAt) {
        pausedTotal += Date.now() - pauseStartedAt;
        pauseStartedAt = 0;
      }
      stepEndAt = Date.now() + stepRemaining * 1000;
      clearInterval(tickHandle);
      tickHandle = setInterval(timerLoop, 200);
    } else {
      clearInterval(tickHandle);
      tickHandle = null;
      if (!pauseStartedAt) pauseStartedAt = Date.now();
    }
  }

  function timerLoop() {
    var remaining = Math.max(0, Math.ceil((stepEndAt - Date.now()) / 1000));
    if (remaining !== stepRemaining) {
      stepRemaining = remaining;
      if (stepRemaining <= 3 && stepRemaining > 0 && stepRemaining !== lastBeepSecond) {
        beep(680, .08);
        lastBeepSecond = stepRemaining;
      }
      if (stepRemaining === 0) {
        beep(900, .16);
        goToNextStep();
        return;
      }
    }
    paintPlayer();
  }

  function goToNextStep() {
    if (currentStepIndex < steps.length - 1) {
      loadStep(currentStepIndex + 1);
    } else {
      finishSession();
    }
  }

  function goToPreviousStep() {
    if (currentStepIndex > 0) loadStep(currentStepIndex - 1);
    else loadStep(0);
  }

  function openQuitModal() {
    modalWasRunning = running;
    if (running) setRunning(false);
    $("quitModal").classList.add("active");
    $("quitModal").setAttribute("aria-hidden", "false");
    $("confirmQuitButton").focus();
  }

  function closeQuitModal() {
    $("quitModal").classList.remove("active");
    $("quitModal").setAttribute("aria-hidden", "true");
    if (modalWasRunning) setRunning(true);
    else $("quitButton").focus();
  }

  function quitSession() {
    clearInterval(tickHandle);
    tickHandle = null;
    running = false;
    $("quitModal").classList.remove("active");
    $("quitModal").setAttribute("aria-hidden", "true");
    closeOverlay("player");
    releaseWakeLock();
    renderHome();
  }

  function finishSession() {
    clearInterval(tickHandle);
    tickHandle = null;
    running = false;
    var openPauseTime = pauseStartedAt ? Date.now() - pauseStartedAt : 0;
    var actualSeconds = Math.max(1, Math.floor((Date.now() - startedAt - pausedTotal - openPauseTime) / 1000));
    var actualMinutes = Math.max(1, Math.round(actualSeconds / 60));
    var date = new Date();
    var entry = {
      id: uid("history"),
      sessionId: currentSession.id,
      name: currentSession.name,
      goals: currentSession.goals.slice(),
      plannedMinutes: currentSession.duration,
      actualMinutes: actualMinutes,
      completedAt: date.toISOString(),
      dateLabel: date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
    };
    activeProfile().history.unshift(entry);
    activeProfile().history = activeProfile().history.slice(0, 50);
    saveState();
    currentSummary = entry;
    closeOverlay("player");
    renderSummary();
    openOverlay("summary");
    releaseWakeLock();
    beepSequence();
    vibrate([70, 45, 70, 45, 120]);
  }

  function renderSummary() {
    if (!currentSession || !currentSummary) return;
    $("summarySessionName").textContent = currentSession.name;
    $("summaryDuration").textContent = String(currentSummary.actualMinutes);
    $("summaryBlocks").textContent = String(currentSession.blocks.length);
    $("summaryExercises").textContent = String(
      currentSession.blocks.reduce(function (sum, block) { return sum + block.exercises.length; }, 0)
    );
    $("summaryTags").innerHTML =
      '<span class="tag accent">' + profileLabel() + "</span>" +
      currentSession.goals.map(function (goal) {
        return '<span class="tag">' + escapeText(labelForObjective(goal)) + "</span>";
      }).join("");
    updateFavoriteButtons();
  }

  function toggleFavorite() {
    if (!currentSession) return;
    var favorites = activeProfile().favorites;
    var index = favorites.findIndex(function (session) { return session.id === currentSession.id; });
    if (index >= 0) {
      favorites.splice(index, 1);
      showToast("Sesión eliminada de favoritos.");
    } else {
      favorites.push(clone(currentSession));
      showToast("Sesión guardada en favoritos.");
    }
    saveState();
    updateFavoriteButtons();
    renderFavorites();
  }

  function summaryHome() {
    closeOverlay("summary");
    currentSummary = null;
    renderHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function repeatSession() {
    closeOverlay("summary");
    renderPreview();
    openOverlay("preview");
  }

  function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    var words = text.split(" ");
    var line = "";
    var lines = [];
    words.forEach(function (word) {
      var test = line ? line + " " + word : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach(function (item, index) {
      context.fillText(item, x, y + index * lineHeight);
    });
    return y + Math.min(lines.length, maxLines) * lineHeight;
  }

  function drawShareCard() {
    var canvas = $("shareCanvas");
    var context = canvas.getContext("2d");
    var girl = state.activeProfile === "girl";
    var accent = girl ? "#ff6fae" : "#9d6bff";
    var accent2 = girl ? "#38d4c0" : "#c5a6ff";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0a0b10";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var gradient = context.createRadialGradient(850, 110, 20, 850, 110, 560);
    gradient.addColorStop(0, girl ? "rgba(255,111,174,.34)" : "rgba(157,107,255,.34)");
    gradient.addColorStop(1, "rgba(10,11,16,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, 700);

    context.fillStyle = accent;
    context.fillRect(72, 72, 14, 1206);
    context.fillStyle = "#f4f6fb";
    context.font = "76px Impact, sans-serif";
    context.fillText("BRUTAL", 130, 170);
    context.fillStyle = accent;
    context.fillText("OS", 390, 170);
    context.fillStyle = "#abb1c2";
    context.font = "28px monospace";
    context.fillText("V3 · " + profileLabel(), 130, 218);

    context.fillStyle = "#abb1c2";
    context.font = "26px monospace";
    context.fillText("SESIÓN COMPLETADA", 130, 350);
    context.fillStyle = "#f4f6fb";
    context.font = "92px Impact, sans-serif";
    var afterTitle = wrapCanvasText(context, currentSession.name, 130, 455, 810, 98, 3);

    context.fillStyle = accent2;
    context.font = "30px monospace";
    context.fillText(currentSession.goals.map(labelForObjective).join(" + ").toUpperCase(), 130, afterTitle + 40);

    context.fillStyle = "#151822";
    context.fillRect(130, 820, 820, 240);
    context.fillStyle = "#f4f6fb";
    context.font = "110px Impact, sans-serif";
    context.fillText(String(currentSummary.actualMinutes), 190, 960);
    context.fillStyle = "#abb1c2";
    context.font = "24px monospace";
    context.fillText("MINUTOS", 190, 1005);

    context.fillStyle = "#f4f6fb";
    context.font = "110px Impact, sans-serif";
    context.fillText(String(currentSession.blocks.length), 520, 960);
    context.fillStyle = "#abb1c2";
    context.font = "24px monospace";
    context.fillText("BLOQUES", 520, 1005);

    context.fillStyle = accent;
    context.font = "34px monospace";
    context.fillText("TRABAJO HECHO.", 130, 1160);
    context.fillStyle = "#868da1";
    context.font = "24px monospace";
    context.fillText(currentSummary.dateLabel, 130, 1215);
    return canvas;
  }

  function canvasBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(resolve, "image/png", .96);
    });
  }

  async function shareSummary() {
    if (!currentSession || !currentSummary) return;
    var canvas = drawShareCard();
    var blob = await canvasBlob(canvas);
    if (!blob) {
      showToast("No se pudo crear la tarjeta.");
      return;
    }
    var fileName = "brutal-os-" + currentSummary.completedAt.slice(0, 10) + ".png";
    var file = new File([blob], fileName, { type: "image/png" });
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "BRUTAL OS · " + currentSession.name,
          text: "Entrenamiento completado · " + currentSummary.actualMinutes + " min",
          files: [file]
        });
        return;
      }
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
    var link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    showToast("Tarjeta guardada como imagen.");
  }

  function showToast(message) {
    clearTimeout(toastHandle);
    $("toast").textContent = message;
    $("toast").classList.add("show");
    toastHandle = setTimeout(function () {
      $("toast").classList.remove("show");
    }, 2500);
  }

  function beep(frequency, duration) {
    if (!soundOn) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.28, audioContext.currentTime + .02);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + .04);
    } catch (error) {}
  }

  function beepSequence() {
    [760, 980, 1240].forEach(function (frequency, index) {
      setTimeout(function () { beep(frequency, .16); }, index * 150);
    });
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function toggleSound() {
    soundOn = !soundOn;
    saveSound();
    updateSoundButtons();
    if (soundOn) beep(660, .08);
  }

  function updateSoundButtons() {
    ["soundButton", "playerSoundButton"].forEach(function (id) {
      var button = $(id);
      button.textContent = soundOn ? "◖))" : "◖×";
      button.setAttribute("aria-pressed", String(soundOn));
      button.setAttribute("aria-label", soundOn ? "Desactivar sonido" : "Activar sonido");
    });
  }

  async function requestWakeLock() {
    try {
      if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
    } catch (error) {}
  }

  function releaseWakeLock() {
    if (wakeLock) {
      wakeLock.release().catch(function () {});
      wakeLock = null;
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-profile-choice]").forEach(function (button) {
      button.addEventListener("click", function () { setProfile(button.dataset.profileChoice); });
    });
    $("selectAllMaterials").addEventListener("click", function () {
      activeProfile().materials = DEFAULT_MATERIALS.slice();
      saveState();
      renderMaterials();
    });
    $("clearMaterials").addEventListener("click", function () {
      activeProfile().materials = ["bw"];
      saveState();
      renderMaterials();
    });
    $("generateButton").addEventListener("click", function () { generateSession(); });
    document.querySelectorAll("[data-close-preview]").forEach(function (button) {
      button.addEventListener("click", function () { closeOverlay("preview"); });
    });
    $("previewFavoriteButton").addEventListener("click", toggleFavorite);
    $("startSessionButton").addEventListener("click", startSession);
    $("soundButton").addEventListener("click", toggleSound);
    $("playerSoundButton").addEventListener("click", toggleSound);
    $("playPauseButton").addEventListener("click", function () { setRunning(!running); });
    $("previousStepButton").addEventListener("click", goToPreviousStep);
    $("nextStepButton").addEventListener("click", goToNextStep);
    $("quitButton").addEventListener("click", openQuitModal);
    $("continueButton").addEventListener("click", closeQuitModal);
    $("confirmQuitButton").addEventListener("click", quitSession);
    $("quitModal").addEventListener("click", function (event) {
      if (event.target === $("quitModal")) closeQuitModal();
    });
    $("saveFavoriteButton").addEventListener("click", toggleFavorite);
    $("shareButton").addEventListener("click", shareSummary);
    $("repeatButton").addEventListener("click", repeatSession);
    $("summaryHomeButton").addEventListener("click", summaryHome);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && $("player").classList.contains("active")) requestWakeLock();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if ($("quitModal").classList.contains("active")) closeQuitModal();
        else if ($("preview").classList.contains("active")) closeOverlay("preview");
      }
    });
  }

  setDate();
  bindEvents();
  renderHome();
}());
