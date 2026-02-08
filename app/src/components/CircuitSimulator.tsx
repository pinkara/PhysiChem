import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Zap, MousePointer } from 'lucide-react';

// Types
interface Point { x: number; y: number; }
interface Component {
  id: string;
  type: 'wire' | 'resistor' | 'capacitor' | 'inductor' | 'battery' | 'ground' | 
        'switch' | 'pushSwitch' | 'ammeter' | 'voltmeter' | 'lamp' | 'led' | 
        'diode' | 'npn' | 'pnp' | 'opamp' | 'pot' | 'transformer';
  x1: number; y1: number;
  x2: number; y2: number;
  value?: number;
  state?: boolean;
  nodes: [number, number];
}

interface Node {
  id: number;
  x: number;
  y: number;
  voltage: number;
}

interface CircuitSimulatorProps {
  height?: string;
  controls?: boolean;
}

// Grille snap
const GRID_SIZE = 16;
const snap = (n: number) => Math.round(n / GRID_SIZE) * GRID_SIZE;

export function CircuitSimulator({ height = '500px', controls = true }: CircuitSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mode, setMode] = useState<'select' | 'wire' | 'drag'>('select');
  const [selectedTool, setSelectedTool] = useState<string>('wire');
  const [isRunning, setIsRunning] = useState(true);
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const [tempWire, setTempWire] = useState<Point | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showVoltage] = useState(true);
  const [time, setTime] = useState(0);
  
  const canvasWidth = 700;
  const canvasHeight = 450;

  // Dessiner la grille
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvasWidth; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  // Dessiner un composant
  const drawComponent = (ctx: CanvasRenderingContext2D, comp: Component, isSelected: boolean) => {
    const { x1, y1, x2, y2, type } = comp;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    
    // Sélection
    if (isSelected) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(-len/2 - 8, -20, len + 16, 40);
      ctx.setLineDash([]);
    }
    
    ctx.strokeStyle = '#1e293b';
    ctx.fillStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch (type) {
      case 'wire':
        ctx.strokeStyle = comp.state ? '#22c55e' : '#1e293b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        break;
        
      case 'resistor': {
        // Zigzag
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-len/3, 0);
        ctx.lineTo(-len/4, -8);
        ctx.lineTo(-len/8, 8);
        ctx.lineTo(0, -8);
        ctx.lineTo(len/8, 8);
        ctx.lineTo(len/4, -8);
        ctx.lineTo(len/3, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        if (comp.value && showCurrent) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${comp.value}Ω`, 0, -12);
        }
        break;
      }
      
      case 'capacitor':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-4, 0);
        ctx.moveTo(4, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-4, -12);
        ctx.lineTo(-4, 12);
        ctx.moveTo(4, -12);
        ctx.lineTo(4, 12);
        ctx.stroke();
        if (comp.value && showCurrent) {
          ctx.fillStyle = '#0891b2';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${comp.value}µF`, 0, -15);
        }
        break;
        
      case 'inductor':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-24, 0);
        ctx.moveTo(24, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(-18 + i * 12, 0, 6, Math.PI, 0);
          ctx.stroke();
        }
        break;
        
      case 'battery': {
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-6, 0);
        ctx.moveTo(6, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        // Barres
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(-6, 12);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, -8);
        ctx.lineTo(6, 8);
        ctx.stroke();
        // Signes
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+', -6, -18);
        ctx.fillStyle = '#1e40af';
        ctx.fillText('−', 6, -12);
        if (comp.value && showVoltage) {
          ctx.fillStyle = '#1e293b';
          ctx.font = '10px sans-serif';
          ctx.fillText(`${comp.value}V`, 0, 20);
        }
        break;
      }
      
      case 'ground':
        ctx.beginPath();
        ctx.moveTo(0, -len/2);
        ctx.lineTo(0, 0);
        ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const w = 20 - i * 6;
          ctx.beginPath();
          ctx.moveTo(-w/2, i * 5);
          ctx.lineTo(w/2, i * 5);
          ctx.stroke();
        }
        break;
        
      case 'switch':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.fillStyle = comp.state ? '#16a34a' : '#374151';
        ctx.beginPath();
        ctx.arc(-10, 0, 3, 0, Math.PI*2);
        ctx.arc(10, 0, 3, 0, Math.PI*2);
        ctx.fill();
        // Bras
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        if (comp.state) {
          ctx.lineTo(10, 0);
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 3;
        } else {
          ctx.lineTo(8, -12);
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
        }
        ctx.stroke();
        break;
        
      case 'pushSwitch':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.arc(-10, 0, 3, 0, Math.PI*2);
        ctx.arc(10, 0, 3, 0, Math.PI*2);
        ctx.fill();
        // Bras avec pointillé
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(8, -12);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
        
      case 'lamp': {
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-16, 0);
        ctx.moveTo(16, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        // Cercle
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI*2);
        ctx.stroke();
        // Croix
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(8, 8);
        ctx.moveTo(8, -8);
        ctx.lineTo(-8, 8);
        ctx.stroke();
        // Lueur si allumée
        if (comp.state && isRunning) {
          ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + 0.2 * Math.sin(time * 10)})`;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      }
      
      case 'led':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-12, 0);
        ctx.moveTo(12, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        // Triangle
        ctx.fillStyle = comp.state ? '#10b981' : '#374151';
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-10, 10);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Barre
        ctx.beginPath();
        ctx.moveTo(6, -10);
        ctx.lineTo(6, 10);
        ctx.stroke();
        // Flèches lumière
        if (comp.state && isRunning) {
          ctx.strokeStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(10, -15);
          ctx.lineTo(15, -20);
          ctx.moveTo(12, -12);
          ctx.lineTo(18, -18);
          ctx.stroke();
        }
        break;
        
      case 'diode':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-12, 0);
        ctx.moveTo(12, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-10, 10);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, -10);
        ctx.lineTo(6, 10);
        ctx.stroke();
        break;
        
      case 'ammeter':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-16, 0);
        ctx.moveTo(16, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A', 0, 0);
        break;
        
      case 'voltmeter':
        ctx.beginPath();
        ctx.moveTo(-len/2, 0);
        ctx.lineTo(-16, 0);
        ctx.moveTo(16, 0);
        ctx.lineTo(len/2, 0);
        ctx.stroke();
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('V', 0, 0);
        break;
    }
    
    ctx.restore();
  };

  // Dessiner les nœuds
  const drawNodes = (ctx: CanvasRenderingContext2D) => {
    nodes.forEach(node => {
      const isHovered = hoverNode === node.id;
      ctx.fillStyle = isHovered ? '#3b82f6' : '#64748b';
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 6 : 4, 0, Math.PI*2);
      ctx.fill();
      
      if (showVoltage && node.voltage !== 0) {
        ctx.fillStyle = '#1e293b';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${node.voltage.toFixed(1)}V`, node.x, node.y - 10);
      }
    });
  };

  // Rendu
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
    
    // Dessiner les composants
    components.forEach(comp => {
      drawComponent(ctx, comp, comp.id === selectedComp);
    });
    
    // Dessiner le fil temporaire
    if (tempWire && dragStart) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(tempWire.x, tempWire.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Dessiner les nœuds
    drawNodes(ctx);
    
    // Infos
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(10, 10, 180, 60);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(10, 10, 180, 60);
    ctx.fillStyle = '#1e293b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Composants: ${components.length}`, 20, 30);
    ctx.fillText(`Nœuds: ${nodes.length}`, 20, 50);
    ctx.fillText(`Mode: ${mode === 'wire' ? 'Câblage' : mode === 'drag' ? 'Déplacement' : 'Sélection'}`, 20, 70);
  }, [components, nodes, tempWire, dragStart, mode, hoverNode, selectedComp, showVoltage, time]);

  // Animation
  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (isRunning) {
        setTime(t => t + 0.016);
      }
      render();
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isRunning, render]);

  // Gestion souris
  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: snap((e.clientX - rect.left) * (canvasWidth / rect.width)),
      y: snap((e.clientY - rect.top) * (canvasHeight / rect.height))
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    
    // Vérifier si on clique sur un nœud existant
    const clickedNode = nodes.find(n => Math.abs(n.x - pos.x) < 10 && Math.abs(n.y - pos.y) < 10);
    
    if (mode === 'wire') {
      if (clickedNode) {
        setDragStart({ x: clickedNode.x, y: clickedNode.y });
      } else {
        setDragStart(pos);
        // Créer un nouveau nœud
        const newNodeId = nodes.length;
        setNodes(prev => [...prev, { id: newNodeId, x: pos.x, y: pos.y, voltage: 0 }]);
      }
    } else if (mode === 'select') {
      // Vérifier composant
      const clickedComp = components.find(c => {
        const d = Math.abs((c.x1+c.x2)/2 - pos.x) + Math.abs((c.y1+c.y2)/2 - pos.y);
        return d < 30;
      });
      
      if (clickedComp) {
        setSelectedComp(clickedComp.id);
        // Toggle switch
        if (clickedComp.type === 'switch') {
          setComponents(prev => prev.map(c => 
            c.id === clickedComp.id ? { ...c, state: !c.state } : c
          ));
        }
      } else {
        setSelectedComp(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    
    // Hover node
    const hovered = nodes.find(n => Math.abs(n.x - pos.x) < 10 && Math.abs(n.y - pos.y) < 10);
    setHoverNode(hovered ? hovered.id : null);
    
    if (mode === 'wire' && dragStart) {
      setTempWire(pos);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mode === 'wire' && dragStart && tempWire) {
      const pos = getMousePos(e);
      
      // Créer le composant ou fil
      if (selectedTool === 'wire' || selectedTool === 'resistor' || selectedTool === 'battery' ||
          selectedTool === 'switch' || selectedTool === 'lamp' || selectedTool === 'led' ||
          selectedTool === 'capacitor' || selectedTool === 'ground' || selectedTool === 'diode' ||
          selectedTool === 'ammeter' || selectedTool === 'voltmeter') {
        
        const newComp: Component = {
          id: Date.now().toString(),
          type: selectedTool,
          x1: dragStart.x,
          y1: dragStart.y,
          x2: pos.x,
          y2: pos.y,
          nodes: [nodes.length - 1, nodes.length],
          state: selectedTool === 'switch' ? false : selectedTool === 'lamp' || selectedTool === 'led' ? true : undefined,
          value: selectedTool === 'battery' ? 9 : selectedTool === 'resistor' ? 100 : undefined
        };
        setComponents(prev => [...prev, newComp]);
        
        // Ajouter le nœud d'arrivée
        setNodes(prev => [...prev, { id: prev.length, x: pos.x, y: pos.y, voltage: 0 }]);
      }
    }
    
    setDragStart(null);
    setTempWire(null);
  };

  const clearCircuit = () => {
    setComponents([]);
    setNodes([]);
    setSelectedComp(null);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: controls ? 'auto' : height }}>
      {/* Header */}
      {controls && (
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Simulateur de Circuits</h3>
                <p className="text-xs text-gray-500">Style CircuitJS - Cliquez pour placer, double-clic sur interrupteur</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className={`p-2 rounded-lg ${isRunning ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={clearCircuit} className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" title="Effacer tout">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {controls && (
        <div className="bg-white p-2 border-b border-gray-200 flex flex-wrap gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setMode('select')} className={`p-2 rounded ${mode === 'select' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`} title="Sélectionner">
              <MousePointer className="w-4 h-4" />
            </button>
            <button onClick={() => { setMode('wire'); setSelectedTool('wire'); }} className={`p-2 rounded ${mode === 'wire' && selectedTool === 'wire' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`} title="Fil">
              <div className="w-4 h-0.5 bg-current" />
            </button>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          {['battery', 'resistor', 'capacitor', 'switch', 'lamp', 'led', 'ground', 'diode', 'ammeter', 'voltmeter'].map(tool => (
            <button
              key={tool}
              onClick={() => { setMode('wire'); setSelectedTool(tool); }}
              className={`px-2 py-1 text-xs rounded font-medium ${selectedTool === tool && mode === 'wire' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              {tool === 'battery' && 'Pile'}
              {tool === 'resistor' && 'R'}
              {tool === 'capacitor' && 'C'}
              {tool === 'switch' && 'Int.'}
              {tool === 'lamp' && '💡'}
              {tool === 'led' && 'LED'}
              {tool === 'ground' && '⏚'}
              {tool === 'diode' && 'Diode'}
              {tool === 'ammeter' && 'A'}
              {tool === 'voltmeter' && 'V'}
            </button>
          ))}
          
          <div className="flex-1" />
          
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={showCurrent} onChange={e => setShowCurrent(e.target.checked)} />
            Valeurs
          </label>
        </div>
      )}

      {/* Canvas */}
      <div className="relative overflow-auto" style={{ height: controls ? '400px' : '100%' }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className={`bg-white ${mode === 'wire' ? 'cursor-crosshair' : 'cursor-pointer'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* Info */}
      {controls && (
        <div className="bg-gray-50 p-3 border-t border-gray-200 text-xs text-gray-600">
          <strong>Comment utiliser:</strong> Sélectionnez un outil, puis cliquez-glissez pour créer un composant. 
          Cliquez sur un interrupteur pour l'actionner. La grille aide à aligner les composants.
        </div>
      )}
    </div>
  );
}
