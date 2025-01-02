import {MinesCanvas} from "./MinesCanvas.tsx";
import '../assets/css/styles.css'
import MBackBtn from '../assets/img/back.png'
import MSettings from '../assets/img/menu-bar.png'
import MClose from '../assets/img/close.png'
import MHelp from '../assets/img/help.png'
import MMute from '../assets/img/mute.png'
import MUnmUte from '../assets/img/unmute.png'
import MDepositBtn from '../assets/img/plus-img.png'
import {useState} from "react";
import { useGameContext} from "./GameContext.tsx";


export const MainMinesGame = () => {
    const { balance } = useGameContext();

    const [minesUiState, setMinesUiState] = useState({
        isSettingsOpen: false,

    });

    const toggleState = (stateName: keyof typeof minesUiState) => {
        setMinesUiState(prevState => ({
            ...prevState,
            [stateName]: !prevState[stateName]
        }));
    };



    return (
        <>
        <div className="mines-game-ui">
            <div className="Mines-top-bar">
                <img className='Mines-icons-style' src={MBackBtn} alt='back-btn'/>

                <div className='mines-balance-deposit'>
                    <div className='balance'>{balance.toFixed(0)}</div>
                    <img className='deposit-btn' src={MDepositBtn} alt='back-btn'/>

                </div>
                <div className="dropdown">
                    {!minesUiState.isSettingsOpen ? (
                        <img
                            className="Mines-icons-style"
                            src={MSettings}
                            alt="back-btn"
                            onClick={() => toggleState('isSettingsOpen')}
                        />
                    ) : (
                        <>
                            <img
                                className="Mines-icons-style"
                                src={MClose}
                                alt="back-btn"
                                onClick={() => toggleState('isSettingsOpen')}
                            />

                            <div className="Mines-settings-dropdown">
                                <img className="Mines-icons-style" src={MHelp} alt="help-btn"/>
                                <img
                                    className="Mines-icons-style"
                                    src={MMute}
                                    alt="mute-btn"
                                    onClick={() => toggleState('isSettingsOpen')}
                                />
                                <img
                                    className="Mines-icons-style"
                                    src={MUnmUte}
                                    alt="unmute-btn"
                                    onClick={() => toggleState('isSettingsOpen')}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <MinesCanvas/>


        </div>

        </>
    )
}


