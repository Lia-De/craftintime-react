import axios from "axios"
import { useForm } from "react-hook-form"
import { formatDateTime, PopulatedStatusList } from "./FormatData";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { taskListAtom } from "../atoms/taskListAtom";

export const EditTask = ({ task, setUiState}) => {
    const {handleSubmit, register, formState:{errors}}= useForm();
    const [editObject, setEditObject] = useState(null);
    const [taskList, setTaskList] = useAtom(taskListAtom);

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
                    
        setEditObject(obj);
    }
    useEffect(()=>{
        (editObject!=null) && axios.post('/api/Task/updateTask', editObject)
        .then(response => {
            setUiState(prev => ({...prev, editingTask: false}));
            setTaskList(prev =>
                prev.map(t => 
                    t.taskId === task.taskId ? response.data : t
                )
            );
        })
        .catch((error)=>console.log(error));

    },[editObject])

    return (

        <div id="edits">
            <h3>Editing</h3>
            <div>
                <form id="editTaskForm" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" defaultValue={task.name} name="name" {...register('name', {required:true})}/>
                    {errors.name && <p className="errorMessage">Name must be at least 3 characters</p>}
                    <label htmlFor="description">About:</label>
                    <textarea id="description" name="description" rows="5" 
                        defaultValue={task.description} {...register('description')}></textarea>

                    <PopulatedStatusList item={task} register={register}/>
                    {task.tags.length>0 && (<>
                    <p className="span2">Click to remove Tags</p>
                    <label>Tags:</label>
                    <div id="editTaskTags">
                        {task.tags.map(tag => {
                            return <p key={tag.tagId} 
                            onClick={()=>{confirmRemoveTag(tag)}}
                            className="deleteTag">{tag.name}</p>
                        })}
                    </div>
                    </>)}
                    <label htmlFor="deadline">Deadline: </label>
                    <input name="deadline" id="deadline" defaultValue={task.deadline} 
                        type="datetime-local" {...register('deadline')} />
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}

export const EditTaskDeadline = ({task, uiState, setUiState}) => {
    const {register, handleSubmit, reset} = useForm();

    const onSubmit = (data)=>{
        if (data.deadline != ''){
            let newDeadline = task.deadline ==='' ? null: task.deadline;
            data = ({...data, taskId: Number(task.taskId), status: newDeadline});
            console.log('send to backend',data);
            axios.post('/api/').then(result => {
                if (result.status===200) {
                    alert('success  - update state!')
                }}).catch(error => console.log(error));
        } 
        reset();
        setUiState(prev => ({ ...prev, 
            taskDeadlineToggle: !prev.taskDeadlineToggle,
            taskDeadlineItem: 0
                }))
    }
    
        if (uiState.taskDeadlineToggle && uiState.taskDeadlineItem === task.taskId) {
        return (<>
            <form id="setDeadlineForm" onSubmit={handleSubmit(onSubmit)}>
                <input type="datetime-local" name="deadline" id="deadline" {...register('deadline')}/>
                <button type="submit">Save</button>
            
             </form>
             <p className="noDeadline" 
                        onClick={() => setUiState(prev => (
                            { ...prev, 
                                taskDeadlineToggle: !prev.taskDeadlineToggle}))}></p>
            </>)
             
        } else {
        return   ( <p className="noDeadline" 
                        onClick={() => setUiState(prev => (
                            { ...prev, 
                                taskDeadlineToggle: !prev.taskDeadlineToggle,
                                taskDeadlineItem: task.taskId
                             }
                        ))}></p>)
        }
    

}