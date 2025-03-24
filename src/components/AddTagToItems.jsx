import { useEffect } from "react";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form"
import { projectAtom } from "../atoms/projectAtom";
import { taskAtom } from "../atoms/taskAtom";
import axios from "axios";


function formatTagArray(taglist){
    return taglist.split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}
export const AddTagToProject = () => {
    const [project, setProject] = useAtom(projectAtom);
    const {register, handleSubmit, reset, formState:{errors}} = useForm();

    const onSubmit = async (data) => {
        let tagArray = formatTagArray(data.tags);

        await axios.post(`/api/Project/addTagsToProject/${project.projectId}`, 
                    tagArray,
                    {headers: {"Content-Type": "application/json",}}
            )
            .then(result => {
                    let updatedTags = result.data;
                    setProject((prev) => ({
                        ...prev,
                        tags: updatedTags // Replace existing tags with the new ones from API
                    }));
                    reset();
            }).catch(error => { console.log(error) } )
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <button>Add Tags</button>
            <input type="text" 
                placeholder="Add tag" 
                aria-label="Type in a comma separated list of tags, to add to the project" 
                id="projectTagCloud" 
                name="projectTagCloud" {...register('tags', {required:true, minLength: 3 })}/>
        </form>
        {errors.tags && <span>Minimum 3 letters</span>}
        </>
        )
}

export const AddTagToTask = ({taskToEdit}) => {
    const [project, setProject] = useAtom(projectAtom);
    const [task, setTask] = useAtom(taskAtom);
    const {register, handleSubmit, reset, formState:{errors}} = useForm();

    const onSubmit = (data)=> {
        let tagArray = formatTagArray(data.tags);
        axios.post(`/api/Task/addTagsToTask/${taskToEdit}`, 
            tagArray,
            {headers: {"Content-Type": "application/json",}}
        )
        .then(result => {
                let updatedTags = result.data;
                let tmp = project.tasks.find(t=>t.taskId == taskToEdit);
                tmp.tags = updatedTags;
                setTask(tmp);
            })
        .catch(e=>console.log(e))
        reset();
    }

    // useEffect to monitor task state changes
    useEffect(() => {
        if (task) { // task is updated
            setProject((prev) => ({
                ...prev, 
                tasks: prev.tasks.map(t => 
                    t.taskId === task.taskId 
                    ? { ...t, tags: task.tags }  // Update only the changed task's tags
                    : t
                )
            }));
            setTask(null);
        }
    }, [task]); // Only run this effect when task changes

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
        <button>Add Tags</button>
        <input type="text" 
            placeholder="Add tag" 
            aria-label="Type in a comma separated list of tags, to add to the task" 
            {...register('tags', {required: true, minLength:3})} />
        </form>
        {errors.tags && <span>Minimum 3 letters</span>}
        </>)
}