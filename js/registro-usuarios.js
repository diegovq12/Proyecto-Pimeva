let usuarios_registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

window.onload = () => {
    const form = document.getElementById("registro-usuarios");
    const tablaUsuarios = document.getElementById("tabla-usuarios");

    form.onsubmit = (e) => {
        e.preventDefault();
    
        const nombre = document.getElementById("nombre").value.trim();
        const celular = document.getElementById("cel").value.trim();
        const agencia = document.getElementById("agencia").value.trim();
        const buque = document.getElementById("buque").value.trim();
    
        if (nombre === "" || celular === "" || agencia === "" || buque === "") {
            alert("Por favor complete todos los campos");
            return;
        }
    
        const usuario = {
            nombre,
            celular,
            agencia,
            buque
        };
    
        usuarios_registrados.push(usuario);
        console.log(usuarios_registrados);
    
        form.reset();
    
        const usuariosRegistradosString = JSON.stringify(usuarios_registrados);
        localStorage.setItem("usuarios_registrados", usuariosRegistradosString);
    
        actualizarTabla();
    };
    

    function actualizarTabla() {
        const tableTemplate = usuarios_registrados.map((usuario, index) => {
            return `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.celular}</td>
                    <td>${usuario.agencia}</td>
                    <td>${usuario.buque}</td>
                    <td>
                        <button class="botones-usuario" onclick="editarUsuario(${index})">Editar</button>
                        <button class="botones-usuario" onclick="eliminarUsuario(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        tablaUsuarios.innerHTML = tableTemplate.join("");
    }

    window.eliminarUsuario = function(index) {
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            usuarios_registrados.splice(index, 1);
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios_registrados));
            actualizarTabla();
        }
    };

    actualizarTabla();
};