document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector("#flashMessages")) {
        setTimeout(() => {
            document.querySelector("#flashMessages").innerHTML = '';
        },3000);
    }
});