document.addEventListener('DOMContentLoaded', function() {
    // Reset form button
    document.getElementById('resetForm').addEventListener('click', function() {
        document.getElementById('sizeChartForm').reset();
        document.getElementById('sizeFieldsContainer').innerHTML = '';
    });
    
    // Handle checkbox changes for active charts
    document.querySelectorAll('input[type="checkbox"][onclick*="toggle_active"]').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.preventDefault();
            
            const chartId = this.getAttribute('onclick').match(/toggle_active=(\d+)/)[1];
            const isActive = this.checked;
            
            fetch(`{% url 'size_chart_editor' %}?toggle_active=${chartId}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Reload the page to reflect changes
                    window.location.reload();
                } else {
                    alert('Error: ' + data.message);
                    this.checked = !isActive; // Revert checkbox state
                }
            })
        });
    });
    
    // Any other client-side interactions can go here
});