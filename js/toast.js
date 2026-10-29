/**
 * Tectonic Archive — Accessible Telemetry Toast
 * Formatted for precision notification with aria-live="polite".
 */

let toastTimeout = null;

export function showToast(message, duration = 3200) {
  let toastContainer = document.querySelector('.tectonic-toast');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'tectonic-toast';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML = `
    <div class="toast-inner">
      <span class="toast-marker">■</span>
      <span class="toast-text">${message}</span>
    </div>
  `;

  toastContainer.classList.add('visible');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toastContainer.classList.remove('visible');
  }, duration);
}

export async function copyToClipboard(text, successMessage = 'COPIED TO CLIPBOARD') {
  const fullMessage = `${successMessage} // ${text}`;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast(fullMessage);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        showToast(fullMessage);
        return true;
      }
    }
  } catch (err) {
    showToast(`DISPATCH: ${text}`);
    return false;
  }
}
