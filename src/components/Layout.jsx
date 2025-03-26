import { NavLink, Outlet } from "react-router"
import { useAtom } from "jotai";
import { showDetailAtom } from "../atoms/showDetailAtom";
import "../App.css";

export const Layout = () => {
    const [showDetail, setShowDetail] = useAtom(showDetailAtom);
        
    // Make sure when you click the nav link when you are showing one single
    // project or tag to hide that detail and show the list.
    function handleNavClick(){
        showDetail && setShowDetail(false);
    }

    return (
        <>
            <h1>Craft in Time</h1>
            <nav id="navigate">
                <NavLink tabIndex="-1" to="/project" onClick={handleNavClick}>
                    <button id="projectsBtn">Projects</button>
                </NavLink>
                <NavLink tabIndex="-1" to="/tags" onClick={handleNavClick}>
                    <button id="tagsBtn">Tags</button>
                </NavLink> 
            </nav>
            <div id="container">
                <Outlet />
            </div>
            </>
    ) 
}