import axios from "axios"
import { useForm } from "react-hook-form"
import { PopulatedStatusList } from "./FormatData";
import { useEffect, useState } from "react";

export const EditTask = ({ task, setEditingTask}) => {
    const {handleSubmit, register}= useForm();
    const [editObject, setEditObject] = useState(null);

    const onSubmit = (data) => {
        let newDeadline = (data.deadline ==='') ? null : data.deadline;
        let newDesc = data.description === '' ? null : data.description;
        let newStatus = data.status? Number(data.status) : null;
        const obj = {...data,
                    deadline: newDeadline,
                    description: newDesc,
                    taskId: Number(task.taskId),
                    projectId: Number(task.projectId),
                    status: newStatus
                    };
                    console.log(obj);
        setEditObject(obj);
    }
    useEffect(()=>{
        (editObject!=null) && axios.post('/api/Task/updateTask', editObject)
        .then(response => {
            console.log(response.data)
            setEditingTask(false);
        })
        .catch((error)=>console.log(error))
        .finally(()=>{setEditingTask(prev => !prev)});

    },[editObject])

    return (

        <div id="edits">
            <h3>Editing</h3>
            <div>
                <form id="editTaskForm" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" defaultValue={task.name} name="name" {...register('name', {required:true})}/>

                    <label htmlFor="description">About:</label>
                    <textarea id="description" name="description" rows="5" 
                        defaultValue={task.description} {...register('description')}></textarea>

                    <PopulatedStatusList item={task} register={register}/>
                    <p className="span2">Click to remove Tags</p>

                    <label>Tags:</label><div id="editTaskTags">
                    {task.tags.map(tag => {
                        return <p key={tag.tagId} 
                        onClick={()=>{confirmRemoveTag(tag)}}
                        className="deleteTag">{tag.name}</p>
                    })}
                    </div>
                    <label htmlFor="deadline">Deadline: </label>
                    <input name="deadline" id="deadline" defaultValue={task.deadline} type="datetime-local" {...register('deadline')} />
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}