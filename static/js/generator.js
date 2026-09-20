/**
 * SecurePass — CSPRNG Password Generator Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('length-slider');
    const lengthDisplay = document.getElementById('length-val');
    const displayBox = document.getElementById('generated-password-display');
    const lenMeta = document.getElementById('gen-len-display');
    const strengthBadge = document.getElementById('gen-strength-badge');
    const entropyDisplay = document.getElementById('gen-entropy-display');

    const chkUpper = document.getElementById('chk-upper');
    const chkLower = document.getElementById('chk-lower');
    const chkDigits = document.getElementById('chk-digits');
    const chkSymbols = document.getElementById('chk-symbols');
    const chkAmbiguous = document.getElementById('chk-avoid-ambiguous');

    const btnGenerate = document.getElementById('btn-generate-main');
    const btnRegen = document.getElementById('btn-regenerate');
    const btnCopy = document.getElementById('btn-copy-pass');
    const btnCopyMain = document.getElementById('btn-copy-main');
    const btnSendAnalyzer = document.getElementById('btn-send-to-analyzer');

    let currentGeneratedPassword = '';

    // Slider sync
    if (slider && lengthDisplay) {
        slider.addEventListener('input', () => {
            lengthDisplay.textContent = slider.value;
            if (lenMeta) lenMeta.textContent = `${slider.value} chars`;
        });
    }

    // Secure Random Generation using Crypto API (or Flask backend)
    function generateSecurePassword() {
        const length = parseInt(slider ? slider.value : '16', 10);
        let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        let numberChars = '0123456789';
        let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (chkAmbiguous && chkAmbiguous.checked) {
            uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
            lowercaseChars = lowercaseChars.replace(/[lo]/g, '');
            numberChars = numberChars.replace(/[01]/g, '');
        }

        let charPool = '';
        const guaranteed = [];

        if (chkUpper && chkUpper.checked) {
            charPool += uppercaseChars;
            guaranteed.push(getRandomChar(uppercaseChars));
        }
        if (chkLower && chkLower.checked) {
            charPool += lowercaseChars;
            guaranteed.push(getRandomChar(lowercaseChars));
        }
        if (chkDigits && chkDigits.checked) {
            charPool += numberChars;
            guaranteed.push(getRandomChar(numberChars));
        }
        if (chkSymbols && chkSymbols.checked) {
            charPool += symbolChars;
            guaranteed.push(getRandomChar(symbolChars));
        }

        if (!charPool) {
            showToast('Please select at least one character type.', 'error');
            return;
        }

        const remaining = Math.max(0, length - guaranteed.length);
        const resultChars = [...guaranteed];

        for (let i = 0; i < remaining; i++) {
            resultChars.push(getRandomChar(charPool));
        }

        // Cryptographically secure Fisher-Yates shuffle
        shuffleArray(resultChars);
        currentGeneratedPassword = resultChars.join('');

        // Render Password in Display
        renderColoredPassword(currentGeneratedPassword);

        // Update Metadata
        if (lenMeta) lenMeta.textContent = `${currentGeneratedPassword.length} chars`;
        const entropy = Math.round(currentGeneratedPassword.length * Math.log2(charPool.length));
        if (entropyDisplay) entropyDisplay.textContent = `~${entropy} bits`;

        if (strengthBadge) {
            if (currentGeneratedPassword.length >= 14 && guaranteed.length >= 3) {
                strengthBadge.textContent = 'Strong (5/5)';
                strengthBadge.className = 'font-mono text-emerald';
            } else if (currentGeneratedPassword.length >= 10) {
                strengthBadge.textContent = 'Medium (3-4/5)';
                strengthBadge.className = 'font-mono text-amber';
            } else {
                strengthBadge.textContent = 'Weak';
                strengthBadge.className = 'font-mono text-rose';
            }
        }
    }

    function getRandomChar(str) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return str[array[0] % str.length];
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            const j = array[0] % (i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function renderColoredPassword(password) {
        if (!displayBox) return;
        displayBox.innerHTML = '';

        for (let char of password) {
            const span = document.createElement('span');
            span.textContent = char;
            if (/[0-9]/.test(char)) {
                span.style.color = '#38bdf8'; // Cyan for digits
            } else if (/[A-Z]/.test(char)) {
                span.style.color = '#c084fc'; // Purple for uppercase
            } else if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(char)) {
                span.style.color = '#34d399'; // Emerald for symbols
            } else {
                span.style.color = '#f8fafc'; // Default
            }
            displayBox.appendChild(span);
        }
    }

    async function copyToClipboard() {
        if (!currentGeneratedPassword) {
            showToast('Generate a password first before copying.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(currentGeneratedPassword);
            showToast('Password copied to clipboard securely!', 'success');
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = currentGeneratedPassword;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Password copied to clipboard!', 'success');
        }
    }

    // Bind Actions
    if (btnGenerate) btnGenerate.addEventListener('click', generateSecurePassword);
    if (btnRegen) btnRegen.addEventListener('click', generateSecurePassword);
    if (btnCopy) btnCopy.addEventListener('click', copyToClipboard);
    if (btnCopyMain) btnCopyMain.addEventListener('click', copyToClipboard);

    if (btnSendAnalyzer) {
        btnSendAnalyzer.addEventListener('click', () => {
            if (!currentGeneratedPassword) {
                showToast('Generate a password first.', 'error');
                return;
            }
            sessionStorage.setItem('pending_analyzer_pass', currentGeneratedPassword);
            window.location.href = '/analyze';
        });
    }

    // Auto-generate on initial load
    generateSecurePassword();
});
