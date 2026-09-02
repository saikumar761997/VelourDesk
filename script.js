
/
































Script · JS
// ===== Config =====
// Public by design: this is a Supabase publishable key, safe for client-side use.
// It only allows inserting a row into marketing_leads under RLS — see the
// project's Supabase policies for what it can and cannot do.
const SUPABASE_URL = "https://hydhezpeuhqhcugnpupu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bBLfdOHavYjMCDFxZzyBdg_FAOyHGQD";
 
// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
 
// ===== Pricing CTA -> pre-fill plan interest =====
document.querySelectorAll(".plan-cta").forEach((btn) => {
  btn.addEventListener("click", () => {
    const plan = btn.getAttribute("data-plan");
    const select = document.getElementById("plan_interest");
    if (plan && select) {
      const match = Array.from(select.options).find((o) => o.value === plan);
      if (match) select.value = plan;
    }
  });
});
 
// ===== Lead form submission =====
const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
 
function setStatus(message, state) {
  statusEl.textContent = message;
  statusEl.setAttribute("data-state", state || "");
}
 
function isValidEmail(value) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}
 
function isValidPhone(value) {
  // Strip everything but digits, then check for a sane digit count.
  // Covers US numbers with/without country code, and basic international.
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
 
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "");
 
  const data = {
    name: form.name.value.trim(),
    salon_name: form.salon_name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    plan_interest: form.plan_interest.value,
    needs: form.needs.value.trim() || null,
  };
 
  if (!data.name || !data.salon_name || !data.phone || !data.email) {
    setStatus("Please fill in your name, salon name, phone, and email.", "error");
    return;
  }
  if (!isValidEmail(data.email)) {
    setStatus("That email address doesn't look right — please check it.", "error");
    return;
  }
  if (!isValidPhone(data.phone)) {
    setStatus("That phone number doesn't look right — please check it.", "error");
    return;
  }
 
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
 
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/marketing_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(data),
    });
 
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
 
    form.reset();
    setStatus("Got it — we'll be in touch within a day.", "success");
  } catch (err) {
    setStatus("Something went wrong sending that. Please try again, or call/text directly.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Request my system";
  }
});
 
