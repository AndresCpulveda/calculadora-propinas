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

  if(objCliente.pedido.length == 0) {
    mensajePedidoVacio();
  }else {
    actualizarResumen();
  }

}

function actualizarResumen() {
  limpiarHtml()
  const contenido = document.querySelector('#resumen .contenido');
  const resumen = document.createElement('div');
  resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow')

  //Info de la mesa
  const mesa = document.createElement('p')
  mesa.textContent = `Mesa: `
  mesa.classList.add('fw-bold')
  
  const mesaSpan = document.createElement('span');
  mesaSpan.textContent = objCliente.mesa;
  mesaSpan.classList.add('fw-normal');
  mesa.append(mesaSpan);

  //Info de la hora
  const hora = document.createElement('p')
  hora.textContent = `Mesa: `
  hora.classList.add('fw-bold')
  
  const horaSpan = document.createElement('span');
  horaSpan.textContent = objCliente.hora;
  horaSpan.classList.add('fw-normal');  
  hora.append(horaSpan);

  // Titulo de la sección
  const heading = document.createElement('h3');
  heading.textContent = 'Platillos Consumidos';
  heading.classList.add('my-4', 'text-center');

  //Iterar sobre el array de pedidos
  const grupo = document.createElement('ul');
  grupo.classList.add('list-group');

  const {pedido} = objCliente;
  pedido.forEach( cur => {
    const {nombre, cantidad, precio, id} = cur;

    const lista = document.createElement('li');
    lista.classList.add('list-group-item');

    const nombreTexto = document.createElement('h4');
    nombreTexto.classList.add('my-4')
    nombreTexto.textContent = nombre;

    // Cantidad del articulo
    const cantidadTexto = document.createElement('p');
    cantidadTexto.classList.add('fw-bold');
    cantidadTexto.textContent = 'Cantidad: '

    const cantidadValor = document.createElement('span');
    cantidadValor.classList.add('fw-normal');
    cantidadValor.textContent = cantidad;

    cantidadTexto.append(cantidadValor);

    //Precio
    const precioTexto = document.createElement('p');
    precioTexto.classList.add('fw-bold');
    precioTexto.textContent = 'Precio: '

    const precioValor = document.createElement('span');
    precioValor.classList.add('fw-normal');
    precioValor.textContent = `$${precio}`;

    precioTexto.append(precioValor);
    
    //Sub-total
    const subtotalTexto = document.createElement('p');
    subtotalTexto.classList.add('fw-bold');
    subtotalTexto.textContent = 'Sub-total: '

    const subtotalValor = document.createElement('span');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = `$${precio * cantidad}`;
    
    // Boton para eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn', 'btn-danger');
    btnEliminar.textContent = 'Eliminar del Pedido';
    
    //Funcion para eliminar del pedido
    btnEliminar.onclick = function() {
      eliminarProducto(id)
    }


    subtotalTexto.append(subtotalValor);
    
    //Agregar elementos al li
    lista.append(nombreTexto, cantidadTexto, precioTexto, subtotalTexto, btnEliminar)
    grupo.append(lista)
  })
  
  //Agregar al contenido
  resumen.append(heading, mesa, hora, grupo);
  contenido.append(resumen)
  mostrarFormPropinas();
}

function limpiarHtml() {
  const contenido = document.querySelector('#resumen .contenido');
  while(contenido.firstChild) {
    contenido.removeChild(contenido.firstChild)
  }
}

function eliminarProducto(id) {
  const filtrado = objCliente.pedido.filter(ele => ele.id !== id)
  objCliente.pedido = filtrado;

  const borrado = document.querySelector(`#producto-${id}`)
  borrado.value = 0

  if(objCliente.pedido.length == 0) {
    mensajePedidoVacio();
  }else {
    actualizarResumen();
  }
}

function mensajePedidoVacio() {
  limpiarHtml()
  const contenido = document.querySelector('#resumen .contenido');

  const texto = document.createElement('p')
  texto.classList.add('text-center')
  texto.textContent = 'Añade los elementos del pedido'

  contenido.append(texto)
}

