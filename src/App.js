import { BrowserRouter,Routes,Route } from "react-router-dom";
import ToDoList from "./components/ToDoList";
import Login from "./Login"


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={`/`} element={<Login/>}/>
				<Route path={`/Home`} element={<ToDoList/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App