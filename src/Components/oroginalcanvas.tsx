// import {useCallback, useContext, useEffect, useState} from "react";
// import goldDiamondImg from "../assets/img/diamond.png";
// import bombDiamondImg from "../assets/img/bomb.png";
// import rightResultImg from "../assets/img/right-result-overlay.png";
// import leftResultImg from "../assets/img/left-result-overlay.png";
// import { GameState} from "../Utils/Gridtype.ts";
// import BlastEffect from '../assets/img/mineEffect.webp';
// import {createInitialGrid} from "../Hooks/createInitialGrid.ts";
// import {GameContext} from "./GameContext.tsx";
// import useLevelGrid from "../Hooks/useDiamondGrid.ts";
// import KshIcon from "../assets/img/coin.png";
// export const MinesCanvas = () => {
//     const { levelConfigs, selectedLevel, handleLevelChange, rows, cols, gold, bomb,multiplier } = useLevelGrid();
//     const gap = 8;
//     const totalGap = gap * (Math.max(rows, cols) + 1);
//     const availableSpace = 650 - totalGap;
//     const cellSize = Math.floor(availableSpace / Math.max(rows, cols));
//     const cellWidth = cellSize;
//     const cellHeight = cellSize;
//     const { balance,setBalance,betAmount,setBetAmount  } = useContext(GameContext)!;
//     const betOptions = [{ label: "½", value: "half" }, { label: "2×", value: "double" }];
//     const [activeBet, setActiveBet] = useState<"half" | "double" | null>(null);
//     const [betHistory, setBetHistory] = useState<
//         { betAmount: number; multiplier: number; checkoutAmount: number }[]
//     >([]);
//     const[amountWon,setAmountWon] = useState<number>(0);
//     const [gameState, setGameState] = useState<GameState>({
//         rows,
//         cols,
//         autoBet:false,
//         isResetActive:false,
//         gameActive: false,
//         revealedCount: 0,
//         isLossResetActive:false,
//         multiplier: 1,
//         resultOverlay:false,
//         gridRevealed: false,
//         gridItems: createInitialGrid(rows, cols, gold, bomb),
//         resetGame: () => resetGame(),
//         setGameActive: (active) => updateGameState("gameActive", active),
//         setMultiplier: (value) => updateGameState("multiplier", value),
//         setRevealedCount: (value) => updateGameState("revealedCount", value),
//         setGridItems: (grid) => updateGameState("gridItems", grid),
//     });
//     const { gridRevealed, gridItems } = gameState;
//
//     const updateGameState = <K extends keyof GameState>(key: K, value: GameState[K]) =>
//         setGameState(prev => ({ ...prev, [key]: value }));
//
//     const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
//     const blastEffectImg = new Image();
//     blastEffectImg.src = BlastEffect;
//
//     const handleBetChange = (action: "half" | "double" | "select", value?: number) => {
//         const newAmount = action === "half" ? Math.max(20, Math.floor(betAmount / 2)) :
//             action === "double" ? Math.min(10000, betAmount * 2) :
//                 action === "select" && value !== undefined ? Math.max(20, Math.min(10000, value)) : betAmount;
//         setActiveBet(action === "half" || action === "double" ? action : null);
//         setBetAmount(newAmount);
//
//     };
//
//     const handlePlaceBet = () => betAmount > balance ?
//         alert('Insufficient balance!') : (setBalance(balance - betAmount));
//
//     const drawGrid = useCallback(
//         (ctx: CanvasRenderingContext2D) => {
//             if (!gridItems || gridItems.length === 0) return;
//             const borderRadius = 10;
//             ctx.clearRect(0, 0, 650, 650);
//             ctx.fillStyle = 'rgb(15,33,46)';
//             ctx.fillRect(0, 0, 650, 650);
//             for (let row = 0; row < rows; row++) {
//                 for (let col = 0; col < cols; col++) {
//                     const cell = gridItems[row]?.[col];
//                     if (!cell) continue;
//                     const x = gap + col * (cellWidth + gap);
//                     const y = gap + row * (cellHeight + gap);
//                     const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
//                     const isRevealed = cell.revealed || gridRevealed;
//                     ctx.shadowBlur = isHovered ? 10 : 0;
//                     ctx.shadowColor = isHovered ? "rgba(0, 0, 0, 0.5)" : "transparent";
//                     ctx.fillStyle = 'transparent';
//                     ctx.fillRect(0, 0, 650, 650);
//                     ctx.fillStyle = 'rgb(47,69,83)';
//                     if (!isRevealed && isHovered) {
//                         ctx.fillStyle = 'rgb(96, 136, 161,.7)';
//                         ctx.save();
//                         ctx.translate(x + cellWidth / 2, y + cellHeight / 2);
//                         ctx.scale(1.02, 1.035);
//                         ctx.translate(-(x + cellWidth / 2), -(y + cellHeight / 2));
//                     }
//                     ctx.shadowColor = 'rgb(33,55,67)';
//                     ctx.shadowBlur = 0;
//                     ctx.shadowOffsetX = 0;
//                     ctx.shadowOffsetY = 3;
//
//                     ctx.beginPath();
//                     ctx.moveTo(x + borderRadius, y);
//                     ctx.arcTo(x + cellWidth, y, x + cellWidth, y + cellHeight, borderRadius);
//                     ctx.arcTo(x + cellWidth, y + cellHeight, x, y + cellHeight, borderRadius);
//                     ctx.arcTo(x, y + cellHeight, x, y, borderRadius);
//                     ctx.arcTo(x, y, x + cellWidth, y, borderRadius);
//                     ctx.closePath();
//                     ctx.fill();
//
//                     if (isHovered) {
//                         ctx.restore();
//                     }
//                     if (isRevealed){
//                         ctx.fillStyle = 'transparent';
//                     }
//                     if (isRevealed && cell.type) {
//                         const padding = 10;
//                         const paddedX = x + padding;
//                         const paddedY = y +  padding ;
//                         const paddedWidth = cellWidth - padding * 2;
//                         const paddedHeight = cellHeight - padding * 2;
//                         ctx.save();
//                         ctx.fillStyle = cell.type === "gold" ? '#004953' : '#6E260E';
//                         ctx.fill();
//                         ctx.strokeStyle = cell.type === "gold" ? "#39f400" : cell.type === "bomb" ? "red" : "transparent";
//                         // ctx.lineWidth = 0.8;
//                         // ctx.shadowBlur=10;
//                         // ctx.shadowColor=cell.type === "gold" ?'#39f400':'#FF2650';
//                         ctx.stroke();
//
//                         const img = new Image();
//                         img.src = cell.type === "gold" ? goldDiamondImg : bombDiamondImg;
//                         img.onload = () => {
//                             // ctx.shadowBlur=0;
//                             // ctx.shadowColor=cell.type === "gold" ?'':'red';
//                             ctx.drawImage(img, paddedX, paddedY, paddedWidth, paddedHeight);
//                         };
//                     }
//                 }
//             }
//         },
//         [gridItems, rows, cols, cellWidth, cellHeight, hoveredCell?.row, hoveredCell?.col, gridRevealed]
//     );
//
//     const handleCanvasClick = useCallback((event: MouseEvent) => {
//         if (!gameState.gameActive) return;
//         const canvas = event.target as HTMLCanvasElement;
//         const rect = canvas.getBoundingClientRect();
//         const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
//         const [x, y] = [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
//         const [col, row] = [Math.floor((x - gap) / (cellWidth + gap)), Math.floor((y - gap) / (cellHeight + gap))];
//
//         if (col < 0 || col >= cols || row < 0 || row >= rows) return;
//
//         const cell = gridItems[row][col];
//         if (!cell || cell.revealed) return;
//
//         setGameState((prev) => ({
//             ...prev,
//             gridItems: prev.gridItems.map((rowItems, r) =>
//                 r === row
//                     ? rowItems.map((item, c) =>
//                         c === col
//                             ? {
//                                 ...item,
//                                 selected: !item.selected,
//                             }: item
//                     ): rowItems
//             ),
//         }));
//
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;
//
//         const cellX = gap + col * (cellWidth + gap), cellY = gap + row * (cellHeight + gap);
//
//         const animate = (imgSrc: string, duration: number, callback?: () => void) => {
//             const img = new Image();
//             img.src = imgSrc;
//             const startTime = performance.now();
//
//             img.onload = () => {
//                 const animateFrame = (time: number) => {
//                     const scale = Math.min((time - startTime) / duration, 1.1);
//                     const [scaledWidth, scaledHeight] = [cellWidth * scale, cellHeight * scale];
//                     const [offsetX, offsetY] = [(cellWidth - scaledWidth) / 2, (cellHeight - scaledHeight) / 2];
//
//                     ctx.clearRect(cellX, cellY, cellWidth, cellHeight);
//                     ctx.drawImage(img, cellX + offsetX, cellY + offsetY, scaledWidth, scaledHeight);
//
//                     if (scale < 1) requestAnimationFrame(animateFrame);
//                     else callback?.();
//                 };
//                 requestAnimationFrame(animateFrame);
//             };
//         };
//
//         if (cell.type === "bomb") {
//             setGameState(prev => ({
//                 ...prev,
//                 gameActive: false,
//                 gridItems: gridItems.map(row => row.map(cell => ({ ...cell, revealed: true }))),
//             }));
//             return;
//         }
//         const rippleStartTime = performance.now();
//         const animateRipple = (time: number) => {
//             const rippleProgress = Math.min((time - rippleStartTime) / 100, 2.5);
//             const rippleSize = Math.max(cellWidth * rippleProgress, 1.2);
//
//             ctx.clearRect(cellX, cellY, cellWidth, cellHeight);
//             ctx.beginPath();
//             ctx.arc(cellX + cellWidth / 2, cellY + cellHeight / 2, rippleSize / 2, 0, Math.PI * 2);
//             ctx.fill();
//
//             if (rippleProgress < 1) {
//                 requestAnimationFrame(animateRipple);
//             } else {
//                 animate(cell.type === "gold" ? goldDiamondImg : "", 25, () => {
//                     setGameState(prev => ({
//                         ...prev,
//                         gridItems: gridItems.map((rowItems, r) =>
//                             r === row ? rowItems.map((item, c) => (c === col ? { ...cell, revealed: true } : item)) : rowItems
//                         ),
//                         multiplier: prev.multiplier+ multiplier,
//                         revealedCount: prev.revealedCount + 1,
//                     }));
//                     console.log(multiplier);
//                     console.log(gameState.multiplier);
//                 });
//             }
//         };
//         requestAnimationFrame(animateRipple);
//     }, [gameState.gameActive, gameState.multiplier, cellWidth, cellHeight, cols, rows, gridItems, multiplier]);
//
//     const handleMouseMove = (event: MouseEvent) => {
//         const canvas = document.getElementById("minesCanvas") as HTMLCanvasElement;
//         const { left, top, width, height } = canvas.getBoundingClientRect();
//         const [x, y] = [(event.clientX - left) * (canvas.width / width), (event.clientY - top) * (canvas.height / height)];
//         const [col, row] = [Math.floor((x - gap) / (cellWidth + gap)), Math.floor((y - gap) / (cellHeight + gap))];
//
//         if (col >= 0 && col < cols && row >= 0 && row < rows) {
//             const cell = gridItems[row]?.[col];
//             const isRevealed = cell.revealed || gridRevealed;
//
//             if(!isRevealed){
//                 if (!hoveredCell || hoveredCell.row !== row || hoveredCell.col !== col) {
//                     setHoveredCell({ row, col });
//                 }}
//         } else {
//             setHoveredCell(null);
//         }
//     };
//
//     useEffect(() => {
//         const canvas = document.getElementById("minesCanvas") as HTMLCanvasElement;
//         const ctx = canvas?.getContext("2d");
//         if (!canvas || !ctx) return;
//         drawGrid(ctx);
//         canvas.addEventListener("mousemove", handleMouseMove);
//         canvas.addEventListener("mouseout", () => setHoveredCell(null));
//         canvas.addEventListener("click", handleCanvasClick);
//
//
//         return () => {
//             canvas.removeEventListener("mousemove", handleMouseMove);
//             canvas.removeEventListener("mouseout", () => setHoveredCell(null));
//             canvas.removeEventListener("click", handleCanvasClick);
//         };
//     }, [handleMouseMove, handleCanvasClick, drawGrid]);
//
//     useEffect(() => {
//         const newGrid = createInitialGrid(rows, cols, gold, bomb);
//         setGameState((prev:GameState) => ({ ...prev,
//             gridItems:newGrid,
//             resultOverlay:false
//
//         }));
//         resetGame();
//     }, [bomb, cols, gold, rows, selectedLevel]);
//
//     const resetGame = () => {
//         setGameState((prev: GameState) => ({
//             ...prev,
//             gridItems: createInitialGrid(rows, cols, gold, bomb),
//             gameActive: false,
//             gridRevealed: false,
//             multiplier: 1,
//             revealedCount: 0,
//         }));
//         setHoveredCell(null);
//     };
//     const HandleCheckout = () => {
//         if (gameState.revealedCount === 0) {
//             return;
//         }
//         setGameState((prev) => ({ ...prev, gameActive: false,bombClicked: false}));
//
//         const checkoutAmount = betAmount * gameState.multiplier;
//         setAmountWon(checkoutAmount);
//         if(gameState.gameActive && gameState.gridRevealed){
//             setBalance(balance + betAmount * gameState.multiplier);
//         }
//         setBalance(balance + betAmount * gameState.multiplier);
//         setGameState((prev) => ({
//             ...prev,
//             resultOverlay: true,
//             gridRevealed: true,
//             gridItems: gameState.gridItems.map((row) =>
//                 row.map((cell) => ({ ...cell, revealed: true }))
//             ),
//         }));
//         setBetHistory((prevHistory) => [
//             ...prevHistory,
//             { betAmount, multiplier: gameState.multiplier, checkoutAmount },
//         ]);
//     };
//
//     const startGame = () => {
//         setGameState((prev) => ({ ...prev, resultOverlay: false }));
//         resetGame();
//         setGameState((prev: GameState) => ({
//             ...prev,
//             gameActive: true,
//             gridRevealed: false,
//             multiplier: 1,
//             revealedCount: 0,
//         }));
//         handlePlaceBet();
//     };
//
//     const toggleBetMode = (isAuto:boolean) => {
//         setGameState((prev) => ({ ...prev, autoBet: isAuto }));
//     };
//
//     const onWinToggle = (isReset:boolean) => {
//         setGameState((prev) => ({ ...prev, isResetActive:isReset }));
//     };
//
//     const onLossToggle = (isLossReset:boolean) => {
//         setGameState((prev) => ({ ...prev, isLossResetActive:isLossReset }));
//     };
//
//     return (
//         <>
//             <div className='canvas-view'>
//                 <div className="mines-game-title">
//                     <span>Mines Game</span>
//                 </div>
//
//                 <div className='canvas-bet-area'>
//                     <div className="mines-game-controls-bottom">
//                                 <span className="Bet-Amount-controls">
//                                     {!gameState.gameActive && (
//                                         <div className="bet-shortcuts">
//                                             {[20, 50, 100, 250, 500, 750, 1000].map((val) => (
//                                                 <div
//                                                     className={`bet-shortcut-value select`}
//                                                     key={val}
//                                                     onClick={() => handleBetChange("select", val)} // Add onClick handler
//                                                 >
//                                                     {val}
//                                                 </div>
//                                             ))}
//                                         </div>)}
//
//                                     <div className='bet-area'>
//                                                 <span className='title'>
//                                                     Bet Amount
//                                                 </span>
//
//                                                 <div className='bet-amount-area'>
//                                                 <input className='bet-Amount' disabled={gameState.gameActive}
//                                                        type="number" value={betAmount}
//                                                        onChange={(e) => handleBetChange("select", +e.target.value)}/>
//                                                     <span className='bet'>
//                                                             <span className='bet-half-double'>
//                                                             {betOptions.map(({value, label}) => (
//                                                                 <span
//                                                                     key={value}
//                                                                     className={`bet-${value} ${activeBet === value ? "active" : ""} ${gameState.gameActive ? "disabled" : ""}`}
//                                                                     onClick={() => handleBetChange(value as "half" | "double" | "select")}>
//                                                                 {label}
//                                                             </span>
//                                                             ))}
//                                                                 </span>
//                                                         </span>
//                                                 </div>
//                                          </div>
//                                 </span>
//
//                         <span className="place-bet-buttons">
//                         {
//                             !gameState.autoBet ? (
//                                 <span className={`start-game ${gameState.gameActive ? 'checkout-btn' : ''}`}
//                                       onClick={gameState.gameActive ? HandleCheckout : startGame}
//                                       style={{
//                                           opacity: 1,
//                                           pointerEvents: "auto",
//                                       }}
//                                 >{gameState.gameActive ? `Cash Out ${(gameState.multiplier * betAmount).toFixed(2)}`
//                                     : "Bet"}
//                                                         </span>
//                             ) : (
//                                 <span className={`start-game ${gameState.gameActive ? 'checkout-btn' : ''}`}
//                                       onClick={gameState.gameActive ? HandleCheckout : startGame}
//                                       style={{
//                                           opacity: 1,
//                                           pointerEvents: "auto",
//                                       }}
//                                 >{gameState.gameActive ? `Stop AutoBet ${(gameState.multiplier * betAmount).toFixed(2)}`
//                                     : "Start AutoBet"}
//                                                         </span>
//                             )}
//
//                                                     </span>
//
//                         <span className="level-changes">
//                                     <span className="level-changes-titles">
//                                         <span className="auto-bet-title"> Mines</span>
//                                         {gameState.gameActive && (
//                                             <span className="Gems">Gems</span>)}
//                                         </span>
//
//                                      <span className="level-changes-controls">
//                                          <div
//                                              className={`${!gameState.gameActive ? 'bet-number' : 'bet-number-deactivated'}`}>
//
//                                             <select
//                                                 className="Mines-control"
//                                                 id="level"
//                                                 value={selectedLevel}
//                                                 onChange={(e) => handleLevelChange(Number(e.target.value))}
//                                                 disabled={gameState.gameActive}
//                                                 style={{
//                                                     backgroundColor: gameState.gameActive
//                                                         ? 'rgb(48, 73, 89)' : 'rgb(19, 37, 49)'
//                                                 }}
//
//                                             >
//                                             {levelConfigs.map((config, index) => (
//                                                 <option className="option" key={index} value={index}>
//                                                     {gameState.gameActive ? `Mines ${config.level}` : config.level}
//                                                 </option>
//                                             ))}
//
//                                         </select>
//                                          </div>
//                                          {gameState.gameActive && (
//                                              <span className="Mines-control"
//                                                    style={{
//                                                        backgroundColor: gameState.gameActive
//                                                            ? 'rgb(48, 73, 89)' : 'rgba(200, 200, 200, 0.5)'
//                                                    }}
//                                              >
//                                                 <span className="mine-count">{gameState.revealedCount}</span>
//                                         <span>/ {rows * cols}</span>
//                                             </span>)}
//                                         </span>
//                     </span>
//                         {gameState.autoBet && (
//                             <div className='autobet-content'>
//                                 <span className='auto-bet-title'>Number of bets</span>
//                                 <input className='no-of-bets' disabled={gameState.gameActive} type="number"
//                                        placeholder='0'/>
//
//                                 <div className='on-loss-win-details'>
//                                     <span className='auto-bet-title'> On Win</span>
//                                     <div className='on-win'>
//                                         {['Reset', 'Increase by:'].map((label, index) => (
//                                             <span
//                                                 key={index}
//                                                 className={`reset-increase ${gameState.isResetActive === (index === 1) ? 'active' : ''}`}
//                                                 onClick={() => onWinToggle(index === 1)}
//                                             >{label}      </span>
//                                         ))}
//                                         <div className="percent-input">
//                                             <input
//                                                 className="percent-value"
//                                                 disabled={gameState.gameActive}
//                                                 type="number"
//                                                 min="0"
//                                                 max="100"
//                                                 step="0.01"
//                                                 placeholder='0.000'
//                                             />
//                                             <span className="percent-symbol">%</span>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className='on-loss-win-details'>
//                                     <span className='auto-bet-title'> On Loss</span>
//                                     <div className='on-loss'>
//                                         {['Reset', 'Increase by:'].map((label, index) => (
//                                             <span
//                                                 key={index}
//                                                 className={`reset-increase ${gameState.isLossResetActive === (index === 1) ? 'active' : ''}`}
//                                                 onClick={() => onLossToggle(index === 1)}
//                                             >{label}      </span>
//                                         ))}
//                                         <div className="percent-input">
//
//                                             <input
//                                                 className="percent-value"
//                                                 disabled={gameState.gameActive}
//                                                 type="number"
//                                                 min="0"
//                                                 max="100"
//                                                 step="0.01"
//                                                 placeholder='0.000'
//                                             />
//                                             <span className="percent-symbol">%</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <span className='auto-bet-title'>Stop on Profit</span>
//                                 <div className="stop-profit-loss">
//                                     <div className="stop-loss">
//                                         <input className='profits-loss' disabled={gameState.gameActive} placeholder='0.000'
//                                                type="number"/>
//                                         <img className='ksh-icon' src={KshIcon} alt='ksh-icon'/>
//                                     </div>
//                                 </div>
//                                 <span className='auto-bet-title'>Stop on Loss</span>
//                                 <div className="stop-profit-loss">
//                                     <div className="stop-loss">
//                                         <input className='profits-loss' disabled={gameState.gameActive} placeholder='0.000'
//                                                type="number"/>
//                                         <img className='ksh-icon' src={KshIcon} alt='ksh-icon'/>
//
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         <div className="Manual-auto">
//                             <div className="Manual-auto-toggle">
//                                 {['Manual', 'Auto'].map((label, index) => {
//                                     const isActive = gameState.autoBet === (index === 1);
//                                     return (
//                                         <div
//                                             key={index}
//                                             className={`manual-btn ${isActive ? 'active' : ''}`}
//                                             onClick={() => toggleBetMode(index === 1)}
//                                         >
//                                             {label}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//
//                         <div className='bet-history'>
//                             <div className='bet-history-titles'>
//                                 <span>Bet Amount</span>
//                                 <span>Multiplier</span>
//                                 <span>CheckOut</span>
//                             </div>
//                             <hr className='bet-history-border'/>
//                             {betHistory.map((entry, index) => (
//                                 <div key={index} className="bet-history-content">
//                                     <span>{entry.betAmount}</span>
//                                     <span>{entry.multiplier.toFixed(2)}</span>
//                                     <span>{entry.checkoutAmount.toFixed(0)}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <canvas id="minesCanvas" width="650" height="650"></canvas>
//
//
//                 </div>
//
//                 {gameState.resultOverlay && (
//                     <div className="canvas-overlay">
//                         <div className="result-popup">
//                         <span className='top-results-overlay'>
//                             <img className='diamond-result-img' src={leftResultImg} alt="left"/>
//                         <span>You Won</span>
//                             <img className='diamond-result-img' src={rightResultImg} alt="right"/>
//                         </span>
//                             <span className='amount-won'>{amountWon.toFixed(0)} ksh</span>
//                             <hr className='results-border'/>
//                             <span className='result-multiplier'>
//                                 <span>Multiplier
//                             </span>
//                                 <span className='result-multiplier'>
//                                 <span>{gameState.multiplier.toFixed(2)}x
//                             </span>
//                         </span>
//                         </span>
//                         </div>
//                     </div>)}
//             </div>
//         </>
//     )
//         ;
// };