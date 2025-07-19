const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const otpForm = document.getElementById('otpForm');
const successMessage = document.getElementById('successMessage');
const registrationFormInternal = document.getElementById('registrationFormInternal');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const otpEmail = document.getElementById('otpEmail');
const otpInputs = document.querySelectorAll('.otp-input');
const otpError = document.getElementById('otp-error');

function showForm(formToShow) {
    [loginForm, registerForm, otpForm, successMessage].forEach(form => {
        form.classList.toggle('form-visible', form.id === formToShow);
        form.classList.toggle('form-hidden', form.id !== formToShow);
    });
}

showLoginBtn.onclick = () => showForm('loginForm');
showRegisterBtn.onclick = () => showForm('registerForm');

registrationFormInternal.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    try {
        const res = await fetch('https://YOUR-BACKEND-URL/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success) {
            window.currentOtp = data.otp;
            otpEmail.textContent = email;
            showForm('otpForm');
            otpInputs[0].focus();
        } else {
            alert('Gagal kirim OTP: ' + data.message);
        }
    } catch (err) {
        alert('Gagal kirim OTP: ' + err.message);
    }
});

verifyOtpBtn.addEventListener('click', () => {
    const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
    otpError.textContent = '';
    if (enteredOtp === window.currentOtp) {
        showForm('successMessage');
        setTimeout(() => location.reload(), 2500);
    } else {
        otpError.textContent = 'Kode OTP salah. Coba lagi.';
        otpInputs.forEach(input => input.classList.add('border-red-500'));
    }
});

otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        input.classList.remove('border-red-500');
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});
