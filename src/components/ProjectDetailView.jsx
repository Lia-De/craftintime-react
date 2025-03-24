import he from 'he';
import { projectAtom } from '../atoms/projectAtom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {statusLabels} from '../backendconfig';
import axios from 'axios';
import { ApplyTimer } from './ApplyTimer';
import { formatTimeSpan, formatDateTime } from '../components/FormatData';
import { AddTagToProject, AddTagToTask } from './AddTagToItems';
import { EditProject } from './EditProject';



export const ProjectDetailView = () => {
const [project, setProject] = useAtom(projectAtom);
const [loading, setLoading] = useState(true);
const [timer, setTimer] = useState(false);
const [startTimer, setStartTimer] = useState(false);
const [stopTimer, setStopTimer] = useState(false);
const [stopDate, setStopDate] = useState(null);
const [editing, setEditing] = useState(false);
const [editingTask, setEditingTask] = useState(false);


// Load in the project from the back-end, ensure it loads before rendering. Also check if it has a timer running.
    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/Project/getSingleProject/${project.projectId}`)    
        .then(response => {
            setProject(response.data);
            response.data.hasTimerRunning ? setTimer(true) : setTimer(false);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false); 
        }); 
    },[])


    function setDeadline(taskToEdit){
        console.log("set deadline ",taskToEdit);
    }

function toggleTimer(){
    let date=Date.now();
    if (timer) {
        setTimer(false);
        setStopTimer(true);
        setStartTimer(false);
        setStopDate(date);
    } else {
        let timerData = {
            'projectID': project.projectId,
            'timestamp': Number(date)
        }
        setTimer(true);
        setStopTimer(false);
        setStartTimer(true);
        setStopDate(null);
        axios.post(`/api/Project/startTimer/${project.projectId}`,timerData, {
            headers: {
                "Content-Type": "application/json",
            },
        }).catch((error)=>{console.log(error)})
        .finally(()=>{
            setStartTimer(false);
        });
    }    
}
function toggleEditProject(){
    setEditing(!editing);
}


    if (loading) return <div className="header"><h2 id="nowShowing">Loading project ...</h2></div>;
    if (!project) return <div className="header"><h2 id="nowShowing">Project not found</h2></div>;
    return (
        <>
        <div className="header">
            <button className="editButton" onClick={toggleEditProject}></button>
            <h2 id="nowShowing">{he.decode(project.name)}</h2>
            <div id="projectTimers">
                {project.status === 3 ? '':<button id="timerStart" className={timer? 'running': ''} onClick={toggleTimer}>Start</button>}
                {stopTimer ? <ApplyTimer project={project} setStartTimer={setStartTimer} setStopTimer={setStopTimer} date={stopDate}/>:''}
            </div>
        </div>
        <div id="contents">
        <div id={`detail-${project?.projectId}`}>
            {editing && <EditProject setEditing={setEditing} />}
            
            <div className="header">
                <p className={`status${project?.status}`}>{statusLabels[project?.status] || ""}</p>
                <p className="totalTime">{formatTimeSpan(project.totalWorkingTime)}</p>
            </div>
            {project?.description.split('\n')
            .map((line,i) => <p key={i}>{he.decode(line).replace('<br>','')}</p>)}
            <div id="tagBox" className="tagsList">
                
                <ul className="tagsList">
                {project?.tags?.map((tag) => <li key={tag.tagId}>{tag.name}</li>) }
                </ul>
                <div id="projectTagAdding">
                    <AddTagToProject />
                </div>
            </div>

            <div className="header">
                <h3>Tasks</h3>
                <p id="addingBox">
                    <button id="addTaskButton" aria-label="Add new task">+</button>
                </p>
            </div>

            {project?.tasks?.map(task => !task.isDeleted && (<div key={`task-${task.taskId}`} className="detailTask shadowbox">
                <div className="header">
                    <button className="editButton">Edit</button>
                    <p className={`status${task?.status}`}>{statusLabels[task?.status] || ""}</p>
                    <h4 id={`task-${task.taskId}`}>{he.decode(task?.name)}</h4>
                    {task.deadline? <p className="deadline">{formatDateTime(task.deadline)}</p> : <p className="noDeadline" onClick={() => setDeadline(task.taskId)}></p>}
                </div>
                <p className="totalTime">{formatTimeSpan(task.timeSpent)}</p>
                {task.description.split('\n')?.map((line,i) => <p key={i}>{he.decode(line).replace('<br>','')}</p>)}
                
                <div className="tagsList">
                    <ul className="tagsList">
                        {task.tags?.map((tag) => <li key={tag.tagId}>{tag.name}</li>) }
                    </ul>
                    <div id="taskTagAdding">
                        <AddTagToTask taskToEdit={task.taskId}/>
                    </div>
                </div>

            </div>
            ))}

        </div>
    </div>
    </>
     )
    
};
