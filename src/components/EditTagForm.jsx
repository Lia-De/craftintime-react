import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { tagAtom } from "../atoms/tagAtom";
import axios from "axios";
import { tagListAtom } from "../atoms/tagListAtom";

export const EditTagForm = ({editTag, setShowEdit}) => {
    const {register, handleSubmit, formState:{errors}} = useForm();
    const [tag, setTag] = useAtom(tagAtom);
    const [tagList, setTagList] = useAtom(tagListAtom);

    const onSubmit = (data) =>{
        data = {...data, tagId: tag.tagId};
        axios.post('/api/Tag/updateTag', data)
        .then((response)=> {
            if (response.status===200){
                setTag(prev => ({...prev, name:data.name}));
                setTagList(prev=>prev.map(t => 
                    t.tagId === tag.tagId ? response.data : t));
        }
        }).catch(error=>console.log(error));
        setShowEdit(false);
    }

    return (<form id="editTagForm" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name:</label>
        <input type="text"  id="name" defaultValue={editTag.name}
            aria-label="Add a tag with at least 3 characters"
            {...register("name", { required: true, 
                minLength: { value: 3, message: "Must be at least 3 characters" } })} />
                {errors.name && <p className="errorMessage">Name must be at least 3 characters</p>}
        <button type="submit">Save</button>
    </form>)
}