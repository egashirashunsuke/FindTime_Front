import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import HowToUse from "./pages/HowToUse"
import MyCalendar from "./pages/MyCalendar"
import GroupOverview from "./pages/GroupOverview"
import GroupCalendar from "./pages/GroupCalendar";
import CreateOrJoinGroup from "./pages/CreateOrJoinGroup"
import OpinionForm from "./pages/OpinionForm";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={`/`} element={<Login/>}/>
				<Route path={`/signup`} element={<SignUp/>}/>
				<Route path={`/howtouse`} element={<HowToUse />}/>
				<Route path={`/mycalendar`} element={<MyCalendar/>}/>
				<Route path={`/groupoverview`} element={<GroupOverview />}/>
				<Route path={`/group/groupcalendar/:id`} element={<GroupCalendar />}/>
				<Route path={`/createorjoingroup`} element={<CreateOrJoinGroup />}/>
				<Route path={`/opinionform`} element={<OpinionForm />}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App