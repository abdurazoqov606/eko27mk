
import React, { useEffect, useRef, useState } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Zap } from 'lucide-react';

interface GameObject {
  x: number;
  z: number;
  type: 'trash' | 'tree' | 'bonus';
  id: number;
}

const EcoGameRunner: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game State Refs
  const playerPos = useRef(0); // -1 (left), 0 (center), 1 (right)
  const objects = useRef<GameObject[]>([]);
  const frameId = useRef<number>(0);
  const speed = useRef(0.05);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    objects.current = [];
    speed.current = 0.05;
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') playerPos.current = Math.max(-1, playerPos.current - 1);
      if (e.key === 'ArrowRight') playerPos.current = Math.min(1, playerPos.current + 1);
    };

    window.addEventListener('keydown', handleKeyDown);

    const update = () => {
      // Create new objects
      if (Math.random() < 0.03) {
        objects.current.push({
          x: (Math.floor(Math.random() * 3) - 1) * 2,
          z: 20,
          type: Math.random() > 0.3 ? 'trash' : 'tree',
          id: Date.now() + Math.random()
        });
      }

      // Update positions
      objects.current = objects.current.map(obj => ({ ...obj, z: obj.z - speed.current }));
      
      // Collision check
      objects.current.forEach(obj => {
        if (obj.z < 0.5 && obj.z > -0.5 && Math.abs(obj.x / 2 - playerPos.current) < 0.5) {
          if (obj.type === 'trash') {
            setScore(s => s + 10);
            obj.z = -1; // Remove
          } else if (obj.type === 'tree') {
            setGameOver(true);
          }
        }
      });

      // Cleanup
      objects.current = objects.current.filter(obj => obj.z > -1);
      speed.current += 0.00001; // Accelerate
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const horizon = h * 0.4;

      // Draw Road (3D Perspective)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(w * 0.4, horizon);
      ctx.lineTo(w * 0.6, horizon);
      ctx.lineTo(w * 0.9, h);
      ctx.lineTo(w * 0.1, h);
      ctx.fill();

      // Road Lines
      ctx.strokeStyle = '#ffffff55';
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, horizon);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();

      // Draw Objects
      objects.current.forEach(obj => {
        const scale = 1 / obj.z;
        const screenX = w * 0.5 + (obj.x * w * 0.1 * scale);
        const screenY = horizon + (h * 0.1 * scale * 5);
        const size = 40 * scale;

        if (obj.z > 0.1) {
          ctx.font = `${size}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText(obj.type === 'trash' ? '🗑️' : '🌳', screenX, screenY);
        }
      });

      // Draw Player
      const playerX = w * 0.5 + (playerPos.current * w * 0.25);
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏃‍♂️', playerX, h - 40);

      frameId.current = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(frameId.current);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-800">
      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/90 backdrop-blur-sm z-20 p-8 text-center">
          <Zap className="text-yellow-400 w-20 h-20 mb-6 animate-pulse" />
          <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Eco-Runner 3D</h3>
          <p className="text-emerald-100 mb-8 max-w-md font-bold">Tayloq yo'llarini tozalang! Chiqindilarni yig'ing (🗑️), lekin daraxtlarga (🌳) urilmang!</p>
          <div className="flex gap-4">
            <button onClick={startGame} className="px-10 py-5 bg-white text-emerald-900 rounded-3xl font-black text-xl hover:scale-110 transition-transform">O'yinni boshlash</button>
            <button onClick={onExit} className="px-10 py-5 bg-emerald-800 text-white rounded-3xl font-black text-xl border border-white/20">Chiqish</button>
          </div>
          <p className="mt-8 text-white/50 text-sm font-black uppercase tracking-widest">Boshqarish: ← va → tugmalari</p>
        </div>
      ) : gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-900/95 backdrop-blur-md z-20">
          <Trophy size={80} className="text-yellow-400 mb-6" />
          <h3 className="text-5xl font-black text-white mb-2">O'yin Tugadi!</h3>
          <p className="text-2xl text-white/80 mb-8 font-black uppercase tracking-widest">Sizning balingiz: {score}</p>
          <div className="flex gap-4">
            <button onClick={startGame} className="px-10 py-5 bg-white text-rose-900 rounded-3xl font-black text-xl flex items-center gap-2 hover:scale-105 transition-all">
              <RotateCcw /> Qayta urinish
            </button>
            <button onClick={onExit} className="px-10 py-5 bg-rose-800 text-white rounded-3xl font-black text-xl flex items-center gap-2" >
              <ArrowLeft /> Chiqish
            </button>
          </div>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
          <div className="absolute top-6 left-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-black">
            BALL: {score}
          </div>
          <div className="absolute top-6 right-6">
            <button onClick={() => setGameOver(true)} className="p-3 bg-white/10 text-white rounded-full hover:bg-rose-500 transition-colors">✕</button>
          </div>
          {/* Mobile Controls */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-10 md:hidden">
            <button onClick={() => playerPos.current = Math.max(-1, playerPos.current - 1)} className="w-20 h-20 bg-white/20 rounded-full text-4xl">←</button>
            <button onClick={() => playerPos.current = Math.min(1, playerPos.current + 1)} className="w-20 h-20 bg-white/20 rounded-full text-4xl">→</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EcoGameRunner;
