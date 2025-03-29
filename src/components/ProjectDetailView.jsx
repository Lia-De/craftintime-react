import he from 'he';
import { projectAtom } from '../atoms/projectAtom';
import {taskListAtom} from '../atoms/taskListAtom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {statusLabels} from '../backendconfig';
import axios from 'axios';
import { ApplyTimer } from './ApplyTimer';
import { formatTimeSpan, formatDateTime, renderTextWithLineBreaks } from '../components/FormatData';
import { AddTagToProject, AddTagToTask } from './AddTagToItems';
import { EditProject } from './EditProject';
import { EditTask, EditTaskDeadline } from './EditTask';
import { AddNewTaskForm } from './AddNewItemForm';
import clsx from 'classnames';
import { TimeReport } from './TimeReport';


export const ProjectDetailView = () => {
const [project, setProject] = useAtom(projectAtom);
const [taskList, setTaskList] = useAtom(taskListAtom);

const [loading, setLoading] = useState(true);
const [stopDate, setStopDate] = useState(null);

const [uiState, setUiState] = useState({
    taskDeadlineToggle: false,
    taskDeadlineItem: 0,
    editingTask: false,
    startTimer: false,
    stopTimer: false,
    editing: false,
    addTaskForm: false,
    taskToEdit: 0,
    timeReport: false
});


// Load in the project from the back-end, ensure it loads before rendering.
//  Also check if it has a timer running.
    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/Project/getSingleProject/${project.projectId}`)    
        .then(response => {
            setProject(response.data);
            setTaskList(response.data.tasks);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false); 
        }); 
    },[])

function toggleTimer(){
    let date=Date.now();
    if (project.hasTimerRunning) {
        setProject(prev => ({...prev, hasTimerRunning: false}));
        setUiState(prev => ({
            ...prev,
            stopTimer: true,
            startTimer: false
        }));
        setStopDate(date);
    } else {
        let timerData = {
            'projectID': project.projectId,
            'timestamp': Number(date)
        }
        setProject(prev => ({...prev, hasTimerRunning: true}));
        setUiState(prev => ({
            ...prev,
            stopTimer: false,
            startTimer: true
        }));
        setStopDate(null);
        axios.post(`/api/Project/startTimer/${project.projectId}`,timerData, {
            headers: {
                "Content-Type": "application/json",
            },
        }).catch((error)=>{console.log(error)})
        .finally(()=>{
            // setStartTimer(false);
        });
    }    
}


    if (loading) return <div className="header"><h2 id="nowShowing">Loading project ...</h2></div>;
    if (!project) return <div className="header"><h2 id="nowShowing">Project not found</h2></div>;
    return (
        <>
        <div className="header">
            <button className={clsx("editButton", { clicked: uiState.editing })} 
                onClick={() => setUiState(prev => ({...prev, editing: !prev.editing}))}></button>
            <h2 id="nowShowing">{he.decode(project.name)}</h2>
            <div id="projectTimers">
                {project.status === 3 ? '': <button id="timerStart" 
                    className={project.hasTimerRunning? 'running': undefined} 
                        onClick={toggleTimer}>Start</button>}
                {uiState.stopTimer ? <ApplyTimer project={project} setUiState={setUiState}
                    date={stopDate}/>:''}
            </div>
        </div>
        <div id="contents">
        <div id={`detail-${project?.projectId}`}>
            {uiState.editing && <EditProject setUiState={setUiState}  />}
            
            <div className="header">
                <p className={project?.status ? `status${project?.status}`:undefined}>
                    {statusLabels[project?.status] || ""}</p>
                <p className="totalTime" 
                    onClick={()=>{setUiState((prev)=> 
                        ({...prev, timeReport: !prev.timeReport})
                )}}>{formatTimeSpan(project.totalWorkingTime)}</p>
            </div>
            {uiState.timeReport && <TimeReport />}
            {project && renderTextWithLineBreaks(project.description)}

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
                    <button id="addTaskButton" className={uiState.addTaskForm ? "clicked": undefined} 
                        aria-label="Add new task"
                    onClick={()=>setUiState(prev=> 
                        ({...prev, addTaskForm: !prev.addTaskForm}))}>+</button>
                    
                </p>
            </div>
            {uiState.addTaskForm && <AddNewTaskForm setUiState={setUiState}/>}

            {taskList?.map(task => !task.isDeleted 
                && (<div key={`task-${task.taskId}`} className="detailTask shadowbox">
                        <div className="header">
                        <button className={clsx("editButton", 
                        {clicked: uiState.editingTask === task.taskId })} 
                        onClick={()=>{
                            setUiState(prev => ({
                                ...prev, 
                                editingTask: prev.editingTask === task.taskId ? null : task.taskId 
                            }));
                            }}>Edit</button>
                        <p className={task.status!=undefined ? `status${task.status}`:undefined}>
                                {statusLabels[task.status] || ""}</p>
                        <h4 id={`task-${task.taskId}`}>{he.decode(task?.name)}</h4>
                        
                        {task.deadline 
                        ? <p className="deadline">{formatDateTime(task.deadline)}</p> 
                        : <EditTaskDeadline task={task} uiState={uiState} setUiState={setUiState} />}
                    </div>
                    
                    {(uiState.editingTask===task.taskId) 
                        && <EditTask task={task} setUiState={setUiState}/>}

                    <p className="totalTime">{formatTimeSpan(task.timeSpent)}</p>
                        {renderTextWithLineBreaks(task.description)}
                    
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
