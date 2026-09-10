  // NOTA PARA DESARROLLO: este formulario aún NO está conectado a ningún
  // destino (sin Brevo, sin CRM, sin Excel/Power Automate). El submit
  // solo se intercepta para que la vista previa no recargue la página,
  // y aquí se muestra un ejemplo simple de validación visual de campos
  // obligatorios. Cuando se defina el destino final, reemplazar este
  // bloque por el envío real (fetch a un endpoint, Power Automate, etc.).
  document.getElementById('formAgendaDemo').addEventListener('submit', function(e){
    e.preventDefault();
    this.querySelectorAll('.field, .consent').forEach(function(field){
      field.classList.remove('has-error');
    });
    this.querySelectorAll('[required]').forEach(function(el){
      const vacio = el.type === 'checkbox' ? !el.checked : !el.value;
      if(vacio){
        el.closest('.field, .consent').classList.add('has-error');
      }
    });
  });
  document.querySelectorAll('select.placeholder-active').forEach(function(sel){
    sel.addEventListener('change', function(){
      this.classList.toggle('placeholder-active', this.value === '');
    });
  });
