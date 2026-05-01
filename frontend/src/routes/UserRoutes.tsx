import { Route, Routes } from "react-router"

import { MainPage } from "../pages/MainPage"
import { TaskPage } from "../pages/TasksPage"
import { CarenciasPage } from "../pages/CarenciasPage"
import { TaskDetailPage } from "../pages/TaskDetailPage"

import { LayoutPage } from "../pages/LayoutPage"


export function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LayoutPage/>}>
                <Route path="/" element={<MainPage />}></Route>
                <Route path="/memorando" ></Route>
                <Route path="/tarefas" element={<TaskPage/>}/>
                <Route path="/tarefas/:id" element={<TaskDetailPage/>}/>
                <Route path="/carencias" element={<CarenciasPage/>}/>
            </Route>
        </Routes>
    )
}