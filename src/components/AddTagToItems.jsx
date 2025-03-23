import { useAtom } from "jotai";
import { useForm } from "react-hook-form"
import { projectAtom } from "../atoms/projectAtom";
import axios from "axios";
import CraftInTimeAPI from "../backendconfig";


export const AddTagToProject = () => {
    const [project, setProject] = useAtom(projectAtom);
    const {register, handleSubmit, reset} = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        let tagArray = data.tags.split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '');
        console.log(tagArray);
        console.log(project.projectId);
        await axios.post(`${CraftInTimeAPI}/Project/addTagsToProject/${project.projectId}`, 
                    tagArray,
                    {headers: {"Content-Type": "application/json",}}
                )
                .then(result => {
                        console.log(result.data);
                        let updatedTags = result.data;
                        setProject((prev) => ({
                            ...prev,
                            tags: updatedTags // Replace existing tags with the new ones from API
                        }));
                
                        reset();
                    
                }).catch((error) => {console.log(error)})

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <button>Add Tags</button>
            <input type="text" 
                placeholder="Add tag" 
                aria-label="Type in a comma separated list of tags, to add to a project" 
                id="projectTagCloud" 
                name="projectTagCloud" {...register('tags')}/>
        </form>
        )
}

export const AddTagToTask = () => {
    return (<div>Here we are then - task edition</div>)
}