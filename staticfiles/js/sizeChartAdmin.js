// Most functionality is now handled by Django templates
// This file can be kept for any additional client-side functionality you need

document.addEventListener('DOMContentLoaded', function() {
    // Reset form button
    document.getElementById('resetForm').addEventListener('click', function() {
        document.getElementById('sizeChartForm').reset();
        document.getElementById('sizeFieldsContainer').innerHTML = '';
    });
    
    // Any other client-side interactions can go here
});