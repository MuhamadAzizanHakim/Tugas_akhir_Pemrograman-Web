(function () {
  // ---------------------------------------------------------------------
  // 1. BOTTOM-TO-TOP 1-SECOND (1000ms) POP-UP ENTRANCE REPLAY CONTROLLER
  // ---------------------------------------------------------------------
  const leftPhone = document.getElementById("left-phone-wrapper");
  const rightPhone = document.getElementById("right-phone-wrapper");
  const loginCard = document.getElementById("login-card");
  const replayBtn = document.getElementById("replay-animation-btn");

  function replayEntranceAnimations() {
    leftPhone.classList.remove("animate-left-phone-entrance");
    rightPhone.classList.remove("animate-right-phone-entrance");
    loginCard.classList.remove("animate-glass-card-entrance");

    // Explicitly reset both angled phones below the bottom edge (translateY(110vh))
    leftPhone.style.opacity = "0";
    leftPhone.style.transform = "translate3d(0, 110vh, 0) rotate(-18deg)";
    rightPhone.style.opacity = "0";
    rightPhone.style.transform = "translate3d(0, 110vh, 0) rotate(18deg)";

    // Force synchronous reflow so CSS keyframes restart cleanly from 0%
    void loginCard.offsetWidth;

    leftPhone.style.opacity = "";
    leftPhone.style.transform = "";
    rightPhone.style.opacity = "";
    rightPhone.style.transform = "";

    leftPhone.classList.add("animate-left-phone-entrance");
    rightPhone.classList.add("animate-right-phone-entrance");
    loginCard.classList.add("animate-glass-card-entrance");
  }

  replayBtn.addEventListener("click", replayEntranceAnimations);

  // ---------------------------------------------------------------------
  // 2. 6-DIGIT PIN INPUT BOXES (Masked by default, Auto-advance, Paste)
  // ---------------------------------------------------------------------
  const pinInputs = Array.from(
    document.querySelectorAll(".pin-digit-input"),
  );
  const togglePinBtn = document.getElementById("toggle-pin-visibility");
  const togglePinLabel = document.getElementById("toggle-pin-label");
  let isPinMasked = true; // Masked with bullet dots by default

  function getPinValue() {
    return pinInputs.map((input) => input.value.trim()).join("");
  }

  function setPinValue(sixDigits) {
    const cleanDigits = (sixDigits || "").replace(/\D/g, "").slice(0, 6);
    pinInputs.forEach((input, idx) => {
      input.value = cleanDigits[idx] || "";
    });
    syncRightPhoneAssistant();
  }

  pinInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      hideErrorBanner();
      const raw = e.target.value.replace(/\D/g, "");
      if (!raw) {
        e.target.value = "";
        syncRightPhoneAssistant();
        return;
      }
      if (raw.length > 1) {
        setPinValue(raw);
        const focusIdx = Math.min(raw.length, 5);
        pinInputs[focusIdx].focus();
        return;
      }
      e.target.value = raw.charAt(0);
      syncRightPhoneAssistant();
      if (index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        if (input.value === "" && index > 0) {
          pinInputs[index - 1].value = "";
          pinInputs[index - 1].focus();
          syncRightPhoneAssistant();
          e.preventDefault();
        } else {
          input.value = "";
          setTimeout(syncRightPhoneAssistant, 0);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        pinInputs[index - 1].focus();
      } else if (e.key === "ArrowRight" && index < pinInputs.length - 1) {
        e.preventDefault();
        pinInputs[index + 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      hideErrorBanner();
      const pastedText = (
        e.clipboardData || window.clipboardData
      ).getData("text");
      const digits = pastedText.replace(/\D/g, "").slice(0, 6);
      if (!digits) return;
      setPinValue(digits);
      const nextFocus = Math.min(digits.length, 5);
      pinInputs[nextFocus].focus();
    });

    input.addEventListener("focus", () => {
      input.select();
    });
  });

  togglePinBtn.addEventListener("click", () => {
    isPinMasked = !isPinMasked;
    pinInputs.forEach((box) => {
      box.type = isPinMasked ? "password" : "text";
    });
    togglePinLabel.textContent = isPinMasked
      ? "Tampilkan PIN"
      : "Sembunyikan PIN";
  });

  // ---------------------------------------------------------------------
  // 3. PASSWORD INPUT ("Kata Sandi") VISIBILITY & CAPS LOCK WARNING
  // ---------------------------------------------------------------------
  const passwordInput = document.getElementById("password-input");
  const togglePasswordBtn = document.getElementById(
    "toggle-password-btn",
  );
  const eyeOpenIcon = document.getElementById("eye-open-icon");
  const eyeClosedIcon = document.getElementById("eye-closed-icon");
  const capsLockWarning = document.getElementById("caps-lock-warning");

  togglePasswordBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeOpenIcon.classList.toggle("hidden", isHidden);
    eyeClosedIcon.classList.toggle("hidden", !isHidden);
  });

  function checkCapsLock(e) {
    if (!e.getModifierState) return;
    const capsOn = e.getModifierState("CapsLock");
    capsLockWarning.classList.toggle("hidden", !capsOn);
    capsLockWarning.classList.toggle("inline-flex", capsOn);
  }

  passwordInput.addEventListener("keydown", checkCapsLock);
  passwordInput.addEventListener("keyup", checkCapsLock);
  passwordInput.addEventListener("input", () => {
    hideErrorBanner();
    syncRightPhoneAssistant();
  });

  // ---------------------------------------------------------------------
  // 4. LIVE CONVERSATIONAL ASSISTANT SYNC ON RIGHT PHONE + FORM SUBMIT
  // ---------------------------------------------------------------------
  const loginForm = document.getElementById("login-form");
  const authenticatedView = document.getElementById("authenticated-view");
  const errorBanner = document.getElementById("form-error-banner");
  const errorText = document.getElementById("form-error-text");
  const fillDemoBtn = document.getElementById("fill-demo-btn");
  const submitBtn = document.getElementById("submit-login-btn");
  const submitSpinner = document.getElementById("submit-spinner");
  const submitBtnText = document.getElementById("submit-btn-text");
  const logoutResetBtn = document.getElementById("logout-reset-btn");
  const cardShieldBadge = document.getElementById("card-shield-badge");

  // Right Phone live conversational elements
  const rightLivePill = document.getElementById("right-phone-live-pill");
  const rightLiveDot = document.getElementById("right-phone-live-dot");
  const rightLiveBadgeText = document.getElementById(
    "right-phone-live-badge-text",
  );
  const rightAssistantAvatar = document.getElementById(
    "right-assistant-avatar",
  );
  const rightAssistantBubble = document.getElementById(
    "right-assistant-bubble",
  );
  const rightAssistantTitle = document.getElementById(
    "right-assistant-title",
  );
  const rightAssistantMessage = document.getElementById(
    "right-assistant-message",
  );
  const rightStepPin = document.getElementById("right-step-pin");
  const rightStepPass = document.getElementById("right-step-pass");
  const rightSessionId = document.getElementById("right-session-id");
  const sessionTokenCode = document.getElementById("session-token-code");
  const sessionLoginTime = document.getElementById("session-login-time");

  const demoCredentials = {
    pin: "250761",
    password: "HakimPTI#2026",
  };
  let isAuthenticated = false;

  function syncRightPhoneAssistant() {
    if (isAuthenticated) return;

    const pinLen = getPinValue().length;
    const passLen = passwordInput.value.length;

    rightStepPin.textContent = `${pinLen} / 6 digit`;
    rightStepPin.className =
      pinLen === 6
        ? "font-mono font-semibold text-emerald-300"
        : "font-mono font-semibold text-amber-300";

    if (passLen === 0) {
      rightStepPass.textContent = "Belum diisi";
      rightStepPass.className = "font-mono font-semibold text-slate-300";
    } else if (passLen < 8) {
      rightStepPass.textContent = `${passLen}/8 karakter`;
      rightStepPass.className = "font-mono font-semibold text-amber-300";
    } else {
      rightStepPass.textContent = "Terpenuhi";
      rightStepPass.className =
        "font-mono font-semibold text-emerald-300";
    }

    if (pinLen === 0 && passLen === 0) {
      rightAssistantTitle.textContent = "Menunggu 6-Digit PIN";
      rightAssistantMessage.textContent =
        "Silakan masukkan 6 digit angka PIN keamanan Anda pada kartu kaca di tengah layar.";
      rightSessionId.textContent = "#MENUNGGU-PIN";
    } else if (pinLen < 6) {
      rightAssistantTitle.textContent = `Mengisi PIN (${pinLen}/6 Digit)`;
      rightAssistantMessage.textContent =
        "Lanjutkan memasukkan sisa digit PIN keamanan Anda sebelum memverifikasi kata sandi.";
      rightSessionId.textContent = "#INPUT-PIN";
    } else if (passLen < 8) {
      rightAssistantTitle.textContent = "PIN Lengkap • Verifikasi Sandi";
      rightAssistantMessage.textContent =
        "6-digit PIN telah terisi. Masukkan kata sandi minimal 8 karakter untuk melanjutkan.";
      rightSessionId.textContent = "#VERIFIKASI-SANDI";
    } else {
      rightAssistantTitle.textContent = "Siap Mengaktifkan Sesi";
      rightAssistantMessage.textContent =
        "PIN dan kata sandi telah lengkap. Tekan tombol Masuk untuk membuka akses portal.";
      rightSessionId.textContent = "#SIAP-MASUK";
    }
  }

  function showErrorBanner(message) {
    errorText.textContent = message;
    errorBanner.classList.remove("hidden");
    loginCard.classList.remove("animate-shake");
    void loginCard.offsetWidth;
    loginCard.classList.add("animate-shake");
  }

  function hideErrorBanner() {
    errorBanner.classList.add("hidden");
  }

  fillDemoBtn.addEventListener("click", () => {
    hideErrorBanner();
    setPinValue("250761");
    passwordInput.value = "HakimPTI#2026";
    syncRightPhoneAssistant();
    pinInputs[5].focus();
  });

  function generateSessionToken() {
    const hex = () =>
      Math.floor(1000 + Math.random() * 9000)
        .toString(16)
        .toUpperCase();
    return `SES-${hex()}-${hex()}-ID`;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideErrorBanner();

    const pin = getPinValue();
    const password = passwordInput.value;

    if (pin.length < 6 || !/^\d{6}$/.test(pin)) {
      showErrorBanner(
        "Masukkan lengkap 6-digit angka PIN keamanan Anda.",
      );
      const firstEmpty =
        pinInputs.find((inp) => !inp.value) || pinInputs[0];
      firstEmpty.focus();
      return;
    }

    if (!password || password.length < 8) {
      showErrorBanner("Kata sandi wajib diisi minimal 8 karakter.");
      passwordInput.focus();
      return;
    }

    if (pin !== demoCredentials.pin || password !== demoCredentials.password) {
      showErrorBanner("PIN atau kata sandi salah. Silakan coba kembali.");
      return;
    }

    submitBtn.disabled = true;
    submitSpinner.classList.remove("hidden");
    submitBtnText.textContent = "Memverifikasi...";

    setTimeout(() => {
      try {
        sessionStorage.setItem("teduhalamAdminAuthenticated", "true");
      } catch {
        submitBtn.disabled = false;
        submitSpinner.classList.add("hidden");
        submitBtnText.textContent = "Masuk";
        showErrorBanner(
          "Sesi login tidak dapat disimpan. Izinkan penyimpanan di browser Anda.",
        );
        return;
      }

      isAuthenticated = true;
      submitBtn.disabled = false;
      submitSpinner.classList.add("hidden");
      submitBtnText.textContent = "Masuk";

      const token = generateSessionToken();
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      sessionTokenCode.textContent = token;
      sessionLoginTime.textContent = `${formattedTime} WIB`;

      // Transition center Apple Glass card to Verified State
      loginForm.classList.add("hidden");
      authenticatedView.classList.remove("hidden");
      cardShieldBadge.className =
        "mx-auto w-12 h-12 rounded-2xl bg-emerald-500 text-white shadow-sm flex items-center justify-center transition-all duration-300";

      // Update Right Phone Conversational Assistant to "Autentikasi Berhasil • Sesi Aktif"
      rightLivePill.className =
        "inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-700 transition-colors duration-300";
      rightLiveDot.className = "w-1.5 h-1.5 rounded-full bg-[#10B981]";
      rightLiveBadgeText.textContent = "Sesi Aktif";

      rightAssistantAvatar.className =
        "w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300";
      rightAssistantBubble.className =
        "flex-1 rounded-2xl rounded-tl-sm bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3.5 shadow-sm transition-all duration-300";
      rightAssistantTitle.textContent =
        "Autentikasi Berhasil • Sesi Aktif";
      rightAssistantMessage.textContent =
        "PIN 6-digit dan kata sandi Anda telah terverifikasi. Sesi portal kini aktif sepenuhnya.";
      rightSessionId.textContent = token;

      window.location.replace("./admin.html");
    }, 550);
  });

  logoutResetBtn.addEventListener("click", () => {
    isAuthenticated = false;
    sessionStorage.removeItem("teduhalamAdminAuthenticated");
    setPinValue("");
    passwordInput.value = "";
    authenticatedView.classList.add("hidden");
    loginForm.classList.remove("hidden");
    cardShieldBadge.className =
      "mx-auto w-12 h-12 rounded-2xl bg-white/80 border border-white shadow-sm text-[#0F172A] flex items-center justify-center transition-all duration-300";

    // Reset Right Phone Assistant back to waiting state
    rightLivePill.className =
      "inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9.5px] font-semibold text-amber-700 transition-colors duration-300";
    rightLiveDot.className =
      "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse";
    rightLiveBadgeText.textContent = "Menunggu";

    rightAssistantAvatar.className =
      "w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300";
    rightAssistantBubble.className =
      "flex-1 rounded-2xl rounded-tl-sm bg-[#1E293B] text-white p-3.5 shadow-sm transition-all duration-300";

    syncRightPhoneAssistant();
    pinInputs[0].focus();
  });

  // ---------------------------------------------------------------------
  // 5. OPTIONAL CUSTOM LOCAL PHONE IMAGE LOADER ("Ganti Gambar HP")
  // ---------------------------------------------------------------------
  const toggleAssetBtn = document.getElementById("toggle-asset-panel");
  const assetPanel = document.getElementById("asset-panel");
  const uploadLeft = document.getElementById("upload-left-phone");
  const uploadRight = document.getElementById("upload-right-phone");
  const leftCustomImg = document.getElementById("left-custom-img");
  const rightCustomImg = document.getElementById("right-custom-img");
  const leftBuiltIn = document.getElementById("left-built-in-phone");
  const rightBuiltIn = document.getElementById("right-built-in-phone");
  const blendToggle = document.getElementById("blend-toggle");
  const resetPhonesBtn = document.getElementById("reset-phones-btn");

  toggleAssetBtn.addEventListener("click", () => {
    assetPanel.classList.toggle("hidden");
  });

  function bindPhoneUploader(inputEl, imgEl, builtInEl) {
    inputEl.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      imgEl.src = URL.createObjectURL(file);
      imgEl.classList.remove("hidden");
      builtInEl.classList.add("hidden");
    });
  }

  bindPhoneUploader(uploadLeft, leftCustomImg, leftBuiltIn);
  bindPhoneUploader(uploadRight, rightCustomImg, rightBuiltIn);

  blendToggle.addEventListener("change", () => {
    leftCustomImg.classList.toggle(
      "blend-screen-mode",
      blendToggle.checked,
    );
    rightCustomImg.classList.toggle(
      "blend-screen-mode",
      blendToggle.checked,
    );
  });

  resetPhonesBtn.addEventListener("click", () => {
    uploadLeft.value = "";
    uploadRight.value = "";
    leftCustomImg.classList.add("hidden");
    rightCustomImg.classList.add("hidden");
    leftBuiltIn.classList.remove("hidden");
    rightBuiltIn.classList.remove("hidden");
  });
})();
