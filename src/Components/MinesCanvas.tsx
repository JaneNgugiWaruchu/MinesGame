import { useContext, useEffect, useState} from "react";
import goldDiamondImg from "../assets/img/diamond.png";
import rightResultImg from "../assets/img/right-result-overlay.png";
import leftResultImg from "../assets/img/left-result-overlay.png";
import { GameState} from "../Utils/Gridtype.ts";
import {createInitialGrid} from "../Hooks/createInitialGrid.ts";
import {GameContext} from "./GameContext.tsx";
import useLevelGrid from "../Hooks/useDiamondGrid.ts";
import KshIcon from "../assets/img/coin.png";
import Canvas from "./Canvas.tsx";
import {useHandelCanvasClick} from "../Hooks/HandleCanvasClick.ts";

// multiplier and betamount not matching with level configs for autobet

export const MinesCanvas = () => {
    const { levelConfigs, selectedLevel, handleLevelChange, rows, cols, gold, bomb,multiplier } = useLevelGrid();
    const gap = 10, totalGap = gap * (Math.max(rows, cols) + 1);
    const availableSpace = 650 - totalGap;
    const cellSize = Math.floor(availableSpace / Math.max(rows, cols));
    const cellWidth = cellSize, cellHeight = cellSize;
    const { balance,setBalance,betAmount,setBetAmount  } = useContext(GameContext)!;
    const betOptions = [{ label: "½", value: "half" }, { label: "2×", value: "double" }];
    const [activeBet, setActiveBet] = useState<"half" | "double" | null>(null);
    const [betHistory, setBetHistory] = useState<
        { betAmount: number; multiplier: number; checkoutAmount: number }[]
    >([]);
    const  betValues = [20, 50, 100, 250, 500, 750, 1000],
    [amountWon,setAmountWon] = useState<number>(0);

    const [gameState, setGameState] = useState<GameState>({
        selectedCells: [],
        rows, cols, autoBet:false, isResetActive:false, gameActive: false, revealedCount: 0,
        isLossResetActive:false, multiplier: 1, resultOverlay:false, gridRevealed: false,
        gridItems: createInitialGrid(rows, cols, gold, bomb), resetGame: () => resetGame(),
        setGameActive: (active) => updateGameState("gameActive", active),
        setMultiplier: (value) => updateGameState("multiplier", value),
        setRevealedCount: (value) => updateGameState("revealedCount", value),
        setGridItems: (grid) => updateGameState("gridItems", grid),
    });
    const { gridRevealed, gridItems } = gameState;
    const handleCanvasClick = useHandelCanvasClick(
        gameState,
        setGameState,
        gridItems,
        cellWidth,
        cellHeight,
        cols,
        rows,
        gap,
        multiplier,
        goldDiamondImg
    );

    const [autoBetInterval, setAutoBetInterval] = useState<number | null>(null);

    const updateGameState = <K extends keyof GameState>(key: K, value: GameState[K]) =>
        setGameState(prev => ({ ...prev, [key]: value }));

    const handleBetChange = (action: "half" | "double" | "select", value?: number) => {
        const newAmount = action === "half" ? Math.max(20, Math.floor(betAmount / 2)) :
            action === "double" ? Math.min(10000, betAmount * 2) :
                action === "select" && value !== undefined ? Math.max(20, Math.min(10000, value)) : betAmount;
        setActiveBet(action === "half" || action === "double" ? action : null);
        setBetAmount(newAmount);

    };

    const handlePlaceBet = () => {
            if (betAmount > balance) {
                alert('Insufficient balance!')
            } else {
                setBalance(balance - betAmount)
            }
    };


    const resetGame = () => {
        setGameState((prev: GameState) => ({
            ...prev,
            gridItems: createInitialGrid(rows, cols, gold, bomb),
            gameActive: false,
            gridRevealed: false,
            multiplier: 1,
            revealedCount: 0,
        }));
    };

    const HandleCheckout = () => {
        if (gameState.revealedCount === 0) {
            return;
        }
        setGameState((prev) => ({ ...prev, gameActive: false,bombClicked: false}));

        const checkoutAmount = betAmount * gameState.multiplier;
        setAmountWon(checkoutAmount);

        if(gameState.gameActive && gameState.gridRevealed){
            setBalance(balance + betAmount * gameState.multiplier);
        }
        setBalance(balance + betAmount * gameState.multiplier);
        setGameState((prev) => ({
            ...prev,
            resultOverlay: true,
            gridRevealed: true,
            gridItems: gameState.gridItems.map((row) =>
                row.map((cell) => ({ ...cell, revealed: true }))
            ),
        }));

        setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                resultOverlay: false,
                gridRevealed: false,
                gridItems: gameState.gridItems.map((row) =>
                    row.map((cell) => ({ ...cell, revealed: false }))
                ),
            }));

        }, 2000);

        setBetHistory((prevHistory) => [
            ...prevHistory,
            { betAmount, multiplier: gameState.multiplier, checkoutAmount },
        ]);
    };


    const handleBetResults = (betAmount: number) => {
        const selectedCells = gameState.selectedCells || []; // Ensure it's always an array

        // Calculate the total multiplier
        const totalMultiplier = selectedCells.reduce((sum, cell) => {
            return cell.type === "gold" ? sum + multiplier : sum;
        }, 0);

        console.log("Total Multiplier:", totalMultiplier);

        const wonAmount = betAmount * totalMultiplier;

        setGameState((prev) => ({
            ...prev,
            revealedCount: 0,
            gridRevealed: true,
        }));

        if (totalMultiplier > 0) {
            setAmountWon(wonAmount);
            setGameState((prev) => ({
                ...prev,
                resultOverlay: true,
                multiplier: totalMultiplier,
            }));
        } else {
            setAmountWon(0);
            setGameState((prev) => ({
                ...prev,
                resultOverlay: false,
            }));
        }

        if (autoBetInterval) {
            setTimeout(() => {
                setAmountWon(0);
                setGameState((prev) => ({
                    ...prev,
                    resultOverlay: false,
                    gridRevealed: false,
                }));
            }, 5000);
        }
    };

    const startGame = () => {
        handlePlaceBet();
        setGameState((prev) => ({ ...prev, resultOverlay: false }));
        resetGame();
        setGameState((prev: GameState) => ({
            ...prev,
            gameActive: true,
            gridRevealed: false,
            multiplier: 1,
            revealedCount: 0,
        }));
    };
    const toggleBetMode = (isAuto: boolean,gameActive:boolean) => setGameState(prev => ({ ...prev, autoBet: isAuto ,gameActive:gameActive}));
    const toggleWinReset = (isReset: boolean) => setGameState(prev => ({ ...prev, isResetActive: isReset }));
    const toggleLossReset =  (isLossReset: boolean) => setGameState(prev => ({ ...prev, isLossResetActive: isLossReset }));

    useEffect(() => {
        setGameState(prev => ({
            ...prev, gridItems: createInitialGrid(rows, cols, gold, bomb), resultOverlay: false
        }));
        resetGame();
    }, [bomb, cols, gold, rows, selectedLevel]);


    const startAutoBet = () => {
        if(!gameState.selectedCells) return;

        handlePlaceBet();
        setGameState((prev: GameState) => ({
            ...prev,
            // resultOverlay: false,
            autoBet: true,
            gameActive: true,
            gridRevealed: false,
            revealedCount: 0,
        }));

        const interval = setInterval(() => {
            handleBetResults(betAmount);

            setGameState((prev) => {
                const selectedCells = prev.selectedCells || [];
                const hasBomb = selectedCells.some(cell => cell.type === "bomb");

                if (hasBomb) {
                    return {
                        ...prev,
                        gameActive: false,
                        gridRevealed: true,
                        resultOverlay: false,
                        gridItems: prev.gridItems.map(row => row.map(cell => ({ ...cell, revealed: true }))),
                    };
                } else {

                    const newGridItems = createInitialGrid(rows, cols, gold, bomb).map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const prevCell = prev.gridItems[rowIndex][colIndex];
                            return { ...cell, selected: prevCell.selected };
                        })
                    );

                    return {
                        ...prev,
                        resultOverlay: false,
                        gridRevealed: true,
                        gridItems: newGridItems,
                    };
                }
            });

            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    gridRevealed: false,
                    resultOverlay: false,
                }));
            }, 1000);
        }, 2000);

        setAutoBetInterval(interval);
    };


    const stopAutoBet = () => {
        if (autoBetInterval) {
            clearInterval(autoBetInterval);
            setAutoBetInterval(null);
        }
        setGameState((prev) => ({
            ...prev,
            // gameActive: false,
            autoBet: false,
            gridItems: createInitialGrid(rows, cols, gold, bomb),
        }));
    };

    useEffect(() => {
        return () => {
            if (autoBetInterval) {
                clearInterval(autoBetInterval);
            }
        };
    }, [autoBetInterval]);



    return (
        <>
            <div className='canvas-view'>
                <div className="mines-game-title">
                    <span>Mines Game</span>
                </div>

                <div className='canvas-bet-area'>
                    <div className="mines-game-controls-bottom">
                                <span className="Bet-Amount-controls">
                                   {!gameState.gameActive && (
                                       <div className="bet-shortcuts">
                                           {betValues.map((val) => (
                                               <div
                                                   className="bet-shortcut-value select"
                                                   key={val}
                                                   onClick={() => handleBetChange("select", val)}>
                                                   {val}  </div>
                                           ))}
                                       </div>
                                   )}
                                    <div className='bet-area'>
                                                <span className='title'>
                                                    Bet Amount
                                                </span>
                                                <div className='bet-amount-area'>
                                                <input className='bet-Amount' disabled={gameState.gameActive}
                                                       type="number" value={betAmount}
                                                       onChange={(e) => handleBetChange("select", +e.target.value)}/>
                                                    <span className='bet'>
                                                            <span className='bet-half-double'>
                                                            {betOptions.map(({value, label}) => (
                                                                <span
                                                                    key={value}
                                                                    className={`bet-${value} ${activeBet === value ? "active" : ""} ${gameState.gameActive ? "disabled" : ""}`}
                                                                    onClick={() => handleBetChange(value as "half" | "double" | "select")}>
                                                                {label}
                                                            </span>
                                                            ))}
                                                                </span>
                                                        </span>
                                                </div> </div>
                                </span>

                        <span className="place-bet-buttons">
                        {/*    manual betting */}
                        {!gameState.autoBet ? (
                            <span className={`start-game ${gameState.gameActive ? 'checkout-btn' : ''}`}
                                  onClick={gameState.gameActive ? HandleCheckout : startGame}
                                  style={{
                                      opacity: 1,
                                      pointerEvents: "auto",
                                  }}>
                                    {gameState.gameActive ? `Cash Out ${(gameState.multiplier * betAmount).toFixed(2)}`
                                        : "Bet"}
                                                        </span>
                        ) : (
                            // auto bet
                            <span className={`start-game ${gameState.gameActive ? '' : 'checkout-btn'}`}
                                  onClick={!autoBetInterval ? startAutoBet : stopAutoBet}
                                  style={{
                                      opacity: 1,
                                      pointerEvents: "auto",
                                  }}
                            > {!autoBetInterval ? "start AutoBet" : `stop AutoBet  ${(gameState.multiplier).toFixed(2)}`}

                                                        </span>
                        )}</span>

                        <span className="level-changes">
                                    <span className="level-changes-titles">
                                        <span className="auto-bet-title"> Mines</span>
                                        {gameState.gameActive && (
                                            <span className="Gems">Gems</span>)}
                                        </span>

                                     <span className="level-changes-controls">
                                         <div
                                             className={`${!gameState.gameActive ? 'bet-number' : 'bet-number-deactivated'}`}>

                                            <select
                                                className="Mines-control"
                                                id="level"
                                                value={selectedLevel}
                                                onChange={(e) => handleLevelChange(Number(e.target.value))}
                                                disabled={gameState.gameActive}
                                                style={{
                                                    backgroundColor: gameState.gameActive
                                                        ? 'rgb(48, 73, 89)' : 'rgb(19, 37, 49)'
                                                }}
                                            >
                                            {levelConfigs.map((config, index) => (
                                                <option className="option" key={index} value={index}>
                                                    {gameState.gameActive ? `Mines ${config.level}` : config.level}
                                                </option>
                                            ))}

                                        </select>
                                         </div>
                                         {gameState.gameActive && (
                                             <span className="Mines-control"
                                                   style={{
                                                       backgroundColor: gameState.gameActive
                                                           ? 'rgb(48, 73, 89)' : 'rgba(200, 200, 200, 0.5)'
                                                   }}
                                             >
                                                <span className="mine-count">{gameState.revealedCount}</span>
                                        <span>/ {rows * cols}</span>
                                            </span>)}
                                        </span>
                    </span>
                        {gameState.autoBet && (
                            <div className='autobet-content'>
                                <span className='auto-bet-title'>Number of bets</span>
                                <input className='no-of-bets' disabled={gameState.gameActive} type="number"
                                       placeholder='0'/>

                                <div className='on-loss-win-details'>
                                    <span className='auto-bet-title'> On Win</span>
                                    <div className='on-win'>
                                        {['Reset', 'Increase by:'].map((label, index) => (
                                            <span
                                                key={index}
                                                className={`reset-increase ${gameState.isResetActive === (index === 1) ? 'active' : ''}`}
                                                onClick={() => toggleWinReset(index === 1)}
                                            >{label}      </span>
                                        ))}
                                        <div className="percent-input">
                                            <input
                                                className="percent-value"
                                                disabled={gameState.gameActive}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder='0.000'
                                            />
                                            <span className="percent-symbol">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='on-loss-win-details'>
                                    <span className='auto-bet-title'> On Loss</span>
                                    <div className='on-loss'>
                                        {['Reset', 'Increase by:'].map((label, index) => (
                                            <span
                                                key={index}
                                                className={`reset-increase ${gameState.isLossResetActive === (index === 1) ? 'active' : ''}`}
                                                onClick={() => toggleLossReset(index === 1)}
                                            >{label}      </span>
                                        ))}
                                        <div className="percent-input">
                                            <input
                                                className="percent-value"
                                                disabled={gameState.gameActive}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder='0.000'
                                            />
                                            <span className="percent-symbol">%</span>
                                        </div>
                                    </div>
                                </div>
                                <span className='auto-bet-title'>Stop on Profit</span>
                                <div className="stop-profit-loss">
                                    <div className="stop-loss">
                                        <input className='profits-loss' disabled={gameState.gameActive}
                                               placeholder='0.000'
                                               type="number"/>
                                        <img className='ksh-icon' src={KshIcon} alt='ksh-icon'/>
                                    </div>
                                </div>
                                <span className='auto-bet-title'>Stop on Loss</span>
                                <div className="stop-profit-loss">
                                    <div className="stop-loss">
                                        <input className='profits-loss' disabled={gameState.gameActive}
                                               placeholder='0.000'
                                               type="number"/>
                                        <img className='ksh-icon' src={KshIcon} alt='ksh-icon'/>

                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="Manual-auto">
                            <div className="Manual-auto-toggle">
                                {['Manual', 'Auto'].map((label, index) => {
                                    const isActive = gameState.autoBet === (index === 1);
                                    return (
                                        <div
                                            key={index}
                                            className={`manual-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => (gameState.gameActive ? '' : toggleBetMode(index === 1, true))}
                                        >  {label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='bet-history'>
                            <div className='bet-history-titles'>
                                <span>Bet Amount</span>
                                <span>Multiplier</span>
                                <span>CheckOut</span>
                            </div>
                            <hr className='bet-history-border'/>
                            {betHistory.map((entry, index) => (
                                <div key={index} className="bet-history-content">
                                    <span>{entry.betAmount}</span>
                                    <span>{entry.multiplier.toFixed(2)}</span>
                                    <span>{entry.checkoutAmount.toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Canvas rows={rows} cols={cols} gap={gap} autoBet={gameState.autoBet}
                            cellWidth={cellWidth} cellHeight={cellHeight} gridItems={gridItems} gridRevealed={gridRevealed}
                            handleCanvasClick={handleCanvasClick} gameState={gameState}
                    />
                </div>

            </div>
                {gameState.resultOverlay && (
                    <div className="canvas-overlay">
                        <div className="result-popup">
                        <span className='top-results-overlay'>
                            <img className='diamond-result-img' src={leftResultImg} alt="left"/>
                        <span>You Won</span>
                            <img className='diamond-result-img' src={rightResultImg} alt="right"/>
                        </span>
                            <span className='amount-won'>{amountWon ? `${amountWon.toFixed(0)} ksh` : "0 ksh"}</span>
                            <hr className='results-border'/>
                            <span className='result-multiplier'>
                                <span>Multiplier
                            </span>
                                <span className='result-multiplier'>
                            <span>{gameState.multiplier ? gameState.multiplier.toFixed(2) : "1.00"}x</span>

                        </span>
                        </span>
                        </div>
                    </div>)}

        </>
    );
};