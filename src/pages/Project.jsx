import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { projectListAtom } from '../atoms/projectListAtom';
import { showDetailAtom } from '../atoms/showDetailAtom';
import { projectAtom } from '../atoms/projectAtom';
import {statusLabels} from '../backendconfig';
import axios from 'axios';
import { ProjectDetailView } from '../components/ProjectDetailView';
import { AddNewItemForm } from '../components/AddNewItemForm';
import { formatTimeSpan } from '../components/FormatData';
import { DeleteProject } from '../components/DeleteDBItem';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function Project(){

const [projectList, setProjectList] = useAtom(projectListAtom);
const [project, setProject] = useAtom(projectAtom);
const [showProject, setShowProject] = useAtom(showDetailAtom);
const [addItemForm, setAddItemForm] = useState(false);
const [serverError, setServerError] = useState(false);


useEffect(() => {
    if (!showProject){
        axios.get("https://craftintimeapi-cre5hhfuhudvajac.swedencentral-01.azurewebsites.net/Project")
                .then(response => {
                    setProjectList(response.data);
                    setProject(null);
                    setShowProject(false);
                })
                .catch(error => {
                    console.log(error);
                    if (error.status ===500 ){
                        setServerError(true);
                    }
                });
            }
    }, [showProject]);
  
    const titleFormat=()=> {
        if (projectList?.length ===0) return "No Projects";
        if (projectList?.length ===1) return "1 Project";
        return `${projectList?.length} Projects`;
    }

    // Set scaffolded projectID for fetching in the component
    const displayProjectDetails = (e) => {
        let projectId = e.currentTarget.id.split('-')[1];
        setProject({'projectId':projectId})
        setShowProject(true);
    }

    function toggleAddingForm() {
        setAddItemForm(prev => !prev);
    }
  

    if (serverError) {
        return (
        <div className="header">
             <h2 id="nowShowing">Server unreachable</h2>
        </div>
        )
    }
    if (!serverError && showProject) {
             return <ProjectDetailView />
    } else {
    return (
        <>
        <div className="header">
             <h2 id="nowShowing">{titleFormat()}</h2>
        </div>
        <div id="contents">
            <div id="addNewItem" className={addItemForm ? 'shadowbox':undefined}>
                <button className={addItemForm? "addItemButtonActive":"addItemButton"} 
                onClick={toggleAddingForm} aria-label="Add new project">+</button>
                {addItemForm && <AddNewItemForm setAddItemForm={setAddItemForm} 
                    setProject={setProject} setShowProject={setShowProject} />}
            </div>
            {projectList?.map(item => (
                <div key={item.projectId} className="itemCard">
                    <div tabIndex="0" className="item" id={`detail-${item.projectId}`} 
                        onClick={displayProjectDetails}>
                        <p className={`status${item.status}`}>{statusLabels[project?.status] || ""}</p>
                        <h3>{item.name}</h3>
                        <p className={item.hasTimerRunning? "totalTime runningTimer":"totalTime"}>
                            {formatTimeSpan(item.totalWorkingTime)}</p>
                    </div>
                    <DeleteProject projectToDelete={item} />
             </div>
             ))}
        </div>
        </>
    )}
}
