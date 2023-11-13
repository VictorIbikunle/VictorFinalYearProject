import Navbar from "./Navbar"
import EmotionDetection from "./pages/EmotionDetection"
import Help from "./pages/Help"
import Information from "./pages/Information"
import Home from "./pages/Home"

function App(){
  let Component
  switch(window.location.pathname){
    case "/":
      Component = Home
      break
      case "/Emotion%20Detector":
        Component = EmotionDetection
        break
        case "/Information":
          Component = Information
          break
          case "/Help":
            Component = Help
            break  

  }
return (
<>
<Navbar /> 
<Component />
</>

)
}

export default App


