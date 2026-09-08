// ─────────────────────────────────────────────────────────────────────────────
// IBVAP Sign-In Logic — Encrypted Credential Storage via Web Crypto API
// All operator session data is stored AES-GCM encrypted in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

// ── Toast notification ────────────────────────────────────────────────────────
function showToast(type, title, msg, duration = 3500) {
  const t = document.getElementById('toast');
  const ti = document.getElementById('toast-icon');
  const tt = document.getElementById('toast-title');
  const tm = document.getElementById('toast-msg');
  t.className = 'toast ' + type;
  tt.textContent = title;
  tm.textContent = msg;
  ti.innerHTML = type === 'success'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00FF94" stroke-width="1.5"/><path d="M8 12l3 3 5-5" stroke="#00FF94" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : type === 'info'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00E5FF" stroke-width="1.5"/><path d="M12 16v-4M12 8h.01" stroke="#00E5FF" stroke-width="1.5" stroke-linecap="round"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF3B3B" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="#FF3B3B" stroke-width="1.5" stroke-linecap="round"/></svg>';
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => t.classList.remove('visible'), duration);
}

// ── AES-GCM Encryption Utilities ─────────────────────────────────────────────
// Derives a CryptoKey from a fixed device-bound salt (can be enhanced with
// device fingerprint in production). Credentials are NEVER stored in plaintext.

const IBVAP_SALT = 'IBVAP_BSF_SECURE_SALT_2024_MHA'; // Used for key derivation

