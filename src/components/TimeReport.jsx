import he from 'he';
import { useAtomValue } from "jotai"
import { projectAtom } from "../atoms/projectAtom"
import { useEffect, useState } from "react";
import axios from "axios";
import { calculateTotalTimePerDay, formatReportDateTime } from "./FormatData";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getTimers(projectId) {
    return axios.get(`${API_BASE_URL}/Project/getProjectTimers/${projectId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
        return null;
    });
}

function getTaskNames(taskList, timerTaskIds) {
    return timerTaskIds.map(id => {
            const task = taskList.find(task => task.taskId === id);
            return task ? he.decode(task.name) : 'Project'; 
        })
        .join(", ");
}
const DateReport = ({timers, taskList}) => {
    const project = useAtomValue(projectAtom);
    let collated = calculateTotalTimePerDay(timers);

   return collated.map( item => {
        return (<p key={item.date}>
                {item.date+': '} <strong>{item.totalTime + ' '}</strong> 
                Working on tasks: {getTaskNames(taskList, item.tasks)}
                </p>)
      })
}

const FullTimeReport = ({timers, taskList}) => {

    return  (<>
        {timers.map( timer => {
        return (
        <p key={timer.startDate}>
            <strong>{he.decode(getTaskNames(taskList, [timer.taskId]))+ ' '}</strong>
            {formatReportDateTime(timer.startDate, timer.endDate)} 
            </p>
        )})}
        </>
        )
}

export const TimeReport = () => {
    const project = useAtomValue(projectAtom);
    const [collate, setCollate] = useState(true);
    const [timers, setTimers] = useState(null); // State to store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const[twoColumn, setTwoColumn] = useState(false);

    useEffect(() => {
        if (!project?.projectId) return; // Ensure projectId exists before fetching

        setLoading(true); // Start loading
        getTimers(project.projectId).then(data => {
            setTimers(data);
            setTwoColumn(data.length>20);
            setLoading(false); // Stop loading
        });
    }, [project.projectId]); // Re-fetch when projectId changes

    if (loading) return  <div id="timeReport" className="shadowbox"><p>Loading timers...</p></div>;

    
    return (
        
        <div id="timeReport" className="shadowbox">
            <h4>Report of all the times worked on this project</h4>
            <button className="toggleTimeReport" 
                onClick={() => setCollate(!collate)}>{collate ? "Show all timers":"Show dates + total time"}</button>
            
            <div id="dateDetails" className={twoColumn ? "grid-container" : "single-column"}>
            {collate && <DateReport timers={timers} taskList={project.tasks} setTwoColumn={setTwoColumn}/>}
            {!collate && <FullTimeReport timers={timers} taskList={project.tasks} />}
            </div>
        </div>
    )
}
