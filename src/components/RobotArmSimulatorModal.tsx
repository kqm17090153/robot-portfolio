import React, { useEffect, useRef, useState } from 'react';
import { X, Play, RotateCcw, Cpu, Layers, CheckCircle2, Sliders, Info } from 'lucide-react';
import { Language } from '../types';

interface RobotArmSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RobotArmSimulatorModal: React.FC<RobotArmSimulatorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shoulderAngle, setShoulderAngle] = useState(45); // degrees
  const [elbowAngle, setElbowAngle] = useState(60); // degrees
  const [baseX, setBaseX] = useState(140); // base X coordinate
  const [gripperOpen, setGripperOpen] = useState(true);
  const [isAutomating, setIsAutomating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Idle - Ready to stack');
  const [stackedCount, setStackedCount] = useState(2);

  const isKo = language === 'ko';

  // Animation routine for picking and stacking a red block
  const runAutoStackRoutine = () => {
    if (isAutomating) return;
    setIsAutomating(true);
    setStatusMessage(isKo ? '1단계: 픽업 위치로 하강 중...' : 'Step 1: Moving to pickup position...');

    // Step 1: Open gripper and move above block
    setGripperOpen(true);
    setShoulderAngle(25);
    setElbowAngle(85);

    setTimeout(() => {
      setStatusMessage(isKo ? '2단계: 빨간색 블록 파지 (그리퍼 닫힘)' : 'Step 2: Gripping red block...');
      setGripperOpen(false);

      setTimeout(() => {
        setStatusMessage(isKo ? '3단계: 탑 높이로 안전 리프팅' : 'Step 3: Lifting red block to tower height...');
        setShoulderAngle(65);
        setElbowAngle(35);

        setTimeout(() => {
          setStatusMessage(isKo ? '4단계: 타겟 타워 좌표로 정렬 및 적재' : 'Step 4: Aligning and stacking on target tower...');
          setShoulderAngle(40);
          setElbowAngle(55);

          setTimeout(() => {
            setGripperOpen(true);
            setStackedCount((prev) => (prev >= 4 ? 2 : prev + 1));
            setStatusMessage(isKo ? '적재 완료! 다음 시퀀스 대기' : 'Block stacked successfully!');
            setIsAutomating(false);
          }, 900);
        }, 900);
      }, 800);
    }, 900);
  };

  const handleReset = () => {
    setShoulderAngle(45);
    setElbowAngle(60);
    setBaseX(140);
    setGripperOpen(true);
    setStackedCount(2);
    setStatusMessage(isKo ? '위치 초기화 완료' : 'Arm reset to home position');
  };

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render Canvas
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Lab Precision Grid Table
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ground Floor line
    const groundY = height - 40;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, groundY, width, 40);

    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // 2. Draw Target Red Block Tower
    const towerX = width - 130;
    const blockWidth = 50;
    const blockHeight = 22;

    // Tower base plate
    ctx.fillStyle = '#334155';
    ctx.fillRect(towerX - 10, groundY - 6, blockWidth + 20, 6);

    // Stacking blocks
    for (let i = 0; i < stackedCount; i++) {
      const blockY = groundY - 6 - (i + 1) * blockHeight;
      // Red block body
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(towerX, blockY, blockWidth, blockHeight - 2);

      // Block stud pins (LEGO / Modular robot style)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(towerX + 8, blockY - 3, 10, 3);
      ctx.fillRect(towerX + 32, blockY - 3, 10, 3);

      // Highlight bevel
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1;
      ctx.strokeRect(towerX, blockY, blockWidth, blockHeight - 2);
    }

    // Source red block to be picked up if gripper is empty
    const sourceBlockX = 260;
    const sourceBlockY = groundY - blockHeight;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sourceBlockX, sourceBlockY, blockWidth, blockHeight - 2);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(sourceBlockX + 8, sourceBlockY - 3, 10, 3);
    ctx.fillRect(sourceBlockX + 32, sourceBlockY - 3, 10, 3);

    // 3. Draw Robot Arm
    // Arm Kinematics geometry
    const L1 = 120; // Link 1 (Shoulder to Elbow)
    const L2 = 100; // Link 2 (Elbow to Wrist)

    const basePoint = { x: baseX, y: groundY };

    // Base Stand
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(basePoint.x - 35, groundY);
    ctx.lineTo(basePoint.x + 35, groundY);
    ctx.lineTo(basePoint.x + 20, groundY - 35);
    ctx.lineTo(basePoint.x - 20, groundY - 35);
    ctx.closePath();
    ctx.fill();

    // Base glowing cyan ring
    ctx.fillStyle = '#00d2ff';
    ctx.fillRect(basePoint.x - 18, groundY - 25, 36, 4);

    const shoulderJoint = { x: basePoint.x, y: groundY - 35 };

    // Calculate Elbow position
    const radShoulder = (shoulderAngle * Math.PI) / 180;
    const elbowJoint = {
      x: shoulderJoint.x + L1 * Math.cos(radShoulder),
      y: shoulderJoint.y - L1 * Math.sin(radShoulder),
    };

    // Calculate Wrist position
    const radElbow = ((shoulderAngle - elbowAngle) * Math.PI) / 180;
    const wristJoint = {
      x: elbowJoint.x + L2 * Math.cos(radElbow),
      y: elbowJoint.y - L2 * Math.sin(radElbow),
    };

    // Draw Link 1 (Upper Arm)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(shoulderJoint.x, shoulderJoint.y);
    ctx.lineTo(elbowJoint.x, elbowJoint.y);
    ctx.stroke();

    // Link 1 Cyan Accent Stripe
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(shoulderJoint.x + 8, shoulderJoint.y);
    ctx.lineTo(elbowJoint.x - 8, elbowJoint.y);
    ctx.stroke();

    // Draw Link 2 (Forearm)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(elbowJoint.x, elbowJoint.y);
    ctx.lineTo(wristJoint.x, wristJoint.y);
    ctx.stroke();

    // Draw Joint Hubs
    // Shoulder Hub
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(shoulderJoint.x, shoulderJoint.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.arc(shoulderJoint.x, shoulderJoint.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Elbow Hub
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(elbowJoint.x, elbowJoint.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(elbowJoint.x, elbowJoint.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Wrist Hub & Gripper Claw
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(wristJoint.x, wristJoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Gripper Claws
    const clawSpan = gripperOpen ? 22 : 8;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'butt';

    // Left claw finger
    ctx.beginPath();
    ctx.moveTo(wristJoint.x - clawSpan, wristJoint.y + 2);
    ctx.lineTo(wristJoint.x - clawSpan, wristJoint.y + 24);
    ctx.stroke();

    // Right claw finger
    ctx.beginPath();
    ctx.moveTo(wristJoint.x + clawSpan, wristJoint.y + 2);
    ctx.lineTo(wristJoint.x + clawSpan, wristJoint.y + 24);
    ctx.stroke();

    // If gripper is closed, draw held red block
    if (!gripperOpen) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(wristJoint.x - 22, wristJoint.y + 10, 44, 20);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1;
      ctx.strokeRect(wristJoint.x - 22, wristJoint.y + 10, 44, 20);
    }
  }, [isOpen, shoulderAngle, elbowAngle, baseX, gripperOpen, stackedCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {isKo ? 'Red Tower 4-DOF 로봇팔 시뮬레이터' : 'Red Tower 4-DOF Arm Simulator'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isKo
                  ? '역기구학(IK) 및 블록 적재 루틴 실시간 제어'
                  : 'Real-time Inverse Kinematics & Stacking Routine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Canvas Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 flex justify-center">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="max-w-full h-auto block"
            />

            {/* Status HUD Tag */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono border border-cyan-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{statusMessage}</span>
            </div>

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/70 text-cyan-300 text-xs font-mono">
              Tower Height: {stackedCount} BLOCKS
            </div>
          </div>

          {/* Quick Actions & Routine trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-900/60">
            <div className="flex items-center gap-2">
              <button
                onClick={runAutoStackRoutine}
                disabled={isAutomating}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span className="whitespace-nowrap">{isKo ? '자동 적재 루틴 실행' : 'Auto Stack Routine'}</span>
              </button>
              <button
                onClick={handleReset}
                disabled={isAutomating}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{isKo ? '초기화' : 'Reset'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>
                {isKo
                  ? '슬라이더로 직접 관절 각도를 조절해보세요'
                  : 'Adjust sliders below for manual telemetry control'}
              </span>
            </div>
          </div>

          {/* Manual Telemetry Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Shoulder Slider */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                <span>Shoulder Joint (θ1)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">
                  {shoulderAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={shoulderAngle}
                disabled={isAutomating}
                onChange={(e) => setShoulderAngle(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Elbow Slider */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                <span>Elbow Joint (θ2)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">
                  {elbowAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={elbowAngle}
                disabled={isAutomating}
                onChange={(e) => setElbowAngle(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Gripper Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                <span>Claw Gripper</span>
                <span
                  className={`font-mono ${
                    gripperOpen ? 'text-slate-500' : 'text-emerald-500 font-bold'
                  }`}
                >
                  {gripperOpen ? 'OPEN' : 'CLAMPED'}
                </span>
              </div>
              <button
                onClick={() => setGripperOpen(!gripperOpen)}
                disabled={isAutomating}
                className="w-full py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-cyan-400 text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap transition-colors"
              >
                {gripperOpen ? (isKo ? '블록 파지하기' : 'Close Claw') : (isKo ? '그리퍼 열기' : 'Open Claw')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
