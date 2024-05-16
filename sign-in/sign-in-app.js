document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
});
function submitForm() {
    var matriculaDefecto = "372688";
    var passwordDefecto = "1234";
    var matriculaInput = document.getElementById('matriculaInput').value;
    var passwordInput = document.getElementById('floatingPassword').value;

    if (matriculaInput === matriculaDefecto && passwordInput === passwordDefecto) {
        window.location.href = "../index.html";
    } else {
        alert("Usuario o contraseña incorrectos");
        document.getElementById('matriculaInput').value = "Incorrecto";
        document.getElementById('floatingPassword').value = "";
    }
}

document.getElementById("submitButton").addEventListener("click", function(event) {
    event.preventDefault(); 
    submitForm();
});

document.getElementById("matriculaInput").addEventListener("input");
document.getElementById("floatingPassword").addEventListener("input");
