import he from 'he';
import { useAtomValue } from "jotai"
import { projectAtom } from "../atoms/projectAtom"
import { useEffect, useState } from "react";
import axios from "axios";
import { calculateTotalTimePerDay, formatReportDateTime } from "./FormatData";


function getTimers(projectId) {
    return axios.get(`/api/Project/getProjectTimers/${projectId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
        return null;
    });
}

const DateReport = ({timers, taskList, setTwoColumn}) => {
    const project = useAtomValue(projectAtom);
    let collated = calculateTotalTimePerDay(timers);
        // setTwoColumn(collated.length>20);
    function getTaskNames(timerTaskIds) {
        return timerTaskIds
            .map(id => {
                const task = taskList.find(task => task.taskId === id);
                return task ? he.decode(task.name) : 'Project'; // Replace with name or "Unknown Task" if not found
            })
            .join(", ");
    }

   return collated.map( item => {
        return (<p key={item.date}>
                <strong>{item.date+': '}{item.totalTime + ' '}</strong> 
                Working on tasks: {getTaskNames(item.tasks)}
                </p>)
      })
}

const FullTimeReport = ({timers}) => {
    return  (<>
        {timers.map( timer => {
        return (
        <p key={timer.startDate}>{formatReportDateTime(timer.startDate, timer.endDate)}</p>
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
            {!collate && <FullTimeReport timers={timers} />}
            </div>
        </div>
    )
}
