
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useAtom } from "jotai";
import { projectAtom } from "../atoms/projectAtom";
import { taskListAtom } from "../atoms/taskListAtom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddNewItemForm = ({setAddItemForm, setProject, setShowProject}) => {
    const { register, handleSubmit, reset, formState:{errors} } = useForm();
    const [newProject, setNewProject] = useState(null);
    
    const onSubmit = (data) => {
        setNewProject(data);
        reset();
    }
    
    // When the user submits the form - send new user to backend
    useEffect(()=> {
        if (newProject!= null) {
            newProject && axios.post(`${API_BASE_URL}/Project/addProject`, newProject, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
        .then(response =>{
            setProject(response.data);
            setAddItemForm(false);
        })
        .catch(error => {
            alert(error);
        })
        .finally(()=> setShowProject(true)
        );
    }
    },[newProject])

return (<>
        <h4>Add project</h4>
        <form id="addProject" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Project name:</label>
            <input 
                placeholder={errors.name&&'Projects must have a name'} 
                type="text" id="newName" name="name" {...register('name', {required:true})} />
            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="text" {...register('description')} />
            <button type="submit">Add</button>
        </form>
        </>
        
    )
}

export const AddNewTaskForm = ({setUiState}) =>{
    const { register, handleSubmit, reset, formState:{errors} } = useForm();
    const [newTask, setNewTask] = useState(null);
    const [project, setProject] = useAtom(projectAtom);
    const [taskList, setTaskList] = useAtom(taskListAtom);

    const onSubmit = (data) => {
        let newDesc = data.description==='' ? null : data.description;
        let newDeadline=data.deadline==='' ? null : data.deadline;
        setNewTask(({...data, description: newDesc, deadline: newDeadline, projectId: project.projectId}));
        
        reset();
    }
    useEffect(() => {
        (newTask!=null) && axios.post(`${API_BASE_URL}/Task/addTask`, newTask, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((result) => {
            setTaskList(prev => ([...prev, result.data] ));// Append the new task to the array
        })
        .catch((e)=>console.log(e))
        .finally(()=>{
            setUiState(prev => ({...prev, addTaskForm: false}));
        });
    },[newTask])
    
    return (
    <div id="addNewItem" className="shadowbox">
        <form id="addTask" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Task name:</label>
            <input 
                placeholder={errors.name&&'Tasks must have a name'} 
                type="text" id="name" name="name" {...register('name', {required:true})} />

            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="text" 
                {...register('description')} />
            
            <label htmlFor="deadline">Optional Deadline: </label>
            <input type="datetime-local" id="deadline" name="deadline" defaultValue={null} 
                {...register('deadline')} />
            <button type="submit">Add</button>
        </form>
    </div>
    )
}