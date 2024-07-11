import { BrowserRouter,Routes,Route } from "react-router-dom";
import ToDoList from "./components/ToDoList";
import Login from "./Login"
import Signin from "./Signin"
import Band from "./components/Band"
import UseCase from "./components/UseCase"
import BandForm from "./components/BandForm";
import BandDetail from "./components/BandDetail";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={`/`} element={<Login/>}/>
				<Route path={`/signin`} element={<Signin/>}/>
				<Route path={`/home`} element={<ToDoList/>}/>
				<Route path={`/band`} element={<Band />}/>
				<Route path={`/usecase`} element={<UseCase />}/>
				<Route path={`/form`} element={<BandForm />}/>
				<Route path={`/band/banddetail/:id`} element={<BandDetail />}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App