import React, { createContext, useState, useContext, ReactNode } from "react";
import { GameContextType } from "../Utils/Gridtype.ts";

// Create the context with an initial empty value (to be overwritten)
export const GameContext = createContext<GameContextType | undefined>(undefined);

// Define the type for the GameProvider props to include 'children'
interface GameProviderProps {
    children: ReactNode;
}

// Create a provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [gameContext, setGameContext] = useState<GameContextType>({
        balance: 5000,
        betAmount: 20,
        setBetAmount: (amount: number) => {
            setGameContext((prevContext) => ({
                ...prevContext,
                betAmount: amount,
            }));
        },
        setBalance: (amount: number) => {
            setGameContext((prevContext) => ({
                ...prevContext,
                balance: amount,
            }));
        },
    });

    return (
        <GameContext.Provider value={gameContext}>
            {children}
        </GameContext.Provider>
    );
};

// Custom hook to use the context
export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};