function mostrarFormPropinas() {
  const contenido = document.querySelector('#resumen .contenido');

  const formulario = document.createElement('div')
  formulario.classList.add('col-md-6', 'formulario')

  const divForm = document.createElement('div')
  divForm.classList.add('card', 'py-2', 'px-3', 'shadow')

  const heading = document.createElement('h3')
  heading.classList.add('my-4', 'text-center')
  heading.textContent = 'Propina'

  //Radio button 10%
  const radio10 = document.createElement('input')
  radio10.type = 'radio'
  radio10.name = 'propina'
  radio10.value = 10
  radio10.classList.add('form-check-input')
  radio10.onclick = function() {
    calcularPropina(radio10.value)
  }

  const radio10Label = document.createElement('label')
  radio10Label.textContent = '10%'
  radio10Label.classList.add('form-check-label')

  const radio10Div = document.createElement('div')
  radio10Div.classList.add('form-check')

  radio10Div.append(radio10, radio10Label)
  
  //Radio button 20%
  const radio20 = document.createElement('input')
  radio20.type = 'radio'
  radio20.name = 'propina'
  radio20.value = 20
  radio20.classList.add('form-check-input')
  radio20.onclick = function() {
    calcularPropina(radio20.value)
  }

  const radio20Label = document.createElement('label')
  radio20Label.textContent = '20%'
  radio20Label.classList.add('form-check-label')

  const radio20Div = document.createElement('div')
  radio20Div.classList.add('form-check')

  radio20Div.append(radio20, radio20Label)

  //Radio button 25%
  const radio25 = document.createElement('input')
  radio25.type = 'radio'
  radio25.name = 'propina'
  radio25.value = 25
  radio25.classList.add('form-check-input')
  radio25.onclick = function() {
    calcularPropina(radio25.value)
  }

  const radio25Label = document.createElement('label')
  radio25Label.textContent = '25%'
  radio25Label.classList.add('form-check-label')

  const radio25Div = document.createElement('div')
  radio25Div.classList.add('form-check')

  radio25Div.append(radio25, radio25Label)


  divForm.append(heading, radio10Div, radio20Div, radio25Div)
  formulario.append(divForm)
  contenido.append(formulario)
  
}

function calcularPropina(porcentaje) {
  const {pedido} = objCliente;
  let subtotal = 0;
  pedido.forEach( cur => {
    subtotal += cur.precio * cur.cantidad
  })
  const propina = parseInt(subtotal * (porcentaje / 100))
  const total = parseInt(subtotal * (porcentaje / 100 + 1))

  mostrarTotal(subtotal, total, propina)
}

function mostrarTotal(subtotal, total, propina) {

  const divTotales = document.createElement('div')
  divTotales.id = 'container-totales'

  const subtotalText = document.createElement('p')
  subtotalText.classList.add('fs-4', 'fw-bold', 'mt-2')
  subtotalText.textContent = `Subtotal Consumo: `

  const subtotalSpan = document.createElement('span')
  subtotalSpan.classList.add('fw-normal')
  subtotalSpan.textContent = `$${subtotal}`

  subtotalText.append(subtotalSpan);

  const propinaText = document.createElement('p')
  propinaText.classList.add('fs-4', 'fw-bold', 'mt-2')
  propinaText.textContent = `Propina: `

  const propinaSpan = document.createElement('span')
  propinaSpan.classList.add('fw-normal')
  propinaSpan.textContent = `$${propina}`

  propinaText.append(propinaSpan);

  const totalText = document.createElement('p')
  totalText.classList.add('fs-4', 'fw-bold', 'mt-2')
  totalText.textContent = `Total: `

  const totalSpan = document.createElement('span')
  totalSpan.classList.add('fw-normal')
  totalSpan.textContent = `$${total}`

  totalText.append(totalSpan);

  const containerTotales = document.querySelector('#container-totales')
  if(containerTotales) {
    containerTotales.remove()
  }

  divTotales.append(subtotalText, propinaText, totalText)

  const formulario = document.querySelector('.formulario > div')
  formulario.append(divTotales)
}