document.addEventListener('DOMContentLoaded', function() {
    // File upload and preview functionality
    const fileInput = document.getElementById('payment-proof');
    const filePreviewContainer = document.getElementById('file-preview-container');
    const filePreview = document.getElementById('file-preview');
    const removeFileBtn = document.getElementById('remove-file');
    const paymentForm = document.getElementById('payment-form');
    const submissionMessage = document.getElementById('submission-message');
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid file type (JPG, PNG, or PDF).');
                this.value = '';
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit.');
                this.value = '';
                return;
            }
            
            // Display preview as a clickable link
            filePreview.innerHTML = '';
            const fileUrl = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = file.name + ' (Click to preview)';
            link.style.display = 'block';
            filePreview.appendChild(link);
            
            filePreviewContainer.classList.remove('hidden');
        }
    });
    
    removeFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        filePreviewContainer.classList.add('hidden');
    });
    
    // REMOVE the following block to allow normal form submission:
    // paymentForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     // Here you would normally send the form data to the server
    //     // For this demo, we'll just show a success message
    //     // Hide form and show success message
    //     paymentForm.classList.add('hidden');
    //     submissionMessage.classList.remove('hidden');
    //     // Scroll to the message
    //     submissionMessage.scrollIntoView({ behavior: 'smooth' });
    //     // In a real app, you would submit the form via AJAX here
    //     // and handle the server response
    // });
});