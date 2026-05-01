import { Route, Routes } from "react-router"

import { SignUpPage } from "../pages/SignupPage"
import { LoginPage } from "../pages/LoginPage"

export function AuthRoutes() {
    return (
        <Routes>
            <Route>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path="/signup" element={<SignUpPage />}></Route>
            </Route>
        </Routes>
    )
}