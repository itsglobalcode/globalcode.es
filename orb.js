document.addEventListener("DOMContentLoaded", () => {
    // Configuración de propiedades (volviendo a los colores originales)
    const config = {
      hue: 0, // Volviendo al tono original
      hoverIntensity: 0.5, // Intensidad original
      rotateOnHover: true, // Activa o desactiva la rotación continua al pasar el cursor
      forceHoverState: true, // Activando el estado hover forzado para que siempre se vea
    }
  
    const canvas = document.getElementById("orbCanvas")
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      antialias: true,
    })
  
    if (!gl) {
      console.error("WebGL no está disponible en este navegador.")
      return
    }
  
    // Limpiar el color de fondo (transparente)
    gl.clearColor(0, 0, 0, 0)
  
    // Shaders (copiados directamente del componente React)
    const vertexShaderSource = `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `
  
    const fragmentShaderSource = `
      precision highp float;
  
      uniform float iTime;
      uniform vec3 iResolution;
      uniform float hue;
      uniform float hover;
      uniform float rot;
      uniform float hoverIntensity;
      varying vec2 vUv;
  
      vec3 rgb2yiq(vec3 c) {
        float y = dot(c, vec3(0.299, 0.587, 0.114));
        float i = dot(c, vec3(0.596, -0.274, -0.322));
        float q = dot(c, vec3(0.211, -0.523, 0.312));
        return vec3(y, i, q);
      }
      
      vec3 yiq2rgb(vec3 c) {
        float r = c.x + 0.956 * c.y + 0.621 * c.z;
        float g = c.x - 0.272 * c.y - 0.647 * c.z;
        float b = c.x - 1.106 * c.y + 1.703 * c.z;
        return vec3(r, g, b);
      }
      
      vec3 adjustHue(vec3 color, float hueDeg) {
        float hueRad = hueDeg * 3.14159265 / 180.0;
        vec3 yiq = rgb2yiq(color);
        float cosA = cos(hueRad);
        float sinA = sin(hueRad);
        float i = yiq.y * cosA - yiq.z * sinA;
        float q = yiq.y * sinA + yiq.z * cosA;
        yiq.y = i;
        yiq.z = q;
        return yiq2rgb(yiq);
      }
  
      vec3 hash33(vec3 p3) {
        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
        p3 += dot(p3, p3.yxz + 19.19);
        return -1.0 + 2.0 * fract(vec3(
          p3.x + p3.y,
          p3.x + p3.z,
          p3.y + p3.z
        ) * p3.zyx);
      }
  
      float snoise3(vec3 p) {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;
        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        vec3 d1 = d0 - (i1 - K2);
        vec3 d2 = d0 - (i2 - K1);
        vec3 d3 = d0 - 0.5;
        vec4 h = max(0.6 - vec4(
          dot(d0, d0),
          dot(d1, d1),
          dot(d2, d2),
          dot(d3, d3)
        ), 0.0);
        vec4 n = h * h * h * h * vec4(
          dot(d0, hash33(i)),
          dot(d1, hash33(i + i1)),
          dot(d2, hash33(i + i2)),
          dot(d3, hash33(i + 1.0))
        );
        return dot(vec4(31.316), n);
      }
  
      vec4 extractAlpha(vec3 colorIn) {
        float a = max(max(colorIn.r, colorIn.g), colorIn.b);
        return vec4(colorIn.rgb / (a + 1e-5), a);
      }
  
      const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
      const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
      const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
      const float innerRadius = 0.6;
      const float noiseScale = 0.65;
  
      float light1(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * attenuation);
      }
      float light2(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * dist * attenuation);
      }
  
      vec4 draw(vec2 uv) {
        vec3 color1 = adjustHue(baseColor1, hue);
        vec3 color2 = adjustHue(baseColor2, hue);
        vec3 color3 = adjustHue(baseColor3, hue);
        
        float ang = atan(uv.y, uv.x);
        float len = length(uv);
        float invLen = len > 0.0 ? 1.0 / len : 0.0;
        
        float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
        float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
        float d0 = distance(uv, (r0 * invLen) * uv);
        float v0 = light1(1.0, 10.0, d0);
        v0 *= smoothstep(r0 * 1.05, r0, len);
        float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
        
        float a = iTime * -1.0;
        vec2 pos = vec2(cos(a), sin(a)) * r0;
        float d = distance(uv, pos);
        float v1 = light2(1.5, 5.0, d);
        v1 *= light1(1.0, 50.0, d0);
        
        float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
        float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
        
        vec3 col = mix(color1, color2, cl);
        col = mix(color3, col, v0);
        col = (col + v1) * v2 * v3;
        col = clamp(col, 0.0, 1.0);
        
        return extractAlpha(col);
      }
  
      vec4 mainImage(vec2 fragCoord) {
        vec2 center = iResolution.xy * 0.5;
        float size = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord - center) / size * 2.0;
        
        float angle = rot;
        float s = sin(angle);
        float c = cos(angle);
        uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
        
        uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
        uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
        
        return draw(uv);
      }
  
      void main() {
        vec2 fragCoord = vUv * iResolution.xy;
        vec4 col = mainImage(fragCoord);
        gl_FragColor = vec4(col.rgb * col.a, col.a);
      }
    `
  
    // Compilar shaders
    function compileShader(gl, source, type) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
  
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error al compilar shader:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
  
      return shader
    }
  
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
  
    // Crear programa
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Error al enlazar programa:", gl.getProgramInfoLog(program))
      return
    }
  
    // Crear un triángulo que cubre toda la pantalla
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])
  
    const uvs = new Float32Array([0.0, 0.0, 2.0, 0.0, 0.0, 2.0])
  
    // Crear buffers
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  
    // Obtener ubicaciones de atributos y uniformes
    const positionLocation = gl.getAttribLocation(program, "position")
    const uvLocation = gl.getAttribLocation(program, "uv")
  
    const timeUniform = gl.getUniformLocation(program, "iTime")
    const resolutionUniform = gl.getUniformLocation(program, "iResolution")
    const hueUniform = gl.getUniformLocation(program, "hue")
    const hoverUniform = gl.getUniformLocation(program, "hover")
    const rotUniform = gl.getUniformLocation(program, "rot")
    const hoverIntensityUniform = gl.getUniformLocation(program, "hoverIntensity")
  
    // Función para redimensionar el canvas
    function resize() {
      const container = canvas.parentElement
      const dpr = window.devicePixelRatio || 1
      const width = container.clientWidth
      const height = container.clientHeight
  
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
  
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
  
    // Variables para la animación
    let targetHover = 0
    let currentHover = 0
    let currentRot = 0
    let lastTime = 0
    const rotationSpeed = 0.3 // radianes por segundo
  
    // Manejar eventos del mouse
    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const width = rect.width
      const height = rect.height
      const size = Math.min(width, height)
      const centerX = width / 2
      const centerY = height / 2
      const uvX = ((x - centerX) / size) * 2.0
      const uvY = ((y - centerY) / size) * 2.0
  
      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
        targetHover = 1
      } else {
        targetHover = 0
      }
    }
  
    function handleMouseLeave() {
      targetHover = 0
    }
  
    // Función de renderizado
    function render(timestamp) {
      const dt = (timestamp - lastTime) * 0.001
      lastTime = timestamp
  
      // Actualizar valores
      const time = timestamp * 0.001
      const effectiveHover = config.forceHoverState ? 0.5 + Math.sin(time * 0.5) * 0.5 : targetHover
      currentHover += (effectiveHover - currentHover) * 0.1
  
      if (config.rotateOnHover && currentHover > 0.5) {
        currentRot += dt * rotationSpeed
      } else {
        currentRot += dt * rotationSpeed * 0.2
      }
  
      // Limpiar canvas
      gl.clear(gl.COLOR_BUFFER_BIT)
  
      // Usar programa
      gl.useProgram(program)
  
      // Configurar atributos
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
      gl.enableVertexAttribArray(uvLocation)
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0)
  
      // Configurar uniformes
      gl.uniform1f(timeUniform, time)
      gl.uniform3f(resolutionUniform, canvas.width, canvas.height, canvas.width / canvas.height)
      gl.uniform1f(hueUniform, config.hue)
      gl.uniform1f(hoverUniform, currentHover)
      gl.uniform1f(rotUniform, currentRot)
      gl.uniform1f(hoverIntensityUniform, config.hoverIntensity)
  
      // Dibujar
      gl.drawArrays(gl.TRIANGLES, 0, 3)
  
      // Continuar animación
      requestAnimationFrame(render)
    }
  
    // Inicializar
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
  
    resize()
    requestAnimationFrame(render)
  })
  