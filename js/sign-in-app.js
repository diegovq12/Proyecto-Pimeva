let usuarios_registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
});
function submitForm() {
    const idInput = document.getElementById("matriculaInput").value;
    const idInputNum = Number(document.getElementById("matriculaInput").value); // Convertir el valor de entrada a número
    const contrasenaInput = document.getElementById("floatingPassword").value;
    if (idInput === "" || contrasenaInput === "") {
        alert("Por favor complete todos los campos");
        return;
    }

    const usuarioEncontrado = usuarios_registrados.find(usuario =>
        usuario.id === idInputNum && usuario.contrasena === contrasenaInput
    );
    console.log(usuarioEncontrado);
    if (!usuarioEncontrado) {
        alert("Usuario o contraseña incorrectos");
        return;
    }
    else {
        if (usuarioEncontrado.rango === "Administrador") {
            window.location.href = "admin.html";
        }
        else {
            window.location.href = "usuarios.html";
        }
    }

    form.reset();
    
}

document.getElementById("submitButton").addEventListener("click", function (event) {
    event.preventDefault();
    submitForm();
});

document.getElementById("submitButton").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitForm();
    }
});


// document.getElementById("idInput").addEventListener("input");
// document.getElementById("contrasenaInput").addEventListener("input");

