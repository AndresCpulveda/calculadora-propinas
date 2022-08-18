//Variables
  let objCliente = { //Acá se guardará la info del cliente una vez submitted
    mesa: '',
    hora: '',
    pedido: [],
  }
  const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres',
  }
  //Selectores
    const btnGuardarCliente = document.querySelector('#guardar-cliente');    

//Event Listeners
btnGuardarCliente.addEventListener('click', validarFormulario)



//Funciones
function validarFormulario() { //Revisa si los campos de mesa y hora fueron llenados y no estan vacios
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;

  const estaVacio = [mesa, hora].some( cur => cur == '') //Si el metodo some encuentra un string vacio devuelve true
  if(estaVacio) {//Si exite un elemento vacio se imprime una alerta
    if(!document.querySelector('.alerta-activa')) {
      const alert = document.createElement('div');
      alert.classList.add('alerta-activa', 'invalid-feedback', 'd-block', 'text-center', 'fw-bold')
      alert.textContent = 'Llena ambos campos para crear una orden'
      document.querySelector('.modal-body form').append(alert); //Agregamos la alert como child del elemento form dentro de la clase modal-body
      setTimeout(() => {
        alert.remove()
      }, 3000);
    }
    return;
  }
  //Se asigna las variables de mesa y hora al objeto de cliente sin perder la propiedad pedidos ni sobreescribir los datos (ver video 265)
  objCliente = {...objCliente, mesa, hora}

  //Ocultar modal
  const modalFormulario = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  mostrarSecciones()
  consultarPlatillos()
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll('.d-none');
  seccionesOcultas.forEach(cur => cur.classList.remove('d-none'))
}

function consultarPlatillos() {
  const url = 'http://localhost:4000/platillos'
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarPlatillos(resultado))
}

function mostrarPlatillos(datos) {
  console.log(datos);
  const contenido = document.querySelector('#platillos .contenido')
  datos.forEach( cur => {
    const row = document.createElement('div');
    row.classList.add('row');

    const nombre = document.createElement('div');
    nombre.classList.add('col-md-4');
    nombre.textContent = cur.nombre;

    const precio = document.createElement('div');
    precio.classList.add('col-md-3', 'fw-bold')
    precio.textContent = `$ ${cur.precio}`;

    const categoria = document.createElement('div')
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[cur.categoria];

    const containerCantidad = document.createElement('div')
    containerCantidad.classList.add('col-md-2')
    const cantidad = document.createElement('input')
    cantidad.classList.add('form-control');
    cantidad.type = 'number';
    cantidad.min = 0;
    cantidad.id = `producto-${cur.id}`
    cantidad.value = 0
    cantidad.onchange = function () {
      editarCantidad(cur, Number(cantidad.value))
    }
    containerCantidad.append(cantidad)

    row.append(nombre, precio, categoria, containerCantidad)
    contenido.append(row)
  })
}

function editarCantidad(platillo, cantidad) {
  const {nombre, precio, id} = platillo;
  const objeto = {
    nombre,
    precio,
    id,
    cantidad,
  }
  if(cantidad > 0) {
    const existe = objCliente.pedido.some(cur => cur.id == objeto.id)
    if(existe) {
      const listaNueva = objCliente.pedido.map(cur => {
        if(cur.id == objeto.id) {
          return objeto;
        }else {
          return cur;
        }
      })
      objCliente.pedido = listaNueva;
    }else {
      objCliente.pedido = [...objCliente.pedido, objeto]
    }
  }else {
    const filtrado = objCliente.pedido.filter(ele => ele.id != id)
    objCliente.pedido = filtrado;
  }
  actualizarResumen();
}

function actualizarResumen() {
  
}
