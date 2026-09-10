(function(){
  // ===== CONFIGURACIÓN (ajusta aquí) =====
  var CONFIG = {
    containerClass: 'BgOne',          // clase del contenedor de Elementor donde va el fondo
    colorPrimary: '108, 100, 255',    // #7064FF en RGB
    colorWhite: '255, 255, 255',
    nodeCount: 70,
    maxDistance: 140,
    nodeSpeed: 0.25,
    nodeRadiusMin: 1.2,
    nodeRadiusMax: 2.6,
    whiteNodeRatio: 0.25,
    lineOpacityMax: 0.35,
    nodeOpacity: 0.85,
    pulseEnabled: true
  };
  // =========================================

  function initNeurons(){
    // el script está dentro de un widget HTML de Elementor;
    // subimos al ancestro con la clase del contenedor
    var scriptTag = document.currentScript;
    var host = scriptTag ? scriptTag.closest('.' + CONFIG.containerClass) : null;

    if (!host){
      // fallback: busca el primer elemento con esa clase en la página
      host = document.querySelector('.' + CONFIG.containerClass);
    }
    if (!host){
      console.warn('No se encontró el contenedor .' + CONFIG.containerClass);
      return;
    }

    // el contenedor necesita position relative para que el canvas absolute funcione
    var computedPosition = window.getComputedStyle(host).position;
    if (computedPosition === 'static'){
      host.style.position = 'relative';
    }

    var canvas = document.createElement('canvas');
    canvas.id = 'neurons-canvas-' + Math.random().toString(36).slice(2,8);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'block';

    // lo insertamos como PRIMER hijo para que quede detrás del resto del contenido
    host.insertBefore(canvas, host.firstChild);

    // aseguramos que el contenido existente del contenedor quede por encima
    Array.prototype.forEach.call(host.children, function(child){
      if (child !== canvas){
        var childPos = window.getComputedStyle(child).position;
        if (childPos === 'static'){
          child.style.position = 'relative';
        }
        if (!child.style.zIndex){
          child.style.zIndex = '1';
        }
      }
    });

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var w, h, dpr, t = 0;
    var rafId;

    function resize(){
      var rect = host.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createNodes(){
      nodes = [];
      for (var i = 0; i < CONFIG.nodeCount; i++){
        var isWhite = Math.random() < CONFIG.whiteNodeRatio;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * CONFIG.nodeSpeed,
          vy: (Math.random() - 0.5) * CONFIG.nodeSpeed,
          r: CONFIG.nodeRadiusMin + Math.random() * (CONFIG.nodeRadiusMax - CONFIG.nodeRadiusMin),
          color: isWhite ? CONFIG.colorWhite : CONFIG.colorPrimary,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    }

    function stepNode(node){
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;
    }

    function draw(){
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++){
        for (var j = i + 1; j < nodes.length; j++){
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.maxDistance){
            var opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacityMax;
            ctx.strokeStyle = 'rgba(' + CONFIG.colorPrimary + ',' + opacity.toFixed(3) + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < nodes.length; k++){
        var n = nodes[k];
        stepNode(n);

        var pulse = CONFIG.pulseEnabled
          ? 0.6 + 0.4 * Math.sin(t * 0.03 + n.pulseOffset)
          : 1;

        var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        glow.addColorStop(0, 'rgba(' + n.color + ',' + (0.18 * pulse).toFixed(3) + ')');
        glow.addColorStop(1, 'rgba(' + n.color + ',0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + n.color + ',' + (CONFIG.nodeOpacity * pulse).toFixed(3) + ')';
        ctx.fill();
      }

      t++;
      rafId = requestAnimationFrame(draw);
    }

    resize();
    createNodes();
    draw();

    var resizeTimeout;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function(){
        resize();
        createNodes();
      }, 150);
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initNeurons);
  } else {
    initNeurons();
  }
})();
