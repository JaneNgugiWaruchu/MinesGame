import { useState } from "react";
import {createInitialGrid} from "./createInitialGrid.ts";
import {GameState} from "../Utils/Gridtype.ts";

export const useGameState = (rows: number, cols: number, gold: number, bomb: number) => {
    const [gameState, setGameState] = useState<GameState>({
        rows,
        cols,
        gameActive: false,
        revealedCount: 0,
        multiplier: 1,
        resultOverlay:false,
        gridRevealed: false,
        isLossResetActive: false,
        autoBet:false,
        isResetActive:false,
        gridItems: createInitialGrid(rows, cols, gold, bomb),
        resetGame: () => resetGame(),
        setGameActive: (active) => updateGameState("gameActive", active),
        setMultiplier: (value) => updateGameState("multiplier", value),
        setRevealedCount: (value) => updateGameState("revealedCount", value),
        setGridItems: (grid) => updateGameState("gridItems", grid),
    });

    const updateGameState = <K extends keyof GameState>(key: K, value: GameState[K]) => {
        setGameState((prev) => ({ ...prev, [key]: value }));
    };

    const resetGame = () => {
        const newGrid = createInitialGrid(rows, cols, gold, bomb);
        setGameState({
            rows,
            cols,
            gameActive: false,
            gridRevealed: false,
            multiplier: 1,
            autoBet:false,
            isResetActive:false,
            isLossResetActive:false,
            revealedCount: 0,
            resultOverlay: false,
            gridItems: newGrid,
            resetGame: () => resetGame(),
            setGameActive: (active) => updateGameState("gameActive", active),
            setMultiplier: (value) => updateGameState("multiplier", value),
            setRevealedCount: (value) => updateGameState("revealedCount", value),
            setGridItems: (grid) => updateGameState("gridItems", grid),
        });
    };

    return { gameState, updateGameState, resetGame };
};
