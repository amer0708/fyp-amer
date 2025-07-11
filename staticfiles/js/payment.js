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
            
            // Display preview
            filePreview.innerHTML = '';
            
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    filePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                // For PDF, show a file icon
                const fileIcon = document.createElement('div');
                fileIcon.className = 'file-icon';
                fileIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
                filePreview.appendChild(fileIcon);
                
                const fileName = document.createElement('div');
                fileName.textContent = file.name;
                filePreview.appendChild(fileName);
            }
            
            filePreviewContainer.classList.remove('hidden');
        }
    });
    
    removeFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        filePreviewContainer.classList.add('hidden');
    });
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would normally send the form data to the server
        // For this demo, we'll just show a success message
        
        // Hide form and show success message
        paymentForm.classList.add('hidden');
        submissionMessage.classList.remove('hidden');
        
        // Scroll to the message
        submissionMessage.scrollIntoView({ behavior: 'smooth' });
        
        // In a real app, you would submit the form via AJAX here
        // and handle the server response
    });
});