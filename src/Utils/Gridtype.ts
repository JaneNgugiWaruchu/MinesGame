// Gridtype.ts
export type GridItem = {
    revealed: boolean;
    type: "gold" | "blue" | "bomb" | null;
    selected: boolean;
};

export type GameState = {
    rows: number;
    cols: number;
    gameActive: boolean;
    revealedCount: number;
    multiplier: number;
    autoBet:boolean;
    selectedCells: GridItem[];
    isResetActive:boolean;
    isLossResetActive:boolean;
    gridRevealed: boolean;
    resultOverlay:boolean;
    gridItems: GridItem[][];
    resetGame: () => void;
    setGameActive: (active: boolean) => void;
    setMultiplier: (value: number) => void;
    setRevealedCount: (value: number) => void;
    setGridItems: (grid: GridItem[][]) => void;
};

export type GameContextType = {
    balance: number;
    betAmount: number;
    setBetAmount: (amount: number) => void;
    setBalance: (amount: number) => void;
};