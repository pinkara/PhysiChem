import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Move, Pencil, MousePointer, Trash2 } from 'lucide-react';

// --- TYPES ---
type ToolType = 'select' | 'draw' | 'erase' | 'grab';
type SimulationMode = 'edit' | 'simulate';

interface Vector2D {
  x: number;
  y: number;
}

interface PhysicsObject {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
  radius: number;
  color: string;
  isDragging?: boolean;
}

interface PathPoint {
  x: number;
  y: number;
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
  vx: number;
  vy: number;
}

interface MechanicsSimulatorProps {
  height?: string;
  controls?: boolean;
}

// --- COMPOSANT PRINCIPAL ---
export function MechanicsSimulator({ 
  height = '500px',
  controls = true
}: MechanicsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mousePosRef = useRef<Vector2D>({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const lastPathPointRef = useRef<Vector2D | null>(null);
  const mouseHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const isGrabbingRef = useRef(false);
  
  // États
  const [mode, setMode] = useState<SimulationMode>('edit');
  const [tool, setTool] = useState<ToolType>('select');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  
  // Paramètres physiques
  const [gravity, setGravity] = useState(9.81);
  const [friction, setFriction] = useState(0.1);
  const [restitution, setRestitution] = useState(0.7);
  
  // Objet physique
  const [object, setObject] = useState<PhysicsObject>({
    id: 'obj1',
    position: { x: 250, y: 100 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass: 1,
    radius: 15,
    color: '#3b82f6'
  });
  
  // Chemin dessiné
  const [path, setPath] = useState<PathPoint[]>([]);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [showForces, setShowForces] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  
  // Échelle: 1m = 50 pixels
  const SCALE = 50;
  const DT = 0.016; // 60 FPS
  
  // Convertir pixels en mètres
  const toMeters = (px: number) => px / SCALE;
  const toPixels = (m: number) => m * SCALE;
  
  // Distance point-segment
  const pointToSegmentDistance = (p: Vector2D, a: Vector2D, b: Vector2D): number => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    
    if (len2 === 0) return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
    
    let t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    const proj = { x: a.x + t * dx, y: a.y + t * dy };
    
    return Math.sqrt((p.x - proj.x) ** 2 + (p.y - proj.y) ** 2);
  };
  
  // Dessiner une flèche
  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len < 5) return;
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Tête
    const headLen = 8;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    
    // Label
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(label, x2 + 10, y2 - 5);
    
    ctx.restore();
  };
  
  // Dessiner les infos
  const drawInfo = (ctx: CanvasRenderingContext2D, obj: PhysicsObject, currentTime: number) => {
    const x = 10;
    const y = 10;
    
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(x, y, 160, 130);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(x, y, 160, 130);
    
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    ctx.fillText(`t = ${currentTime.toFixed(2)} s`, x + 10, y + 25);
    ctx.fillText(`x = ${toMeters(obj.position.x - 250).toFixed(2)} m`, x + 10, y + 45);
    ctx.fillText(`y = ${toMeters(350 - obj.position.y).toFixed(2)} m`, x + 10, y + 65);
    ctx.fillText(`vx = ${obj.velocity.x.toFixed(2)} m/s`, x + 10, y + 85);
    ctx.fillText(`vy = ${obj.velocity.y.toFixed(2)} m/s`, x + 10, y + 105);
    ctx.fillText(`Ec = ${(0.5 * obj.mass * (obj.velocity.x ** 2 + obj.velocity.y ** 2)).toFixed(2)} J`, x + 10, y + 125);
  };
  
  // Calculer la physique
  const calculatePhysics = useCallback(() => {
    setObject(prev => {
      const obj = { ...prev };
      
      // Forces appliquées
      let fx = 0;
      let fy = obj.mass * gravity; // Poids
      
      // Frottement avec l'air
      fx -= friction * obj.velocity.x;
      fy -= friction * obj.velocity.y;
      
      // Loi de Newton: F = ma => a = F/m
      obj.acceleration.x = fx / obj.mass;
      obj.acceleration.y = fy / obj.mass;
      
      // Intégration d'Euler
      obj.velocity.x += obj.acceleration.x * DT * timeScale;
      obj.velocity.y += obj.acceleration.y * DT * timeScale;
      
      // Mise à jour position
      obj.position.x += toPixels(obj.velocity.x * DT * timeScale);
      obj.position.y += toPixels(obj.velocity.y * DT * timeScale);
      
      // Collision avec les bords
      const canvas = canvasRef.current;
      if (canvas) {
        // Sol et plafond
        if (obj.position.y > canvas.height - obj.radius) {
          obj.position.y = canvas.height - obj.radius;
          obj.velocity.y = -obj.velocity.y * restitution;
          obj.velocity.x *= (1 - friction);
        }
        if (obj.position.y < obj.radius) {
          obj.position.y = obj.radius;
          obj.velocity.y = -obj.velocity.y * restitution;
        }
        
        // Murs
        if (obj.position.x > canvas.width - obj.radius) {
          obj.position.x = canvas.width - obj.radius;
          obj.velocity.x = -obj.velocity.x * restitution;
        }
        if (obj.position.x < obj.radius) {
          obj.position.x = obj.radius;
          obj.velocity.x = -obj.velocity.x * restitution;
        }
      }
      
      // Collision avec le chemin
      if (path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          const p1 = path[i];
          const p2 = path[i + 1];
          
          const dist = pointToSegmentDistance(obj.position, p1, p2);
          if (dist < obj.radius + 3) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len;
            const ny = dx / len;
            
            obj.position.x += nx * 2;
            obj.position.y += ny * 2;
            
            const dot = obj.velocity.x * nx + obj.velocity.y * ny;
            obj.velocity.x -= 2 * dot * nx * restitution;
            obj.velocity.y -= 2 * dot * ny * restitution;
          }
        }
      }
      
      return obj;
    });
    
    // Enregistrer trajectoire
    setTrail(prev => {
      const newPoint = {
        x: object.position.x,
        y: object.position.y,
        t: time,
        vx: object.velocity.x,
        vy: object.velocity.y
      };
      return [...prev, newPoint].slice(-300);
    });
  }, [gravity, friction, restitution, timeScale, path, object.position, object.velocity, time]);
  
  // Rendu Canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fond
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Axes
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
    }
    
    // Chemin dessiné
    if (path.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
      
      ctx.fillStyle = '#f59e0b';
      path.forEach((p, i) => {
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    
    // Trajectoire
    if (showTrail && trail.length > 1) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.stroke();
    }
    
    // Forces
    if (showForces) {
      const centerX = object.position.x;
      const centerY = object.position.y;
      
      // Poids (échelle réduite pour visibilité)
      const weightLength = Math.min(80, gravity * 4);
      drawArrow(ctx, centerX, centerY, centerX, centerY + weightLength, '#ef4444', `P = ${(object.mass * gravity).toFixed(1)}N`);
      
      // Frottement (opposé à la vitesse)
      if (Math.abs(object.velocity.x) > 0.1 || Math.abs(object.velocity.y) > 0.1) {
        const vMag = Math.sqrt(object.velocity.x ** 2 + object.velocity.y ** 2);
        const fFriction = friction * vMag * 20; // Échelle visuelle
        if (fFriction > 5) {
          const fx = -(object.velocity.x / vMag) * fFriction;
          const fy = -(object.velocity.y / vMag) * fFriction;
          drawArrow(ctx, centerX, centerY, centerX + fx, centerY + fy, '#7c3aed', 'f');
        }
        
        // Vecteur vitesse
        drawArrow(ctx, centerX, centerY, 
          centerX + object.velocity.x * 15, 
          centerY + object.velocity.y * 15, 
          '#22c55e', 'v'
        );
      }
    }
    
    // Objet
    ctx.save();
    ctx.translate(object.position.x, object.position.y);
    
    // Halo si on grab (utilise la ref pour être sûr)
    if (isGrabbingRef.current || object.isDragging) {
      ctx.fillStyle = 'rgba(147, 51, 234, 0.4)'; // Violet
      ctx.beginPath();
      ctx.arc(0, 0, object.radius + 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Bordure violette
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, object.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(3, 3, object.radius, 0, Math.PI * 2);
    ctx.fill();
    
    const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, object.radius);
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, object.color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, object.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(-5, -5, object.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Infos
    drawInfo(ctx, object, time);
  }, [object, path, trail, showForces, showTrail, showGrid, gravity, time]);
  
  // Boucle d'animation
  useEffect(() => {
    let lastTime = 0;
    
    const animate = (timestamp: number) => {
      if (isRunning && !object.isDragging) {
        // On ne calcule la physique que si on ne grab pas l'objet
        const delta = timestamp - lastTime;
        if (delta > 16) {
          calculatePhysics();
          setTime(t => t + DT * timeScale);
          lastTime = timestamp;
        }
      }
      render();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, object.isDragging, calculatePhysics, render, timeScale]);
  
  // Gestion souris
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    mousePosRef.current = { x, y };
    
    // Le grab fonctionne TOUJOURS, même en simulation !
    if (tool === 'grab') {
      const dx = x - object.position.x;
      const dy = y - object.position.y;
      // Zone de grab plus grande pour attraper facilement la bille en mouvement
      if (dx * dx + dy * dy < (object.radius + 25) ** 2) {
        isGrabbingRef.current = true;
        setObject(prev => ({ 
          ...prev, 
          isDragging: true
        }));
        mouseHistoryRef.current = [{ x, y, t: Date.now() }];
      }
      return; // On ne fait rien d'autre en mode grab
    }
    
    // Les autres outils ne fonctionnent qu'en mode edit
    if (mode === 'edit') {
      if (tool === 'select') {
        const dx = x - object.position.x;
        const dy = y - object.position.y;
        if (dx * dx + dy * dy < object.radius * object.radius) {
          setObject(prev => ({ ...prev, isDragging: true }));
        }
      } else if (tool === 'draw') {
        isDrawingRef.current = true;
        lastPathPointRef.current = { x, y };
        setPath([{ x, y }]);
      } else if (tool === 'erase') {
        setPath(prev => prev.filter(p => {
          const dx = p.x - x;
          const dy = p.y - y;
          return dx * dx + dy * dy > 400;
        }));
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    if (isGrabbingRef.current && tool === 'grab') {
      // Mode grab : on track l'historique pour le lancer
      // La simulation continue mais l'objet suit la souris
      setObject(prev => ({
        ...prev,
        position: { x, y },
        velocity: { x: 0, y: 0 } // On annule la vélocité pendant qu'on tient
      }));
      
      // Garder les 10 dernières positions pour calculer la vélocité
      const now = Date.now();
      mouseHistoryRef.current.push({ x, y, t: now });
      if (mouseHistoryRef.current.length > 10) {
        mouseHistoryRef.current.shift();
      }
    } else if (mode === 'edit') {
      if (object.isDragging && tool === 'select') {
        setObject(prev => ({
          ...prev,
          position: { x, y },
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 }
        }));
        setTrail([]);
        setTime(0);
      } else if (isDrawingRef.current && tool === 'draw') {
        const lastPoint = lastPathPointRef.current;
        if (lastPoint) {
          const dist = Math.sqrt((x - lastPoint.x) ** 2 + (y - lastPoint.y) ** 2);
          if (dist > 5) {
            setPath(prev => [...prev, { x, y }]);
            lastPathPointRef.current = { x, y };
          }
        }
      }
    }
    
    mousePosRef.current = { x, y };
  };
  
  const handleMouseUp = () => {
    // Si on était en mode grab, calculer la vélocité de lancer
    if (isGrabbingRef.current && tool === 'grab' && mouseHistoryRef.current.length >= 2) {
      const history = mouseHistoryRef.current;
      // Prendre les 2 dernières positions pour un lancer plus réactif
      const first = history[Math.max(0, history.length - 3)];
      const last = history[history.length - 1];
      const dt = (last.t - first.t) / 1000; // en secondes
      
      if (dt > 0.01) { // Minimum 10ms pour éviter division par zéro
        // Calculer la vélocité (pixels par seconde)
        const vx = ((last.x - first.x) / dt) / SCALE * 0.5; // Facteur augmenté
        const vy = ((last.y - first.y) / dt) / SCALE * 0.5;
        
        // Limiter la vélocité max
        const maxV = 50;
        const vxClamped = Math.max(-maxV, Math.min(maxV, vx));
        const vyClamped = Math.max(-maxV, Math.min(maxV, vy));
        
        console.log('Lancer:', { vx: vxClamped, vy: vyClamped, dt });
        
        setObject(prev => ({
          ...prev,
          isDragging: false,
          velocity: { x: vxClamped, y: vyClamped }
        }));
        
        // Démarrer ou continuer la simulation
        if (!isRunning) {
          setMode('simulate');
          setIsRunning(true);
        }
      }
    }
    
    isGrabbingRef.current = false;
    setObject(prev => ({ ...prev, isDragging: false }));
    isDrawingRef.current = false;
    lastPathPointRef.current = null;
    mouseHistoryRef.current = [];
  };
  
  // Contrôles
  const startSimulation = () => {
    setMode('simulate');
    setIsRunning(true);
    // Passer automatiquement en mode grab pour interagir facilement
    setTool('grab');
  };
  
  const pauseSimulation = () => {
    setIsRunning(false);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    setMode('edit');
    setObject({
      id: 'obj1',
      position: { x: 250, y: 100 },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      mass: 1,
      radius: 15,
      color: '#3b82f6'
    });
    setTrail([]);
    setTime(0);
    setPath([]);
  };
  
  const clearPath = () => {
    setPath([]);
  };
  
  const applyImpulse = (dx: number, dy: number) => {
    setObject(prev => ({
      ...prev,
      velocity: {
        x: prev.velocity.x + dx,
        y: prev.velocity.y + dy
      }
    }));
    if (!isRunning) {
      startSimulation();
    }
  };
  
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: controls ? 'auto' : height }}>
      {/* Header */}
      {controls && (
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <Move className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Simulateur de Mécanique</h3>
                <p className="text-xs text-gray-500">Déplacez, dessinez, simulez !</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => isRunning ? pauseSimulation() : startSimulation()}
                className={`p-2 rounded-lg transition-colors ${isRunning ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={resetSimulation}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar - toujours visible même en simulation */}
      {controls && (
        <div className="bg-white p-2 border-b border-gray-200 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-md transition-colors ${tool === 'select' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => mode === 'edit' && setTool('draw')}
              disabled={mode === 'simulate'}
              className={`p-2 rounded-md transition-colors ${tool === 'draw' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'} ${mode === 'simulate' ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={mode === 'simulate' ? 'Dessin désactivé pendant la simulation' : 'Dessiner'}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => mode === 'edit' && setTool('erase')}
              disabled={mode === 'simulate'}
              className={`p-2 rounded-md transition-colors ${tool === 'erase' ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:bg-gray-200'} ${mode === 'simulate' ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={mode === 'simulate' ? 'Effacement désactivé pendant la simulation' : 'Effacer'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('grab')}
              className={`p-2 rounded-md transition-colors ${tool === 'grab' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Attraper et lancer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </button>
          </div>
          
          <div className="h-6 w-px bg-gray-300 mx-1" />
          
          <button
            onClick={clearPath}
            disabled={mode === 'simulate'}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${mode === 'simulate' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
          >
            Effacer parcours
          </button>
          
          <div className="flex-1" />
          
          <span className="text-xs text-gray-500">
            {mode === 'simulate' && tool === 'grab' && '✋ Attrapez la bille en mouvement et lancez-la !'}
            {mode === 'simulate' && tool !== 'grab' && '⏸️ Simulation en cours...'}
            {mode === 'edit' && tool === 'select' && 'Cliquez et déplacez la bille'}
            {mode === 'edit' && tool === 'draw' && 'Dessinez un parcours'}
            {mode === 'edit' && tool === 'erase' && 'Cliquez pour effacer'}
            {mode === 'edit' && tool === 'grab' && '✋ Attrapez la bille et lancez-la !'}
          </span>
        </div>
      )}

      {/* Canvas */}
      <div className="relative" style={{ height: controls ? '400px' : '100%' }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className={`w-full h-full ${
            tool === 'grab' && object.isDragging ? 'cursor-grabbing' : 
            tool === 'grab' ? 'cursor-grab' :
            mode === 'edit' && tool === 'select' ? 'cursor-move' : 
            mode === 'edit' && tool === 'draw' ? 'cursor-crosshair' : 
            'cursor-default'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Controls */}
      {controls && (
        <div className="bg-gray-50 p-3 border-t border-gray-200 space-y-3">
          {/* Paramètres physiques */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-600 font-medium">Gravité (m/s²)</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-500">{gravity.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium">Frottement</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={friction}
                onChange={(e) => setFriction(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-500">{friction.toFixed(2)}</span>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium">Rebond</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={restitution}
                onChange={(e) => setRestitution(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-500">{restitution.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Options */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={showForces} onChange={(e) => setShowForces(e.target.checked)} className="w-4 h-4" />
              <span className="text-gray-700 text-xs">Forces</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={showTrail} onChange={(e) => setShowTrail(e.target.checked)} className="w-4 h-4" />
              <span className="text-gray-700 text-xs">Trajectoire</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="w-4 h-4" />
              <span className="text-gray-700 text-xs">Grille</span>
            </label>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Vitesse:</span>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="w-16"
              />
              <span className="text-xs text-gray-600 w-8">{timeScale.toFixed(1)}x</span>
            </div>
          </div>
          
          {/* Impulsions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Impulsion:</span>
            <button onClick={() => applyImpulse(-5, -5)} className="px-2 py-1 text-xs bg-gray-100 rounded">←↑</button>
            <button onClick={() => applyImpulse(0, -8)} className="px-2 py-1 text-xs bg-gray-100 rounded">↑</button>
            <button onClick={() => applyImpulse(5, -5)} className="px-2 py-1 text-xs bg-gray-100 rounded">↑→</button>
            <button onClick={() => applyImpulse(-8, 0)} className="px-2 py-1 text-xs bg-gray-100 rounded">←</button>
            <button onClick={() => applyImpulse(8, 0)} className="px-2 py-1 text-xs bg-gray-100 rounded">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
