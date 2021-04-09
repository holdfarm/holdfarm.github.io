import { Web3Provider } from "@ethersproject/providers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Web3ReactProvider } from "@web3-react/core";
import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "./pages/index";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 16000;
  return library;
}

const theme = createMuiTheme({
  typography: {
    fontFamily: "Nunito ,Open Sans, Arial",
    fontSize: 16,
    fontWeightRegular: 600,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  palette: {
    primary: {
      main: "#30336b",
    },
    secondary: {
      main: "#6ab04c",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <MainPage />
        </Router>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
