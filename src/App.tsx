
import './App.css'
import {MainMinesGame} from "./Components/MainMinesGame.tsx";
import {GameProvider} from "./Components/GameContext.tsx";

function App() {


  return (
    <>
        <GameProvider>
            <MainMinesGame/>
        </GameProvider>
    </>
  )
}

export default App
