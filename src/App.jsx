import { Route, Routes } from "react-router-dom";
import Homepage from "./assets/components/Homepage";
import Rainfall from "./assets/components/Rainfall";
import UVIndex from "./assets/components/UVIndex";
import Navbar from "./assets/components/Navbar";
import Weather2hrs from "./assets/components/Weather2hrs";

export default function App () {

  return (
<>
  <Navbar/>
  <Routes>
  <Route path="/" element={<Homepage/>} />
  <Route path="/Weather2hrs" element={<Weather2hrs/>} />
  <Route path="/ErpTable" element={<Rainfall/>} />
  <Route path="/Rainfall" element={<Rainfall/>} />
  <Route path="/UVIndex" element={<UVIndex/>} />

  </Routes>
  </>
  );
};