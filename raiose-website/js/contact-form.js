// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');

    // Handle select placeholder styling
    const selects = document.querySelectorAll('.form-group select');
    selects.forEach(select => {
        // Set initial style
        if (select.value === '') {
            select.style.color = '#9ca3af';
        }

        // Update style on change
        select.addEventListener('change', function() {
            if (this.value === '') {
                this.style.color = '#9ca3af';
            } else {
                this.style.color = '';
            }
        });
    });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            // Prepare form data
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success message
                    form.innerHTML = `
                        <div class="success-message">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="20" stroke="#10b981" stroke-width="3"/>
                                <path d="M16 24L22 30L32 18" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <h3>送信完了しました</h3>
                            <p>お問い合わせありがとうございます。<br>内容を確認の上、2営業日以内にご返信いたします。</p>
                            <a href="../index.html" class="btn btn-secondary">ホームに戻る</a>
                        </div>
                    `;
                } else {
                    throw new Error('送信に失敗しました');
                }
            } catch (error) {
                // Error message
                alert('送信に失敗しました。お手数ですが、直接 info@raiose.com までご連絡ください。');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});