
import { useEffect, useRef } from 'react';

const RotatingCube = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Cube properties
    const cube = {
      size: 50,
      position: { x: canvas.width / 2, y: canvas.height / 2 },
      rotation: { x: 0, y: 0, z: 0 },
      vertices: [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 }
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0], // back face
        [4, 5], [5, 6], [6, 7], [7, 4], // front face
        [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
      ]
    };

    const rotatePoint = (point: { x: number, y: number, z: number }, rotation: { x: number, y: number, z: number }) => {
      // Rotate around X axis
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y1 = point.y * cosX - point.z * sinX;
      const z1 = point.z * cosX + point.y * sinX;

      // Rotate around Y axis
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x2 = point.x * cosY + z1 * sinY;
      const z2 = z1 * cosY - point.x * sinY;

      // Rotate around Z axis
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = y1 * cosZ + x2 * sinZ;

      return { x: x3, y: y3, z: z2 };
    };

    const projectPoint = (point: { x: number, y: number, z: number }) => {
      // Simple perspective projection
      const distance = 3;
      const z = 1 / (distance - point.z);
      return {
        x: point.x * z * cube.size + cube.position.x,
        y: point.y * z * cube.size + cube.position.y
      };
    };

    const drawCube = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotation
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
      
      // Compute the 3D positions (rotated)
      const rotatedVertices = cube.vertices.map(vertex => 
        rotatePoint(vertex, cube.rotation)
      );
      
      // Project the 3D points to 2D space
      const projectedVertices = rotatedVertices.map(vertex => 
        projectPoint(vertex)
      );
      
      // Draw edges with gradient
      ctx.lineWidth = 2;
      for (const [i, j] of cube.edges) {
        const start = projectedVertices[i];
        const end = projectedVertices[j];
        
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, 'rgba(74, 124, 89, 0.7)');
        gradient.addColorStop(1, 'rgba(106, 158, 192, 0.7)');
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      
      // Draw vertices
      for (const vertex of projectedVertices) {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 124, 89, 0.8)';
        ctx.fill();
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      drawCube();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default RotatingCube;