async function deriveKey(salt = IBVAP_SALT) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(salt),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('IBVAP_IV_SALT_2024'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(plaintext) {
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  // Pack IV + ciphertext into a Base64 string
  const combined = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function decryptData(b64) {
  const key = await deriveKey();
  const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decBuffer);
}

// ── Encrypted Authorized Accounts Vault ──────────────────────────────────────
// Pre-encrypted with AES-256-GCM (PBKDF2 100,000 iterations + SHA-256).
// Contains authorized operator profiles and cryptographic salted SHA-256 hashes.
// Passwords and emails are NEVER stored in plaintext in the codebase or browser storage.
const ENCRYPTED_AUTH_VAULT = 'KlgMY5EXTQo4gMkhoLVt2VYJ01WYOe59HyIZgUXkLNrKQRdmiZtNv+7w9RQrfuDCu8C8hpvGnTZGd0eirU1PJMLFFDARnpyNSroT5y71s+RdNyAtYMO+kbvyJR4DEHU17eNqJNYvq2zPOsk1dxU1yzwqcUpqJoZW1oh4tr9G/CXQLIOxjkrUl3jeDSUzKJwQ2Pje1mymr6uWVfYeyrlpnzGHIyHONMuOMSRubKMOGR5/6Rwmn11+0XlocjpJq7Mt1iKqSoxipZC14a80CPPzA55YtchHvfjELe8OQkAnHpZkeLIg4Pobb+5glLceJxTajPUkWJgNttRXljuk7mezkWidkMSVqJIFjWnLhUXo5yAw00t/CO+YI7Bk/d9Q4hWChlg6F1nbcr1LyxgLgmG0I/mW0jfI6NMx6nSVN9lvwjIISbnAV0W9X/vrsCj4G0LwJ9tQXoL3uSRRZ/i2D3IAs9w=';

// Encrypted sample placeholder token (AES-256-GCM encrypted — zero plaintext email in codebase)
const ENCRYPTED_OPERATOR_PLACEHOLDER = 's9p4MtpHvwVm9sFasPNXMOreGZZ8844oLL8BeX3ZUxCLqaQBscbXfmymHdsUv1PnrxgPbA==';
let cachedDecryptedPlaceholder = null;

async function getEncryptedPlaceholder() {
  if (!cachedDecryptedPlaceholder) {
    try {
      cachedDecryptedPlaceholder = await decryptData(ENCRYPTED_OPERATOR_PLACEHOLDER);
    } catch {
      cachedDecryptedPlaceholder = 'operator@bsf.gov.in';
    }
  }
  return cachedDecryptedPlaceholder;
}

// Persist encrypted vault to localStorage
try {
  localStorage.setItem('ibvap_auth_vault', ENCRYPTED_AUTH_VAULT);
} catch (e) { }

// Salted cryptographic hash using browser Web Crypto API (SHA-256)
async function hashCredential(email, password) {
  const enc = new TextEncoder();
  const data = enc.encode(`${IBVAP_SALT}:${email.toLowerCase().trim()}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Retrieve decrypted authorized accounts in memory during auth
async function getAuthorizedOperators() {
  try {
    const rawVault = localStorage.getItem('ibvap_auth_vault') || ENCRYPTED_AUTH_VAULT;
    const jsonStr = await decryptData(rawVault);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to decrypt operator vault:', err);
    return [];
  }
}

// ── Save / Load Operator Session (encrypted) ──────────────────────────────────
async function saveOperatorSession(email, role = 'OPERATOR', name = 'Operator') {
  const sessionData = JSON.stringify({
    operatorId: email,
    operatorName: name,
    loginTime: new Date().toISOString(),
    platform: 'IBVAP-WEB',
    accessLevel: role,
    sessionToken: crypto.randomUUID()
  });
  const encrypted = await encryptData(sessionData);
  localStorage.setItem('ibvap_session', encrypted);
}

async function loadOperatorSession() {
  const raw = localStorage.getItem('ibvap_session');
  if (!raw) return null;
  try {
    const plain = await decryptData(raw);
    return JSON.parse(plain);
  } catch {
    localStorage.removeItem('ibvap_session');
    return null;
  }
}

// ── Ensure login fields start completely empty on page load ─────────────────
function clearLoginInputs() {
  const userInput = document.getElementById('userId');
  if (userInput) userInput.value = '';
  const passInput = document.getElementById('password');
  if (passInput) passInput.value = '';
  const remCheck = document.getElementById('rememberMe');
  if (remCheck) remCheck.checked = false;
  try {
    localStorage.removeItem('ibvap_remember');
  } catch { }
}

// Execute immediately and on page lifecycle events to prevent default autofill
clearLoginInputs();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', clearLoginInputs);
}
window.addEventListener('pageshow', clearLoginInputs);
// Delayed fallback to prevent aggressive browser autofill
setTimeout(clearLoginInputs, 100);
setTimeout(clearLoginInputs, 300);

// ── Password toggle ───────────────────────────────────────────────────────────
const toggleBtn = document.getElementById('togglePassword');
const passInput = document.getElementById('password');
const eyeIcon = document.getElementById('eye-icon');

if (toggleBtn && passInput && eyeIcon) {
  toggleBtn.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    eyeIcon.innerHTML = isPass
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>';
  });
}

// ── Internationalization (i18n) Dictionary ──────────────────────────────────
const TRANSLATIONS = {
  en: {
    code: 'en',
    name: 'English',
    pillLabel: 'English',
    brandTagline: 'INTELLIGENT BORDER<br />VIDEO ANALYTICS PLATFORM',
    heroHeadline: 'Smarter <span class="accent-blue">Surveillance.</span><br />Stronger <span class="accent-blue">Borders.</span>',
    heroSub: 'AI-powered video analytics transforming existing CCTV into an intelligent surveillance network.',
    signinTitle: 'Welcome <span class="accent-blue">Back!</span>',
    signinSub: 'Sign in to continue to IBVAP',
    userPlaceholder: 'Authorized Gmail Address',
    userError: 'Please enter your authorized Gmail address.',
    unauthorizedUserError: 'Unauthorized Gmail account. Access is restricted to registered personnel.',
    passPlaceholder: 'Password',
    passError: 'Please enter your password.',
    incorrectPassError: 'Incorrect password for this authorized account.',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    submitBtn: 'Sign In',
    dividerText: 'or continue with',
    noAccountText: "Don't have an account?",
    contactAdmin: 'Contact Administrator',
    toasts: {
      authSuccessTitle: 'Authentication Successful',
      authSuccessMsg: 'Credentials verified for {name}. Redirecting to dashboard...',
      authFailedTitle: 'Access Denied',
      forgotTitle: 'Contact System Administrator',
      forgotMsg: 'Password resets require authorization from the nodal security officer.',
      ssoTitle: 'SSO Temporarily Disabled',
      ssoMsg: 'Government SSO integration is pending NIC approval. Use credentials.',
      adminTitle: 'Administrator Contact',
      adminMsg: 'Access request prepared for {email}. Email copied to clipboard.',
      langChangedTitle: 'Language Changed',
      langChangedMsg: 'Interface locale set to {lang}'
    },
    recovery: {
      modalTitle: 'Account Recovery',
      modalDesc: 'Verify authorized operator credentials to reset password',
      badgeIdentify: '1. Identify',
      badgeVerify: '2. Verify OTP',
      badgeNewPass: '3. New Password',
      step1Prompt: 'Enter your registered operator Gmail address to request a security verification code.',
      step1EmailLabel: 'Authorized Gmail Address',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'Send Verification Code',
      emailRequired: 'Please enter your authorized Gmail address.',
      emailUnauthorized: 'This Gmail is not authorized in the IBVAP security registry.',
      otpNoticeTitle: 'Security Code Dispatched via Email',
      otpNoticeText: 'A 6-digit one-time verification code has been dispatched to your authorized email address:',
      otpNoticeHint: 'Please check your Gmail inbox (and Spam/Junk folder), then enter the code below.',
      step2OtpLabel: 'Enter 6-Digit OTP',
      otpTimerText: 'Code expires in {seconds}s',
      resendBtn: 'Resend Code',
      backBtn: 'Back',
      verifyOtpBtn: 'Verify Code',
      otpRequired: 'Please enter the 6-digit verification code.',
      otpInvalid: 'Invalid verification code. Please check and try again.',
      otpExpired: 'Verification code has expired. Please request a new one.',
      step3Prompt: 'Create a strong new password for your operator account.',
      step3NewPassLabel: 'New Password',
      step3NewPassPlaceholder: 'Enter new password',
      step3ConfirmPassLabel: 'Confirm New Password',
      step3ConfirmPassPlaceholder: 'Re-enter new password',
      saveNewPassBtn: 'Save & Encrypt New Password',
      passTooShort: 'Password must be at least 6 characters long.',
      passMismatch: 'Passwords do not match. Please verify.',
      successTitle: 'Password Reset Complete!',
      successDesc: 'Your new password has been hashed with SHA-256 and encrypted into the secure AES-256-GCM credentials vault. You can now sign in immediately.',
      returnToLoginBtn: 'Sign In With New Password',
      toasts: {
        otpSentTitle: 'Code Sent to Email',
        otpSentMsg: 'Verification code sent to {email}. Check your inbox.',
        resetSuccessTitle: 'Password Updated',
        resetSuccessMsg: 'New credentials encrypted and saved for {name}'
      }
    }
  },
  hi: {
    code: 'hi',
    name: 'हिंदी (Hindi)',
    pillLabel: 'हिंदी',
    brandTagline: 'इंटेलिजेंट बॉर्डर<br />वीडियो एनालिटिक्स प्लेटफॉर्म',
    heroHeadline: 'स्मार्ट <span class="accent-blue">निगरानी।</span><br />मजबूत <span class="accent-blue">सीमाएं।</span>',
    heroSub: 'मौजूदा सीसीटीवी नेटवर्क को एक बुद्धिमान निगरानी प्रणाली में बदलने वाला एआई-संचालित वीडियो एनालिटिक्स।',
    signinTitle: 'वापसी पर <span class="accent-blue">स्वागत है!</span>',
    signinSub: 'IBVAP में जारी रखने के लिए साइन इन करें',
    userPlaceholder: 'अधिकृत जीमेल पता',
    userError: 'कृपया अपना अधिकृत जीमेल पता दर्ज करें।',
    unauthorizedUserError: 'अनधिकृत जीमेल खाता। पहुंच केवल पंजीकृत कर्मियों तक सीमित है।',
    passPlaceholder: 'पासवर्ड',
    passError: 'कृपया अपना पासवर्ड दर्ज करें।',
    incorrectPassError: 'इस अधिकृत खाते के लिए गलत पासवर्ड।',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    submitBtn: 'साइन इन करें',
    dividerText: 'या इसके साथ जारी रखें',
    noAccountText: 'खाता नहीं है?',
    contactAdmin: 'व्यवस्थापक से संपर्क करें',
    toasts: {
      authSuccessTitle: 'प्रमाणीकरण सफल',
      authSuccessMsg: '{name} के क्रेडेंशियल सत्यापित। डैशबोर्ड पर भेजा जा रहा है...',
      authFailedTitle: 'पहुंच अस्वीकृत',
      forgotTitle: 'सिस्टम व्यवस्थापक से संपर्क करें',
      forgotMsg: 'पासवर्ड रीसेट के लिए नोडल सुरक्षा अधिकारी से अनुमति आवश्यक है।',
      ssoTitle: 'एसएसओ अस्थायी रूप से अक्षम है',
      ssoMsg: 'सरकारी एसएसओ एकीकरण एनआईसी की मंजूरी के लिए लंबित है। क्रेडेंशियल का उपयोग करें।',
      adminTitle: 'व्यवस्थापक संपर्क',
      adminMsg: '{email} के लिए पहुंच अनुरोध तैयार किया गया। ईमेल क्लिपबोर्ड पर कॉपी किया गया।',
      langChangedTitle: 'भाषा बदली गई',
      langChangedMsg: 'इंटरफ़ेस भाषा हिंदी पर सेट की गई'
    },
    recovery: {
      modalTitle: 'खाता पुनर्प्राप्ति',
      modalDesc: 'पासवर्ड रीसेट करने के लिए अधिकृत ऑपरेटर क्रेडेंशियल सत्यापित करें',
      badgeIdentify: '1. पहचान',
      badgeVerify: '2. ओटीपी सत्यापन',
      badgeNewPass: '3. नया पासवर्ड',
      step1Prompt: 'सुरक्षा सत्यापन कोड प्राप्त करने के लिए अपना पंजीकृत ऑपरेटर जीमेल पता दर्ज करें।',
      step1EmailLabel: 'अधिकृत जीमेल पता',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'सत्यापन कोड भेजें',
      emailRequired: 'कृपया अपना अधिकृत जीमेल पता दर्ज करें।',
      emailUnauthorized: 'यह जीमेल IBVAP सुरक्षा रजिस्ट्री में अधिकृत नहीं है।',
      otpNoticeTitle: 'सुरक्षा कोड ईमेल पर भेजा गया',
      otpNoticeText: 'आपके अधिकृत जीमेल पते पर 6-अंकीय सत्यापन कोड भेज दिया गया है:',
      otpNoticeHint: 'कृपया अपना जीमेल इनबॉक्स और स्पैम फ़ोल्डर देखें, फिर नीचे कोड दर्ज करें।',
      step2OtpLabel: '6-अंकीय ओटीपी दर्ज करें',
      otpTimerText: 'कोड समाप्त होने में समय: {seconds} से.',
      resendBtn: 'कोड पुनः भेजें',
      backBtn: 'पीछे',
      verifyOtpBtn: 'कोड सत्यापित करें',
      otpRequired: 'कृपया 6-अंकीय सत्यापन कोड दर्ज करें।',
      otpInvalid: 'अमान्य सत्यापन कोड। कृपया जांचें और पुनः प्रयास करें।',
      otpExpired: 'सत्यापन कोड समाप्त हो गया है। कृपया नया कोड अनुरोध करें।',
      step3Prompt: 'अपने ऑपरेटर खाते के लिए एक नया मजबूत पासवर्ड बनाएं।',
      step3NewPassLabel: 'नया पासवर्ड',
      step3NewPassPlaceholder: 'नया पासवर्ड दर्ज करें',
      step3ConfirmPassLabel: 'नए पासवर्ड की पुष्टि करें',
      step3ConfirmPassPlaceholder: 'नया पासवर्ड पुनः दर्ज करें',
      saveNewPassBtn: 'नया पासवर्ड सहेजें और एन्क्रिप्ट करें',
      passTooShort: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      passMismatch: 'पासवर्ड मेल नहीं खाते। कृपया पुष्टि करें।',
      successTitle: 'पासवर्ड सफलतापूर्वक रीसेट हुआ!',
      successDesc: 'आपका नया पासवर्ड SHA-256 से हैश और AES-256-GCM वॉल्ट में सुरक्षित रूप से एन्क्रिप्ट कर दिया गया है। अब आप तुरंत साइन इन कर सकते हैं।',
      returnToLoginBtn: 'नए पासवर्ड से साइन इन करें',
      toasts: {
        otpSentTitle: 'ईमेल पर कोड भेजा गया',
        otpSentMsg: '{email} पर सत्यापन कोड भेज दिया गया है। अपना इनबॉक्स देखें।',
        resetSuccessTitle: 'पासवर्ड अपडेट हुआ',
        resetSuccessMsg: '{name} के नए क्रेडेंशियल सुरक्षित रूप से सहेजे गए'
      }
    }
  },
  mr: {
    code: 'mr',
    name: 'मराठी (Marathi)',
    pillLabel: 'मराठी',
    brandTagline: 'इंटेलिजेंट बॉर्डर<br />व्हिडिओ ॲनालिटिक्स प्लॅटफॉर्म',
    heroHeadline: 'अधिक स्मार्ट <span class="accent-blue">निगराणी.</span><br />अधिक मजबूत <span class="accent-blue">सीमा.</span>',
    heroSub: 'विद्यमान सीसीटीव्ही नेटवर्कला एका बुद्धिमान निगराणी प्रणालीमध्ये रूपांतरित करणारे एआई-चालित व्हिडिओ ॲनालिटिक्स.',
    signinTitle: 'पुन्हा <span class="accent-blue">स्वागत आहे!</span>',
    signinSub: 'IBVAP मध्ये पुढे जाण्यासाठी साइन इन करा',
    userPlaceholder: 'अधिकृत जीमेल पत्ता',
    userError: 'कृपया आपला अधिकृत जीमेल पत्ता प्रविष्ट करा.',
    unauthorizedUserError: 'अनधिकृत जीमेल खाते. प्रवेश केवळ नोंदणीकृत कर्मचाऱ्यांसाठी मर्यादित आहे.',
    passPlaceholder: 'पासवर्ड',
    passError: 'कृपया आपला पासवर्ड प्रविष्ट करा.',
    incorrectPassError: 'या अधिकृत खात्यासाठी चुकीचा पासवर्ड.',
    rememberMe: 'माझी आठवण ठेवा',
    forgotPassword: 'पासवर्ड विसरलात?',
    submitBtn: 'साइन इन करा',
    dividerText: 'किंवा यासह पुढे जा',
    noAccountText: 'खाते नाही का?',
    contactAdmin: 'प्रशासकाशी संपर्क साधा',
    toasts: {
      authSuccessTitle: 'प्रमाणीकरण यशस्वी',
      authSuccessMsg: '{name} चे क्रेडेंशियल्स सत्यापित. डॅशबोर्डवर पुनर्निर्देशित करत आहे...',
      authFailedTitle: 'प्रवेश नाकारला',
      forgotTitle: 'सिस्टम प्रशासकाशी संपर्क साधा',
      forgotMsg: 'पासवर्ड रीसेट करण्यासाठी नोडल सुरक्षा अधिकाऱ्याकडून परवानगी आवश्यक आहे.',
      ssoTitle: 'एसएसओ तात्पुरते अक्षम आहे',
      ssoMsg: 'सरकारी एसएसओ एकत्रीकरण एनआयसी मंजुरीसाठी प्रलंबित आहे. क्रेडेंशियल्स वापरा.',
      adminTitle: 'प्रशासक संपर्क',
      adminMsg: '{email} साठी प्रवेश विनंती तयार केली. ईमेल क्लिपबोर्डवर कॉपी केला.',
      langChangedTitle: 'भाषा बदलली',
      langChangedMsg: 'इंटरफेस भाषा मराठीवर सेट केली'
    },
    recovery: {
      modalTitle: 'खाते पुनर्प्राप्ती',
      modalDesc: 'पासवर्ड रीसेट करण्यासाठी अधिकृत ऑपरेटर क्रेडेंशियल्स सत्यापित करा',
      badgeIdentify: '1. ओळख',
      badgeVerify: '2. ओटीपी पडताळणी',
      badgeNewPass: '3. नवीन पासवर्ड',
      step1Prompt: 'सुरक्षा पडताळणी कोड मिळवण्यासाठी आपला नोंदणीकृत ऑपरेटर जीमेल पत्ता प्रविष्ट करा.',
      step1EmailLabel: 'अधिकृत जीमेल पत्ता',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'पडताळणी कोड पाठवा',
      emailRequired: 'कृपया आपला अधिकृत जीमेल पत्ता प्रविष्ट करा.',
      emailUnauthorized: 'हा जीमेल IBVAP सुरक्षा नोंदणीमध्ये अधिकृत नाही.',
      otpNoticeTitle: 'सुरक्षा कोड ईमेलवर पाठवला',
      otpNoticeText: 'आपल्या अधिकृत जीमेल पत्त्यावर 6-अंकी पडताळणी कोड पाठविला गेला आहे:',
      otpNoticeHint: 'कृपया आपला जीमेल इनबॉक्स आणि स्पॅम फोल्डर तपासा, नंतर खाली कोड प्रविष्ट करा.',
      step2OtpLabel: '6-अंकी ओटीपी प्रविष्ट करा',
      otpTimerText: 'कोड कालबाह्य होण्यास वेळ: {seconds} से.',
      resendBtn: 'कोड पुन्हा पाठवा',
      backBtn: 'मागे',
      verifyOtpBtn: 'कोड पडताळा',
      otpRequired: 'कृपया 6-अंकी पडताळणी कोड प्रविष्ट करा.',
      otpInvalid: 'अवैध पडताळणी कोड. कृपया तपासा आणि पुन्हा प्रयत्न करा.',
      otpExpired: 'पडताळणी कोड कालबाह्य झाला आहे. कृपया नवीन कोड विनंती करा.',
      step3Prompt: 'आपल्या ऑपरेटर खात्यासाठी एक मजबूत नवीन पासवर्ड तयार करा.',
      step3NewPassLabel: 'नवीन पासवर्ड',
      step3NewPassPlaceholder: 'नवीन पासवर्ड प्रविष्ट करा',
      step3ConfirmPassLabel: 'नवीन पासवर्डची पुष्टी करा',
      step3ConfirmPassPlaceholder: 'नवीन पासवर्ड पुन्हा प्रविष्ट करा',
      saveNewPassBtn: 'नवीन पासवर्ड जतन आणि एन्क्रिप्ट करा',
      passTooShort: 'पासवर्ड किमान 6 अक्षरांचा असावा.',
      passMismatch: 'पासवर्ड जुळत नाहीत. कृपया खात्री करा.',
      successTitle: 'पासवर्ड रीसेट पूर्ण!',
      successDesc: 'आपला नवीन पासवर्ड SHA-256 सह हॅश करून AES-256-GCM वॉल्टमध्ये सुरक्षितपणे एन्क्रिप्ट केला आहे. आपण आता लगेच साइन इन करू शकता.',
      returnToLoginBtn: 'नवीन पासवर्डसह साइन इन करा',
      toasts: {
        otpSentTitle: 'ईमेलवर कोड पाठविला',
        otpSentMsg: '{email} वर पडताळणी कोड पाठविला आहे. आपला इनबॉक्स तपासा.',
        resetSuccessTitle: 'पासवर्ड अद्यतनित',
        resetSuccessMsg: '{name} साठी नवीन क्रेडेंशियल्स सुरक्षितपणे जतन केले'
      }
    }
  },
  ur: {
    code: 'ur',
    name: 'اردو (Urdu)',
    pillLabel: 'اردو',
    brandTagline: 'ذہین سرحدی<br />ویڈیو تجزیاتی پلیٹ فارم',
    heroHeadline: 'ہوشمند <span class="accent-blue">نگرانی۔</span><br />مضبوط <span class="accent-blue">سرحدیں۔</span>',
    heroSub: 'موجودہ سی سی ٹی وی کیمروں کو ایک ذہین نگرانی نیٹ ورک میں تبدیل کرنے والا مصنوعی ذہانت کا تجزیاتی نظام۔',
    signinTitle: 'خوش <span class="accent-blue">آمدید!</span>',
    signinSub: 'IBVAP پر جاری رکھنے کے لیے سائن ان کریں',
    userPlaceholder: 'مجاز جی میل پتہ',
    userError: 'براہ کرم اپنا مجاز جی میل پتہ درج کریں۔',
    unauthorizedUserError: 'غیر مجاز جی میل اکاؤنٹ۔ رسائی صرف رجسٹرڈ عملے تک محدود ہے۔',
    passPlaceholder: 'پاس ورڈ',
    passError: 'براہ کرم اپنا پاس ورڈ درج کریں۔',
    incorrectPassError: 'اس مجاز اکاؤنٹ کا پاس ورڈ غلط ہے۔',
    rememberMe: 'مجھے یاد رکھیں',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    submitBtn: 'سائن ان کریں',
    dividerText: 'یا اس کے ساتھ جاری رکھیں',
    noAccountText: 'کیا اکاؤنٹ نہیں ہے؟',
    contactAdmin: 'ایڈمنسٹریٹر سے رابطہ کریں',
    toasts: {
      authSuccessTitle: 'تصدیق کامیاب',
      authSuccessMsg: '{name} کی اسناد کی تصدیق ہو گئی۔ ڈیش بورڈ پر منتقل کیا جا رہا ہے...',
      authFailedTitle: 'رسائی مسترد',
      forgotTitle: 'سسٹم ایڈمنسٹریٹر سے رابطہ کریں',
      forgotMsg: 'پاس ورڈ ری سیٹ کے لیے نوڈل سیکیورٹی آفیسر سے اجازت درکار ہے۔',
      ssoTitle: 'ایس ایس او عارضی طور پر غیر فعال ہے',
      ssoMsg: 'سرکاری ایس ایس او این آئی سی کی منظوری کا منتظر ہے۔ اسناد استعمال کریں۔',
      adminTitle: 'ایڈمنسٹریٹر سے رابطہ',
      adminMsg: '{email} کے لیے رسائی کی درخواست تیار کی گئی۔ ای میل کلپ بورڈ پر کاپی ہو گئی۔',
      langChangedTitle: 'زبان تبدیل ہو گئی',
      langChangedMsg: 'انٹرفیس کی زبان اردو پر مقرر کی گئی'
    },
    recovery: {
      modalTitle: 'اکاؤنٹ کی بازیابی',
      modalDesc: 'پاس ورڈ ری سیٹ کرنے کے لیے مجاز آپریٹر کی تصدیق کریں',
      badgeIdentify: '1. شناخت',
      badgeVerify: '2. او ٹی پی کی تصدیق',
      badgeNewPass: '3. نیا پاس ورڈ',
      step1Prompt: 'سیکیورٹی کوڈ حاصل کرنے کے لیے اپنا مجاز جی میل پتہ درج کریں۔',
      step1EmailLabel: 'مجاز جی میل پتہ',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'تصدیقی کوڈ بھیجیں',
      emailRequired: 'براہ کرم اپنا مجاز جی میل پتہ درج کریں۔',
      emailUnauthorized: 'یہ جی میل IBVAP سیکیورٹی رجسٹری میں مجاز نہیں ہے۔',
      otpNoticeTitle: 'سیکیورٹی کوڈ ای میل پر بھیج دیا گیا',
      otpNoticeText: 'آپ کے مجاز جی میل ایڈریس پر 6 ہندسوں کا تصدیقی کوڈ بھیج دیا گیا ہے:',
      otpNoticeHint: 'براہ کرم اپنا جی میل ان باکس اور اسپام فولڈر چیک کریں، پھر نیچے کوڈ درج کریں۔',
      step2OtpLabel: '6 ہندسوں کا او ٹی پی درج کریں',
      otpTimerText: 'کوڈ کی معیاد: {seconds} سیکنڈ',
      resendBtn: 'کوڈ دوبارہ بھیجیں',
      backBtn: 'واپس',
      verifyOtpBtn: 'کوڈ کی تصدیق کریں',
      otpRequired: 'براہ کرم 6 ہندسوں کا تصدیقی کوڈ درج کریں۔',
      otpInvalid: 'غلط تصدیقی کوڈ۔ براہ کرم دوبارہ کوشش کریں۔',
      otpExpired: 'تصدیقی کوڈ ختم ہو گیا ہے۔ براہ کرم نیا کوڈ حاصل کریں۔',
      step3Prompt: 'اپنے اکاؤنٹ کے لیے ایک مضبوط نیا پاس ورڈ بنائیں۔',
      step3NewPassLabel: 'نیا پاس ورڈ',
      step3NewPassPlaceholder: 'نیا پاس ورڈ درج کریں',
      step3ConfirmPassLabel: 'نئے پاس ورڈ کی تصدیق کریں',
      step3ConfirmPassPlaceholder: 'نیا پاس ورڈ دوبارہ درج کریں',
      saveNewPassBtn: 'نیا پاس ورڈ محفوظ اور خفیہ کریں',
      passTooShort: 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔',
      passMismatch: 'پاس ورڈ مماثل نہیں ہیں۔',
      successTitle: 'پاس ورڈ کامیابی سے تبدیل ہو گیا!',
      successDesc: 'آپ کا نیا پاس ورڈ محفوظ طریقے سے خفیہ کر کے محفوظ کر لیا گیا ہے۔ آپ ابھی سائن ان کر سکتے ہیں۔',
      returnToLoginBtn: 'نئے پاس ورڈ سے سائن ان کریں',
      toasts: {
        otpSentTitle: 'کوڈ ای میل پر بھیج دیا گیا',
        otpSentMsg: '{email} پر کوڈ بھیج دیا گیا ہے۔ اپنا ان باکس چیک کریں۔',
        resetSuccessTitle: 'پاس ورڈ اپ ڈیٹ ہو گیا',
        resetSuccessMsg: '{name} کے لیے نئے پاس ورڈ کی توثیق مکمل ہو گئی'
      }
    }
  },
  bn: {
    code: 'bn',
    name: 'বাংলা (Bengali)',
    pillLabel: 'বাংলা',
    brandTagline: 'ইন্টেলিজেন্ট বর্ডার<br />ভিডিও অ্যানালিটিক্স প্ল্যাটফর্ম',
    heroHeadline: 'স্মার্ট <span class="accent-blue">নজরদারি।</span><br />শক্তিশালী <span class="accent-blue">সীমান্ত।</span>',
    heroSub: 'বিদ্যমান সিসিটিভি ক্যামেরাকে একটি বুদ্ধিমান নজরদারি নেটওয়ার্কে রূপান্তরকারী এআই-চালিত ভিডিও অ্যানালিটিক্স।',
    signinTitle: 'আবারো <span class="accent-blue">স্বাগতম!</span>',
    signinSub: 'IBVAP এ এগিয়ে যেতে সাইন ইন করুন',
    userPlaceholder: 'অনুমোদিত জিমেইল ঠিকানা',
    userError: 'অনুগ্রহ করে আপনার অনুমোদিত জিমেইল ঠিকানা লিখুন।',
    unauthorizedUserError: 'অননুমোদিত জিমেইল অ্যাকাউন্ট। প্রবেশাধিকার কেবল নিবন্ধিত কর্মীদের জন্য সীমাবদ্ধ।',
    passPlaceholder: 'পাসওয়ার্ড',
    passError: 'অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।',
    incorrectPassError: 'এই অনুমোদিত অ্যাকাউন্টের জন্য ভুল পাসওয়ার্ড।',
    rememberMe: 'মনে রাখুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    submitBtn: 'সাইন ইন করুন',
    dividerText: 'অথবা এর মাধ্যমে এগিয়ে যান',
    noAccountText: 'অ্যাকাউন্ট নেই?',
    contactAdmin: 'অ্যাডমিনের সাথে যোগাযোগ করুন',
    toasts: {
      authSuccessTitle: 'প্রমাণীকরণ সফল',
      authSuccessMsg: '{name}-এর প্রমাণপত্র যাচাই করা হয়েছে। ড্যাশবোর্ডে পুনঃনির্দেশ করা হচ্ছে...',
      authFailedTitle: 'প্রবেশাধিকার প্রত্যাখ্যাত',
      forgotTitle: 'সিস্টেম অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন',
      forgotMsg: 'পাসওয়ার্ড রিসেটের জন্য নোডাল নিরাপত্তা কর্মকর্তার অনুমোদনের প্রয়োজন।',
      ssoTitle: 'এসএসও সাময়িকভাবে অক্ষম',
      ssoMsg: 'সরকারি এসএসও একীকরণ এনআইসি অনুমোদনের অপেক্ষায় রয়েছে।',
      adminTitle: 'অ্যাডমিনিস্ট্রেটর যোগাযোগ',
      adminMsg: '{email}-এর জন্য অ্যাক্সেস অনুরোধ প্রস্তুত। ইমেল ক্লিপবোর্ডে কপি করা হয়েছে।',
      langChangedTitle: 'ভাষা পরিবর্তিত হয়েছে',
      langChangedMsg: 'ইন্টারফেস ভাষা বাংলায় সেট করা হয়েছে'
    },
    recovery: {
      modalTitle: 'অ্যাকাউন্ট পুনরুদ্ধার',
      modalDesc: 'পাসওয়ার্ড রিসেট করতে অনুমোদিত অপারেটরের প্রমাণপত্র যাচাই করুন',
      badgeIdentify: '১. শনাক্তকরণ',
      badgeVerify: '২. ওটিপি যাচাই',
      badgeNewPass: '৩. নতুন পাসওয়ার্ড',
      step1Prompt: 'নিরাপত্তা যাচাই কোড পেতে আপনার নিবন্ধিত অপারেটর জিমেইল ঠিকানা লিখুন।',
      step1EmailLabel: 'অনুমোদিত জিমেইল ঠিকানা',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'যাচাইকরণ কোড পাঠান',
      emailRequired: 'অনুগ্রহ করে আপনার অনুমোদিত জিমেইল ঠিকানা লিখুন।',
      emailUnauthorized: 'এই জিমেইলটি IBVAP নিরাপত্তা রেজিস্ট্রিতে অনুমোদিত নয়।',
      otpNoticeTitle: 'নিরাপত্তা কোড ইমেলে পাঠানো হয়েছে',
      otpNoticeText: 'আপনার অনুমোদিত জিমেইল ঠিকানায় একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে:',
      otpNoticeHint: 'অনুগ্রহ করে আপনার জিমেইল ইনবক্স এবং স্প্যাম ফোল্ডার পরীক্ষা করুন, তারপর নিচে কোডটি লিখুন।',
      step2OtpLabel: '৬-সংখ্যার ওটিপি লিখুন',
      otpTimerText: 'কোডের মেয়াদ শেষ হতে বাকি: {seconds} সে.',
      resendBtn: 'কোড পুনরায় পাঠান',
      backBtn: 'পেছনে',
      verifyOtpBtn: 'কোড যাচাই করুন',
      otpRequired: 'অনুগ্রহ করে ৬-সংখ্যার যাচাইকরণ কোডটি লিখুন।',
      otpInvalid: 'ভুল যাচাইকরণ কোড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
      otpExpired: 'যাচাইকরণ কোডের মেয়াদ শেষ হয়েছে। নতুন কোড অনুরোধ করুন।',
      step3Prompt: 'আপনার অপারেটর অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড তৈরি করুন।',
      step3NewPassLabel: 'নতুন পাসওয়ার্ড',
      step3NewPassPlaceholder: 'নতুন পাসওয়ার্ড লিখুন',
      step3ConfirmPassLabel: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
      step3ConfirmPassPlaceholder: 'নতুন পাসওয়ার্ড পুনরায় লিখুন',
      saveNewPassBtn: 'নতুন পাসওয়ার্ড সংরক্ষণ ও এনক্রিপ্ট করুন',
      passTooShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
      passMismatch: 'পাসওয়ার্ড মিলছে না। অনুগ্রহ করে যাচাই করুন।',
      successTitle: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!',
      successDesc: 'আপনার নতুন পাসওয়ার্ডটি SHA-256 দিয়ে হ্যাশ এবং AES-256-GCM ভল্টে সুরক্ষিতভাবে এনক্রিপ্ট করা হয়েছে। আপনি এখন অবিলম্বে সাইন ইন করতে পারেন।',
      returnToLoginBtn: 'নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন',
      toasts: {
        otpSentTitle: 'ইমেলে কোড পাঠানো হয়েছে',
        otpSentMsg: '{email}-এ যাচাইকরণ কোড পাঠানো হয়েছে। আপনার ইনবক্স চেক করুন।',
        resetSuccessTitle: 'পাসওয়ার্ড আপডেট হয়েছে',
        resetSuccessMsg: '{name}-এর নতুন প্রমাণপত্র এনক্রিপ্ট করা হয়েছে'
      }
    }
  },
  pa: {
    code: 'pa',
    name: 'ਪੰਜਾਬੀ (Punjabi)',
    pillLabel: 'ਪੰਜਾਬੀ',
    brandTagline: 'ਇੰਟੈਲੀਜੈਂਟ ਬਾਰਡਰ<br />ਵੀਡੀਓ ਵਿਸ਼ਲੇਸ਼ਣ ਪਲੇਟਫਾਰਮ',
    heroHeadline: 'ਸਮਾਰਟ <span class="accent-blue">ਨਿਗਰਾਨੀ।</span><br />ਮਜ਼ਬੂਤ <span class="accent-blue">ਸਰਹੱਦਾਂ।</span>',
    heroSub: 'ਮੌਜੂਦਾ ਸੀਸੀਟੀਵੀ ਨੈੱਟਵਰਕ ਨੂੰ ਇੱਕ ਬੁੱਧੀਮਾਨ ਨਿਗਰਾਨੀ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਬਦਲਣ ਵਾਲਾ ਏਆਈ-ਸੰਚਾਲਿਤ ਵੀਡੀਓ ਵਿਸ਼ਲੇਸ਼ਣ।',
    signinTitle: 'ਜੀ ਆਇਆਂ <span class="accent-blue">ਨੂੰ!</span>',
    signinSub: 'IBVAP ਵਿੱਚ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
    userPlaceholder: 'ਅਧਿਕਾਰਤ ਜੀਮੇਲ ਪਤਾ',
    userError: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਅਧਿਕਾਰਤ ਜੀਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ।',
    unauthorizedUserError: 'ਅਣਅਧਿਕਾਰਤ ਜੀਮੇਲ ਖਾਤਾ। ਪਹੁੰਚ ਸਿਰਫ਼ ਰਜਿਸਟਰਡ ਕਰਮਚਾਰੀਆਂ ਤੱਕ ਸੀਮਿਤ ਹੈ।',
    passPlaceholder: 'ਪਾਸਵਰਡ',
    passError: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।',
    incorrectPassError: 'ਇਸ ਅਧਿਕਾਰਤ ਖਾਤੇ ਲਈ ਗ਼ਲਤ ਪਾਸਵਰਡ।',
    rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    submitBtn: 'ਸਾਈਨ ਇਨ ਕਰੋ',
    dividerText: 'ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
    noAccountText: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    contactAdmin: 'ਪ੍ਰਬੰਧਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    toasts: {
      authSuccessTitle: 'ਪ੍ਰਮਾਣੀਕਰਨ ਸਫਲ',
      authSuccessMsg: '{name} ਦੇ ਪ੍ਰਮਾਣ ਪੱਤਰ ਪ੍ਰਮਾਣਿਤ ਹੋ ਗਏ। ਡੈਸ਼ਬੋਰਡ ਵੱਲ ਰੀਡਾਇਰੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
      authFailedTitle: 'ਪਹੁੰਚ ਅਸਵੀਕਾਰ ਕੀਤੀ ਗਈ',
      forgotTitle: 'ਸਿਸਟਮ ਪ੍ਰਸ਼ਾਸਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
      forgotMsg: 'ਪਾਸਵਰਡ ਰੀਸੈਟ ਲਈ ਨੋਡਲ ਸੁਰੱਖਿਆ ਅਧਿਕਾਰੀ ਤੋਂ ਪ੍ਰਵਾਨਗੀ ਦੀ ਲੋੜ ਹੈ।',
      ssoTitle: 'SSO ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਅਸਮਰੱਥ ਹੈ',
      ssoMsg: 'ਸਰਕਾਰੀ SSO ਏਕੀਕਰਣ NIC ਪ੍ਰਵਾਨਗੀ ਲਈ ਲੰਬਿਤ ਹੈ।',
      adminTitle: 'ਪ੍ਰਬੰਧਕ ਸੰਪਰਕ',
      adminMsg: '{email} ਲਈ ਪਹੁੰਚ ਬੇਨਤੀ ਤਿਆਰ ਕੀਤੀ ਗਈ। ਈਮੇਲ ਕਲਿੱਪਬੋਰਡ \'ਤੇ ਕਾਪੀ ਕੀਤੀ ਗਈ।',
      langChangedTitle: 'ਭਾਸ਼ਾ ਬਦਲੀ ਗਈ',
      langChangedMsg: 'ਇੰਟਰਫੇਸ ਭਾਸ਼ਾ ਪੰਜਾਬੀ \'ਤੇ ਸੈੱਟ ਕੀਤੀ ਗਈ'
    },
    recovery: {
      modalTitle: 'ਖਾਤਾ ਰਿਕਵਰੀ',
      modalDesc: 'ਪਾਸਵਰਡ ਰੀਸੈਟ ਕਰਨ ਲਈ ਅਧਿਕਾਰਤ ਆਪਰੇਟਰ ਪ੍ਰਮਾਣ ਪੱਤਰ ਪ੍ਰਮਾਣਿਤ ਕਰੋ',
      badgeIdentify: '1. ਪਛਾਣ',
      badgeVerify: '2. ਓਟੀਪੀ ਪ੍ਰਮਾਣਿਕਤਾ',
      badgeNewPass: '3. ਨਵਾਂ ਪਾਸਵਰਡ',
      step1Prompt: 'ਸੁਰੱਖਿਆ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣਾ ਰਜਿਸਟਰਡ ਆਪਰੇਟਰ ਜੀਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ।',
      step1EmailLabel: 'ਅਧਿਕਾਰਤ ਜੀਮੇਲ ਪਤਾ',
      step1EmailPlaceholder: 'operator@bsf.gov.in',
      sendOtpBtn: 'ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਭੇਜੋ',
      emailRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਅਧਿਕਾਰਤ ਜੀਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ।',
      emailUnauthorized: 'ਇਹ ਜੀਮੇਲ IBVAP ਸੁਰੱਖਿਆ ਰਜਿਸਟਰੀ ਵਿੱਚ ਅਧਿਕਾਰਤ ਨਹੀਂ ਹੈ।',
      otpNoticeTitle: 'ਸੁਰੱਖਿਆ ਕੋਡ ਈਮੇਲ \'ਤੇ ਭੇਜਿਆ ਗਿਆ',
      otpNoticeText: 'ਤੁਹਾਡੇ ਅਧਿਕਾਰਤ ਜੀਮੇਲ ਪਤੇ \'ਤੇ 6-ਅੰਕਾਂ ਵਾਲਾ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ:',
      otpNoticeHint: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਜੀਮੇਲ ਇਨਬਾਕਸ ਅਤੇ ਸਪੈਮ ਫੋਲਡਰ ਦੇਖੋ, ਫਿਰ ਹੇਠਾਂ ਕੋਡ ਦਰਜ ਕਰੋ।',
      step2OtpLabel: '6-ਅੰਕੀ ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
      otpTimerText: 'ਕੋਡ ਦੀ ਮਿਆਦ: {seconds} ਸਕਿੰਟ',
      resendBtn: 'ਕੋਡ ਦੁਬਾਰਾ ਭੇਜੋ',
      backBtn: 'ਪਿੱਛੇ',
      verifyOtpBtn: 'ਕੋਡ ਪ੍ਰਮਾਣਿਤ ਕਰੋ',
      otpRequired: 'ਕਿਰਪਾ ਕਰਕੇ 6-ਅੰਕਾਂ ਵਾਲਾ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਦਰਜ ਕਰੋ।',
      otpInvalid: 'ਗ਼ਲਤ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      otpExpired: 'ਕੋਡ ਦੀ ਮਿਆਦ ਪੁੱਗ ਚੁੱਕੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਕੋਡ ਬੇਨਤੀ ਕਰੋ।',
      step3Prompt: 'ਆਪਣੇ ਆਪਰੇਟਰ ਖਾਤੇ ਲਈ ਇੱਕ ਮਜ਼ਬੂਤ ਨਵਾਂ ਪਾਸਵਰਡ ਬਣਾਓ।',
      step3NewPassLabel: 'ਨਵਾਂ ਪਾਸਵਰਡ',
      step3NewPassPlaceholder: 'ਨਵਾਂ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ',
      step3ConfirmPassLabel: 'ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
      step3ConfirmPassPlaceholder: 'ਨਵਾਂ ਪਾਸਵਰਡ ਦੁਬਾਰਾ ਦਰਜ ਕਰੋ',
      saveNewPassBtn: 'ਨਵਾਂ ਪਾਸਵਰਡ ਸੁਰੱਖਿਅਤ ਅਤੇ ਏਨਕ੍ਰਿਪਟ ਕਰੋ',
      passTooShort: 'ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।',
      passMismatch: 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ। ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ।',
      successTitle: 'ਪਾਸਵਰਡ ਸਫਲਤਾਪੂਰਵਕ ਰੀਸੈਟ ਹੋ ਗਿਆ!',
      successDesc: 'ਤੁਹਾਡਾ ਨਵਾਂ ਪਾਸਵਰਡ SHA-256 ਨਾਲ ਹੈਸ਼ ਅਤੇ AES-256-GCM ਵਾਲਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਏਨਕ੍ਰਿਪਟ ਕੀਤਾ ਗਿਆ ਹੈ। ਤੁਸੀਂ ਹੁਣ ਤੁਰੰਤ ਸਾਈਨ ਇਨ ਕਰ ਸਕਦੇ ਹੋ।',
      returnToLoginBtn: 'ਨਵੇਂ ਪਾਸਵਰਡ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ',
      toasts: {
        otpSentTitle: 'ਈਮੇਲ \'ਤੇ ਕੋਡ ਭੇਜਿਆ ਗਿਆ',
        otpSentMsg: '{email} \'ਤੇ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਭੇਜਿਆ ਗਿਆ। ਆਪਣਾ ਇਨਬਾਕਸ ਚੈੱਕ ਕਰੋ।',
        resetSuccessTitle: 'ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਹੋਇਆ',
        resetSuccessMsg: '{name} ਲਈ ਨਵੇਂ ਪ੍ਰਮਾਣ ਪੱਤਰ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਗਏ'
      }
    }
  }
};

let currentLangCode = 'en';

function applyLanguage(langCode, notify = false) {
  const dict = TRANSLATIONS[langCode] || TRANSLATIONS.en;
  currentLangCode = dict.code;

  // Persist preference
  try {
    localStorage.setItem('ibvap_lang', currentLangCode);
  } catch (e) {
    // Storage might be restricted
  }

  // Update HTML lang attribute and body class
  document.documentElement.lang = currentLangCode;
  if (currentLangCode === 'ur') {
    document.body.classList.add('lang-ur');
  } else {
    document.body.classList.remove('lang-ur');
  }

  // Update pill button label
  const currentLangSpan = document.getElementById('currentLang');
  if (currentLangSpan) currentLangSpan.textContent = dict.pillLabel;

  // Update active state in menu options
  document.querySelectorAll('.lang-option').forEach(opt => {
    const isSelected = opt.dataset.lang === currentLangCode;
    opt.classList.toggle('active', isSelected);
    opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });

  // Update Left Panel Texts
  const brandTagline = document.getElementById('brandTagline');
  if (brandTagline) brandTagline.innerHTML = dict.brandTagline;

  const heroHeadline = document.getElementById('heroHeadline');
  if (heroHeadline) heroHeadline.innerHTML = dict.heroHeadline;

  const heroSub = document.getElementById('heroSub');
  if (heroSub) heroSub.textContent = dict.heroSub;

  // Update Right Panel Texts
  const signinTitle = document.getElementById('signinTitle');
  if (signinTitle) signinTitle.innerHTML = dict.signinTitle;

  const signinSub = document.getElementById('signinSub');
  if (signinSub) signinSub.textContent = dict.signinSub;

  // Placeholders
  const userInput = document.getElementById('userId');
  if (userInput) userInput.placeholder = dict.userPlaceholder;

  const passInput = document.getElementById('password');
  if (passInput) passInput.placeholder = dict.passPlaceholder;

  // Remember me & Forgot Password
  const rememberLabel = document.getElementById('rememberLabel');
  if (rememberLabel) rememberLabel.textContent = dict.rememberMe;

  const forgotLink = document.getElementById('forgotLink');
  if (forgotLink) forgotLink.textContent = dict.forgotPassword;

  // Submit button
  const submitBtnText = document.getElementById('submitBtnText');
  if (submitBtnText) submitBtnText.textContent = dict.submitBtn;

  // Divider
  const dividerText = document.getElementById('dividerText');
  if (dividerText) dividerText.textContent = dict.dividerText;

  // Register row
  const noAccountText = document.getElementById('noAccountText');
  if (noAccountText) noAccountText.textContent = dict.noAccountText;

  const contactAdmin = document.getElementById('contactAdmin');
  if (contactAdmin) contactAdmin.textContent = dict.contactAdmin;

  // Update visible error messages if active
  const userErr = document.getElementById('userId-error');
  if (userErr && userErr.classList.contains('visible')) {
    const errKey = userErr.dataset.errorKey || 'userError';
    userErr.textContent = dict[errKey] || dict.userError;
  }
  const passErr = document.getElementById('password-error');
  if (passErr && passErr.classList.contains('visible')) {
    const errKey = passErr.dataset.errorKey || 'passError';
    passErr.textContent = dict[errKey] || dict.passError;
  }

  // Update recovery modal texts if defined
  applyRecoveryLanguage(dict);

  // Toast notification
  if (notify) {
    const msg = dict.toasts.langChangedMsg.replace('{lang}', dict.pillLabel);
    showToast('success', dict.toasts.langChangedTitle, msg);
  }
}

function initLanguageDropdown() {
  const dropdown = document.getElementById('langDropdown');
  const pillBtn = document.getElementById('langPill');
  const options = document.querySelectorAll('.lang-option');

  if (!dropdown || !pillBtn) return;

  // Toggle dropdown on pill click
  pillBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    pillBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Select an option
  options.forEach(opt => {
    const handleSelect = (e) => {
      e.stopPropagation();
      const lang = opt.dataset.lang;
      applyLanguage(lang, true);
      dropdown.classList.remove('open');
      pillBtn.setAttribute('aria-expanded', 'false');
    };
    opt.addEventListener('click', handleSelect);
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(e);
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      pillBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
      pillBtn.setAttribute('aria-expanded', 'false');
      pillBtn.focus();
    }
  });

  // Restore saved language from localStorage if available
  let savedLang = 'en';
  try {
    savedLang = localStorage.getItem('ibvap_lang') || 'en';
  } catch (e) { }
  applyLanguage(savedLang, false);
}

// ── Field validation helpers ──────────────────────────────────────────────────
function showFieldError(id, key) {
  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;
  document.getElementById(id).classList.add('error');
  const e = document.getElementById(id + '-error');
  e.dataset.errorKey = key;
  e.textContent = dict[key] || key;
  e.classList.add('visible');
}

function clearErrors() {
  ['userId', 'password'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.classList.remove('error');
    const err = document.getElementById(id + '-error');
    if (err) {
      err.classList.remove('visible');
      delete err.dataset.errorKey;
    }
  });
}

// ── Form submit with Encrypted Verification ───────────────────────────────────
const form = document.getElementById('signinForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('userId').value.trim();
  const pass = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;
  let valid = true;

  if (!email || !email.includes('@')) {
    showFieldError('userId', 'userError');
    valid = false;
  }
  if (!pass) {
    showFieldError('password', 'passError');
    valid = false;
  }
  if (!valid) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Simulate security handshake
  await new Promise(r => setTimeout(r, 900));

  // Retrieve authorized operators from encrypted vault
  const authorizedOperators = await getAuthorizedOperators();
  const normalizedEmail = email.toLowerCase().trim();
  const matchedOperator = authorizedOperators.find(op => op.email.toLowerCase() === normalizedEmail);

  // Reject if not one of the designated Gmail accounts
  if (!matchedOperator) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    showFieldError('userId', 'unauthorizedUserError');
    showToast('error', dict.toasts.authFailedTitle, dict.unauthorizedUserError);
    return;
  }

  // Cryptographic salted SHA-256 password hash comparison
  const inputHash = await hashCredential(normalizedEmail, pass);
  if (inputHash !== matchedOperator.hash) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    showFieldError('password', 'incorrectPassError');
    showToast('error', dict.toasts.authFailedTitle, dict.incorrectPassError);
    return;
  }

  // ── Store operator session in AES-GCM encrypted form ────────────────────────
  await saveOperatorSession(matchedOperator.email, matchedOperator.role, matchedOperator.name);
  try {
    localStorage.removeItem('ibvap_remember');
  } catch { }

  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;

  const successMsg = dict.toasts.authSuccessMsg.replace('{name}', matchedOperator.name);
  showToast('success', dict.toasts.authSuccessTitle, successMsg);
  setTimeout(() => window.location.href = '/', 1500);
});

// ── Password Recovery Language Helper ─────────────────────────────────────────
function applyRecoveryLanguage(dict) {
  const r = dict.recovery;
  if (!r) return;

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt) el.textContent = txt;
  };

  setTxt('recoveryTitle', r.modalTitle);
  setTxt('recoveryDesc', r.modalDesc);
  setTxt('stepBadge1', r.badgeIdentify);
  setTxt('stepBadge2', r.badgeVerify);
  setTxt('stepBadge3', r.badgeNewPass);

  // Step 1
  setTxt('step1Prompt', r.step1Prompt);
  setTxt('step1EmailLabel', r.step1EmailLabel);
  const recEmail = document.getElementById('recoveryEmail');
  if (recEmail && r.step1EmailPlaceholder) recEmail.placeholder = r.step1EmailPlaceholder;
  setTxt('sendOtpBtnText', r.sendOtpBtn);

  // Step 2
  setTxt('otpNoticeTitle', r.otpNoticeTitle);
  setTxt('otpNoticeText', r.otpNoticeText);
  setTxt('otpNoticeHint', r.otpNoticeHint);
  setTxt('step2OtpLabel', r.step2OtpLabel);
  const resendBtn = document.getElementById('resendOtpBtn');
  if (resendBtn) resendBtn.textContent = r.resendBtn;
  setTxt('backToStep1Btn', r.backBtn);
  setTxt('verifyOtpBtnText', r.verifyOtpBtn);

  // Step 3
  setTxt('step3Prompt', r.step3Prompt);
  setTxt('step3NewPassLabel', r.step3NewPassLabel);
  const newPass = document.getElementById('recoveryNewPass');
  if (newPass && r.step3NewPassPlaceholder) newPass.placeholder = r.step3NewPassPlaceholder;
  setTxt('step3ConfirmPassLabel', r.step3ConfirmPassLabel);
  const confPass = document.getElementById('recoveryConfirmPass');
  if (confPass && r.step3ConfirmPassPlaceholder) confPass.placeholder = r.step3ConfirmPassPlaceholder;
  setTxt('saveNewPassBtnText', r.saveNewPassBtn);

  // Step 4
  setTxt('recoverySuccessTitle', r.successTitle);
  setTxt('recoverySuccessDesc', r.successDesc);
  setTxt('returnToLoginBtnText', r.returnToLoginBtn);
}

// ── Password Recovery & Encrypted Vault Update System ────────────────────────
const recoveryState = {
  activeEmail: '',
  activeOperator: null,
  generatedOtp: '',
  otpExpiresAt: 0,
  countdownInterval: null
};

// Update operator password in the encrypted vault
async function updateOperatorPassword(email, newPassword) {
  const operators = await getAuthorizedOperators();
  const normalizedEmail = email.toLowerCase().trim();
  const operatorIndex = operators.findIndex(op => op.email.toLowerCase() === normalizedEmail);
  if (operatorIndex === -1) {
    throw new Error('Operator not found in authorized registry');
  }

  // Cryptographic salted SHA-256 hash of the new password
  const newHash = await hashCredential(normalizedEmail, newPassword);
  operators[operatorIndex].hash = newHash;

  // Re-encrypt the updated operator registry into AES-256-GCM
  const updatedVault = await encryptData(JSON.stringify(operators));
  localStorage.setItem('ibvap_auth_vault', updatedVault);

  return operators[operatorIndex];
}

function setRecoveryStep(stepNum) {
  // Update step badges
  const b1 = document.getElementById('stepBadge1');
  const b2 = document.getElementById('stepBadge2');
  const b3 = document.getElementById('stepBadge3');

  if (b1) b1.className = 'step-badge ' + (stepNum === 1 ? 'active' : (stepNum > 1 ? 'completed' : ''));
  if (b2) b2.className = 'step-badge ' + (stepNum === 2 ? 'active' : (stepNum > 2 ? 'completed' : ''));
  if (b3) b3.className = 'step-badge ' + (stepNum === 3 ? 'active' : (stepNum > 3 ? 'completed' : ''));

  const stepper = document.querySelector('.recovery-stepper');
  if (stepper) stepper.className = 'recovery-stepper step-' + stepNum;

  // Update panels
  const panels = [
    { num: 1, id: 'recoveryStep1' },
    { num: 2, id: 'recoveryStep2' },
    { num: 3, id: 'recoveryStep3' },
    { num: 4, id: 'recoveryStep4' }
  ];

  panels.forEach(({ num, id }) => {
    const el = document.getElementById(id);
    if (el) {
      if (num === stepNum) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  clearRecoveryErrors();
}

function clearRecoveryErrors() {
  ['recoveryEmail', 'recoveryOtpInput', 'recoveryConfirmPass', 'recoveryNewPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });

  ['recoveryEmailError', 'recoveryOtpError', 'recoveryPassError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.classList.remove('visible');
    }
  });
}

function showRecoveryError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add('error');
  const err = document.getElementById(errorId);
  if (err) {
    err.textContent = message;
    err.classList.add('visible');
  }
}

function startOtpCountdown(seconds = 60) {
  if (recoveryState.countdownInterval) {
    clearInterval(recoveryState.countdownInterval);
  }

  recoveryState.otpExpiresAt = Date.now() + (seconds * 1000);
  const countdownEl = document.getElementById('otpCountdown');
  const resendBtn = document.getElementById('resendOtpBtn');
  const timerText = document.getElementById('otpTimerText');
  if (resendBtn) resendBtn.disabled = true;

  const updateDisplay = () => {
    const remaining = Math.max(0, Math.ceil((recoveryState.otpExpiresAt - Date.now()) / 1000));
    if (countdownEl) countdownEl.textContent = remaining;

    const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;
    if (timerText && remaining > 0) {
      timerText.innerHTML = dict.recovery.otpTimerText.replace('{seconds}', `<span id="otpCountdown">${remaining}</span>`);
    }

    if (remaining <= 0) {
      clearInterval(recoveryState.countdownInterval);
      recoveryState.countdownInterval = null;
      if (resendBtn) resendBtn.disabled = false;
      if (timerText) timerText.textContent = dict.recovery.otpExpired;
    }
  };

  updateDisplay();
  recoveryState.countdownInterval = setInterval(updateDisplay, 1000);
}

async function dispatchOtp() {
  const emailInput = document.getElementById('recoveryEmail');
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;

  clearRecoveryErrors();

  if (!email || !email.includes('@')) {
    showRecoveryError('recoveryEmail', 'recoveryEmailError', dict.recovery.emailRequired);
    return;
  }

  const sendBtn = document.getElementById('sendOtpBtn');
  if (sendBtn) {
    sendBtn.classList.add('loading');
    sendBtn.disabled = true;
  }

  // Retrieve authorized operators from encrypted vault
  const operators = await getAuthorizedOperators();
  const matched = operators.find(op => op.email.toLowerCase() === email);

  await new Promise(r => setTimeout(r, 600));

  if (!matched) {
    if (sendBtn) {
      sendBtn.classList.remove('loading');
      sendBtn.disabled = false;
    }
    showRecoveryError('recoveryEmail', 'recoveryEmailError', dict.recovery.emailUnauthorized);
    showToast('error', dict.toasts.authFailedTitle, dict.recovery.emailUnauthorized);
    return;
  }

  // Generate 6-digit cryptographic security code
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const otpCode = (100000 + (randomArray[0] % 900000)).toString();

  recoveryState.activeEmail = matched.email;
  recoveryState.activeOperator = matched;
  recoveryState.generatedOtp = otpCode;

  if (sendBtn) {
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
  }

  // Set dispatched email recipient in UI (OTP is NEVER displayed on the webpage)
  const targetEmailEl = document.getElementById('dispatchedEmailTarget');
  if (targetEmailEl) targetEmailEl.textContent = matched.email;

  // Dispatch OTP to email via server mailer & gateway relay
  try {
    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: matched.email,
        otp: otpCode
      })
    }).catch(e => console.warn('[IBVAP Security] Email dispatch background status:', e));
  } catch (e) { }

  console.info(`%c[IBVAP Security] Security code dispatched to ${matched.email}`, 'color: #00FF94; font-weight: bold;');

  const otpInput = document.getElementById('recoveryOtpInput');
  if (otpInput) {
    otpInput.value = '';
    setTimeout(() => otpInput.focus(), 150);
  }

  startOtpCountdown(60);
  setRecoveryStep(2);

  const toastMsg = dict.recovery.toasts.otpSentMsg.replace('{email}', matched.email);
  showToast('success', dict.recovery.toasts.otpSentTitle, toastMsg);
}

async function verifyOtpCode() {
  const otpInput = document.getElementById('recoveryOtpInput');
  const enteredOtp = otpInput ? otpInput.value.trim() : '';
  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;

  clearRecoveryErrors();

  if (!enteredOtp) {
    showRecoveryError('recoveryOtpInput', 'recoveryOtpError', dict.recovery.otpRequired);
    return;
  }

  if (Date.now() > recoveryState.otpExpiresAt) {
    showRecoveryError('recoveryOtpInput', 'recoveryOtpError', dict.recovery.otpExpired);
    return;
  }

  if (enteredOtp !== recoveryState.generatedOtp) {
    showRecoveryError('recoveryOtpInput', 'recoveryOtpError', dict.recovery.otpInvalid);
    return;
  }

  const verifyBtn = document.getElementById('verifyOtpBtn');
  if (verifyBtn) {
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;
  }

  await new Promise(r => setTimeout(r, 450));

  if (verifyBtn) {
    verifyBtn.classList.remove('loading');
    verifyBtn.disabled = false;
  }

  setRecoveryStep(3);

  const newPassInput = document.getElementById('recoveryNewPass');
  if (newPassInput) {
    newPassInput.value = '';
    setTimeout(() => newPassInput.focus(), 150);
  }
  const confPassInput = document.getElementById('recoveryConfirmPass');
  if (confPassInput) confPassInput.value = '';
}

async function saveNewPassword() {
  const newPass = document.getElementById('recoveryNewPass').value;
  const confPass = document.getElementById('recoveryConfirmPass').value;
  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;

  clearRecoveryErrors();

  if (!newPass || newPass.length < 6) {
    showRecoveryError('recoveryConfirmPass', 'recoveryPassError', dict.recovery.passTooShort);
    return;
  }

  if (newPass !== confPass) {
    showRecoveryError('recoveryConfirmPass', 'recoveryPassError', dict.recovery.passMismatch);
    return;
  }

  const saveBtn = document.getElementById('saveNewPassBtn');
  if (saveBtn) {
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;
  }

  try {
    const updatedOp = await updateOperatorPassword(recoveryState.activeEmail, newPass);

    // Populate main login form with verified email and clear old password
    const mainUser = document.getElementById('userId');
    if (mainUser) mainUser.value = recoveryState.activeEmail;
    const mainPass = document.getElementById('password');
    if (mainPass) mainPass.value = '';

    await new Promise(r => setTimeout(r, 550));

    if (saveBtn) {
      saveBtn.classList.remove('loading');
      saveBtn.disabled = false;
    }

    setRecoveryStep(4);

    const toastMsg = dict.recovery.toasts.resetSuccessMsg.replace('{name}', updatedOp.name);
    showToast('success', dict.recovery.toasts.resetSuccessTitle, toastMsg);
  } catch (err) {
    console.error('Failed to update operator password:', err);
    if (saveBtn) {
      saveBtn.classList.remove('loading');
      saveBtn.disabled = false;
    }
    showRecoveryError('recoveryConfirmPass', 'recoveryPassError', 'Failed to update credentials. Please try again.');
  }
}

function openRecoveryModal() {
  const modal = document.getElementById('recoveryModal');
  if (!modal) return;

  const signinUser = document.getElementById('userId');
  const recEmail = document.getElementById('recoveryEmail');
  if (signinUser && recEmail && signinUser.value.trim().includes('@')) {
    recEmail.value = signinUser.value.trim();
  }

  const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;
  applyRecoveryLanguage(dict);

  setRecoveryStep(1);
  modal.classList.add('active', 'open');

  setTimeout(() => {
    if (recEmail) recEmail.focus();
  }, 100);
}

function closeRecoveryModal() {
  const modal = document.getElementById('recoveryModal');
  if (modal) modal.classList.remove('active', 'open');
  if (recoveryState.countdownInterval) {
    clearInterval(recoveryState.countdownInterval);
    recoveryState.countdownInterval = null;
  }
}

function setupPasswordToggle(btnId, inputId, eyeId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (btn && input && eye) {
    btn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      eye.innerHTML = isPass
        ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>';
    });
  }
}

function initRecoverySystem() {
  // Open recovery modal on Forgot Password click
  const forgotLink = document.getElementById('forgotLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      openRecoveryModal();
    });
  }

  // Close modal button
  const closeBtn = document.getElementById('recoveryCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeRecoveryModal);

  // Close when clicking modal backdrop
  const modal = document.getElementById('recoveryModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeRecoveryModal();
    });
  }

  // Step 1: Send OTP
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  if (sendOtpBtn) sendOtpBtn.addEventListener('click', dispatchOtp);

  const recEmail = document.getElementById('recoveryEmail');
  if (recEmail) {
    recEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dispatchOtp();
      }
    });
  }

  // Step 2: Back button
  const backBtn = document.getElementById('backToStep1Btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (recoveryState.countdownInterval) {
        clearInterval(recoveryState.countdownInterval);
        recoveryState.countdownInterval = null;
      }
      setRecoveryStep(1);
    });
  }

  // Step 2: Resend OTP
  const resendBtn = document.getElementById('resendOtpBtn');
  if (resendBtn) resendBtn.addEventListener('click', dispatchOtp);

  // Step 2: Verify OTP
  const verifyBtn = document.getElementById('verifyOtpBtn');
  if (verifyBtn) verifyBtn.addEventListener('click', verifyOtpCode);

  const otpInput = document.getElementById('recoveryOtpInput');
  if (otpInput) {
    otpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyOtpCode();
      }
    });
  }

  // Step 3: Password visibility toggles
  setupPasswordToggle('toggleNewPass', 'recoveryNewPass', 'eyeNewPass');
  setupPasswordToggle('toggleConfirmPass', 'recoveryConfirmPass', 'eyeConfirmPass');

  // Step 3: Password strength meter
  const newPassInput = document.getElementById('recoveryNewPass');
  const strengthMeter = document.getElementById('passStrengthMeter');
  const strengthLabel = document.getElementById('strengthLabel');
  if (newPassInput && strengthMeter) {
    newPassInput.addEventListener('input', () => {
      const val = newPassInput.value;
      if (!val) {
        strengthMeter.className = 'pass-strength-meter';
        if (strengthLabel) strengthLabel.textContent = 'STRENGTH: —';
        return;
      }
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 8 && /[0-9]/.test(val)) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val) || val.length >= 12) score++;
      score = Math.max(1, Math.min(4, score));

      strengthMeter.className = 'pass-strength-meter strength-' + score;
      const labels = ['WEAK', 'FAIR', 'GOOD', 'STRONG'];
      if (strengthLabel) strengthLabel.textContent = 'STRENGTH: ' + labels[score - 1];
    });
  }

  // Step 3: Save new password
  const savePassBtn = document.getElementById('saveNewPassBtn');
  if (savePassBtn) savePassBtn.addEventListener('click', saveNewPassword);

  const confirmPassInput = document.getElementById('recoveryConfirmPass');
  if (confirmPassInput) {
    confirmPassInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveNewPassword();
      }
    });
  }

  // Step 4: Return to login
  const returnBtn = document.getElementById('returnToLoginBtn');
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      closeRecoveryModal();
      const passField = document.getElementById('password');
      if (passField) {
        passField.focus();
      }
    });
  }

  // Close modal on Escape key if modal is active
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeRecoveryModal();
    }
  });
}

// ── Contact Admin ─────────────────────────────────────────────────────────────
const contactAdminBtn = document.getElementById('contactAdmin');
if (contactAdminBtn) {
  contactAdminBtn.addEventListener('click', e => {
    e.preventDefault();
    const adminEmail = 'ayushchavhan79@gmail.com';
    const dict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;

    // Copy admin email to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(adminEmail).catch(() => {});
    }

    // Launch email composer with prepared template
    const subject = encodeURIComponent('IBVAP Surveillance Platform — Access Credentials Request');
    const body = encodeURIComponent(
      `To: System Administrator (Ayush Chavhan)\n\nI am requesting authorized operator access credentials to the IBVAP surveillance network.\n\nOfficer Name:\nRank / Designation:\nBorder Outpost (BOP) / Unit:\nOfficial Contact Phone:`
    );
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;

    const msg = (dict.toasts.adminMsg || 'Access request prepared for {email}. Email copied to clipboard.').replace('{email}', adminEmail);
    showToast('info', dict.toasts.adminTitle || 'Administrator Contact', msg, 5000);
  });
}

// Initialize language dropdown system
initLanguageDropdown();

// Initialize password recovery system
initRecoverySystem();


