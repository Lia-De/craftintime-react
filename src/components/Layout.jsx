import { NavLink, Outlet, useNavigate } from "react-router"
import "../App.css";
import { useAtom } from "jotai";
import { showDetailAtom } from "../atoms/showDetailAtom";

export const Layout = () => {
    const [showDetail, setShowDetail] = useAtom(showDetailAtom);
    const navigate = useNavigate();
    
    function handleNavClick(){
        if (showDetail)
            setShowDetail(false);
    }

    return (
        // <div id="site-container">
        <>
            <h1>Craft in Time</h1>
            <nav id="navigate">
                <NavLink tabIndex="-1" to="/project" onClick={handleNavClick}><button id="projectsBtn">Projects</button></NavLink>
                <NavLink tabIndex="-1" to="/tags"><button id="tagsBtn">Tags</button></NavLink>
                
            </nav>
            <div id="container">
                <Outlet />
            </div>
            </>
        // </div>
    )
    
}