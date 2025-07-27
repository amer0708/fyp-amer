document.addEventListener('DOMContentLoaded', function() {
    // Any specific JavaScript for quotation page can go here
    console.log('Price Quotation page loaded');
    var submitDepositBtn = document.getElementById('submit-deposit-btn');
    var rejectQuotationBtn = document.getElementById('reject-quotation-btn');
    var rejectionMessage = document.getElementById('rejection-message');
    if (submitDepositBtn) {
        submitDepositBtn.addEventListener('click', function() {
            // Get the quotation_id from a data attribute or from the page context
            var quotationId = submitDepositBtn.getAttribute('data-quotation-id');
            if (!quotationId && window.quotation_id) {
                quotationId = window.quotation_id;
            }
            if (quotationId) {
                window.location.href = '/payment?quotation_id=' + encodeURIComponent(quotationId);
            } else {
                window.location.href = '/payment';
            }
        });
    }
    if (rejectQuotationBtn) {
        rejectQuotationBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reject this quotation?')) {
                // AJAX call to update quotation status
                fetch('/api/update-quotation-status/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        quotation_id: submitDepositBtn.getAttribute('data-quotation-id'),
                        status: 'rejected'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show rejection message
                        rejectionMessage.style.display = 'block';
                        // Disable both buttons
                        submitDepositBtn.disabled = true;
                        submitDepositBtn.classList.add('disabled-btn');
                        rejectQuotationBtn.disabled = true;
                        rejectQuotationBtn.classList.add('disabled-btn');
                        // Alternative approach if above doesn't work:
                        // submitDepositBtn.setAttribute('disabled', 'disabled');
                        // rejectQuotationBtn.setAttribute('disabled', 'disabled');
                    } else {
                        alert('Failed to reject quotation: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while rejecting the quotation');
                });
            }
        });
    }
    // On page load, if payment is rejected, disable the submit deposit button
    if (submitDepositBtn && submitDepositBtn.classList.contains('disabled-btn')) {
        submitDepositBtn.disabled = true;
    }
    // Helper to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});