import { useState } from 'react';

const useLevelGrid = () => {
    const totalGoldAndBombs = 25;
    const predefinedMultipliers = [
        0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10,
        0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20,
        0.21, 0.22, 0.23,
    ];

    const generateLevelConfigs = () => {
        const configs = [];

        for (let level = 2; level <= 24; level++) {
            const rows = 5;
            const cols = 5;
            const bomb = Math.min(2 + (level - 1), totalGoldAndBombs);
            const gold = totalGoldAndBombs - bomb;

            // Use predefined multiplier for the level
            const multiplier = predefinedMultipliers[level - 2]; // Adjusted for 0-based index

            configs.push({
                level: level.toString(),
                rows,
                cols,
                gold,
                bomb,
                multiplier,
            });
        }

        return configs;
    };

    const levelConfigs = generateLevelConfigs();
    const [selectedLevel, setSelectedLevel] = useState<number>(0); // 0-based index for levels

    // Handle level change
    const handleLevelChange = (newLevelIndex: number) => {
        if (newLevelIndex >= 0 && newLevelIndex < levelConfigs.length) {
            setSelectedLevel(newLevelIndex);
        }
    };

    const selectedLevelConfig = levelConfigs[selectedLevel];
    const { rows, cols, gold, bomb, multiplier } = selectedLevelConfig;

    return {
        levelConfigs, // Full list of levels
        selectedLevel, // Current level index
        handleLevelChange, // Function to change levels
        selectedLevelConfig, // Current level's configuration
        rows,
        cols,
        gold,
        bomb,
        multiplier, // Hardcoded odds for UI or logic
    };
};

export default useLevelGrid;
