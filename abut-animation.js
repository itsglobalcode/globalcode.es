import * as THREE from "three"
import gsap from "gsap"

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si la sección existe
  const aboutSection = document.getElementById("about")
  if (!aboutSection) return

  // Configuración de Three.js
  const container = document.querySelector(".about-3d-container")
  const width = container.clientWidth
  const height = container.clientHeight

  // Crear escena, cámara y renderer
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, 10, 10)
  scene.add(directionalLight)

  // Crear geometrías para la animación
  const geometries = []
  const materials = []
  const meshes = []

  // Colores de la marca
  const colors = [
    0x0088e0, // primary-blue
    0x003b73, // dark-blue
    0x4db5ff, // light-blue
    0x9c42fe, // purple
  ]

  // Crear varias formas geométricas
  for (let i = 0; i < 15; i++) {
    // Alternar entre diferentes geometrías
    let geometry
    const geometryType = i % 4

    switch (geometryType) {
      case 0:
        geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.5, 0)
        break
      case 1:
        geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.3, 0)
        break
      case 2:
        geometry = new THREE.TetrahedronGeometry(Math.random() * 0.5 + 0.4, 0)
        break
      case 3:
        geometry = new THREE.TorusGeometry(Math.random() * 0.3 + 0.2, 0.1, 16, 100)
        break
    }

    geometries.push(geometry)

    // Material con brillo y transparencia
    const material = new THREE.MeshPhysicalMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })

    materials.push(material)

    // Crear mesh y posicionarlo aleatoriamente
    const mesh = new THREE.Mesh(geometry, material)

    // Distribuir en un espacio 3D
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 5 - 5 // Mover hacia atrás para que se vea mejor

    // Rotación inicial aleatoria
    mesh.rotation.x = Math.random() * Math.PI
    mesh.rotation.y = Math.random() * Math.PI

    // Guardar velocidades de rotación para la animación
    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      },
      floatSpeed: Math.random() * 0.005 + 0.002,
      floatDistance: Math.random() * 0.5 + 0.5,
      initialY: mesh.position.y,
    }

    meshes.push(mesh)
    scene.add(mesh)
  }

  // Posicionar cámara
  camera.position.z = 10

  // Crear efecto de partículas para el fondo
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 500
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  // Animación
  const animate = () => {
    requestAnimationFrame(animate)

    // Rotar cada objeto
    meshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotationSpeed.x
      mesh.rotation.y += mesh.userData.rotationSpeed.y
      mesh.rotation.z += mesh.userData.rotationSpeed.z

      // Efecto de flotación
      mesh.position.y =
        mesh.userData.initialY + Math.sin(Date.now() * mesh.userData.floatSpeed) * mesh.userData.floatDistance
    })

    // Rotar partículas lentamente
    particlesMesh.rotation.y += 0.0005

    renderer.render(scene, camera)
  }

  // Iniciar animación
  animate()

  // Responsive: ajustar tamaño al cambiar dimensiones de la ventana
  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth
    const newHeight = container.clientHeight

    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()

    renderer.setSize(newWidth, newHeight)
  })

  // Efecto parallax al mover el mouse
  document.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1

    // Mover la cámara ligeramente según la posición del mouse
    gsap.to(camera.position, {
      x: mouseX * 0.5,
      y: -mouseY * 0.5,
      duration: 1,
      ease: "power2.out",
    })
  })
})
