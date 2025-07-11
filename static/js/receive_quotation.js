document.addEventListener('DOMContentLoaded', function() {
    // Any specific JavaScript for quotation page can go here
    console.log('Price Quotation page loaded');
    var submitDepositBtn = document.getElementById('submit-deposit-btn');
    var rejectQuotationBtn = document.getElementById('reject-quotation-btn');
    var rejectionMessage = document.getElementById('rejection-message');
    if (submitDepositBtn) {
        submitDepositBtn.addEventListener('click', function() {
            window.location.href = '/payment';
        });
    }
    if (rejectQuotationBtn) {
        rejectQuotationBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reject this quotation?')) {
                rejectionMessage.style.display = 'block';
                submitDepositBtn.disabled = true;
                rejectQuotationBtn.disabled = true;
                submitDepositBtn.classList.add('disabled');
                rejectQuotationBtn.classList.add('disabled');
            }
        });
    }
});