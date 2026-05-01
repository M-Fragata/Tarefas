import { BrowserRouter } from "react-router";

import { UserRoutes } from "./UserRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutes } from "./AuthRoutes";

export function Routes() {

    const userStorage = localStorage.getItem("@educ:user")
    const user = userStorage ? JSON.parse(userStorage) : { role: "" }


    function AcessRoute() {
        switch (user.role) {
            case "admin":
                return <AdminRoutes/>
            case "user":
                return <UserRoutes/>
            default: 
                return <AuthRoutes/> 
        }
    }

    return (
        <BrowserRouter>
            <AcessRoute />
        </BrowserRouter>
    )
}