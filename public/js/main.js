document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector("#flashMessages")) {
        setTimeout(() => {
            document.querySelector("#flashMessages").innerHTML = '';
        },3000);
    }

    if(document.querySelector("#a2f")) {
        document.querySelector("#a2f").addEventListener('change', function() {
            document.querySelector("#zone_a2f").style.display = this.checked ? 'block' : 'none';
        });
    }
});

