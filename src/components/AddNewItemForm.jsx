
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

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
            console.log(newProject);
            newProject && axios.post(`/api/Project/addProject`, newProject, {
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
            <button>Add</button>
        </form>
        </>
        
    )
}