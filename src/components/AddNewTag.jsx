import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { tagListAtom } from "../atoms/tagListAtom";
import { tagAtom } from "../atoms/tagAtom";
import axios from "axios";


export const AddNewTag = ( ) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
        const [tagList, setTagList] = useAtom(tagListAtom);
    const [newTag, setNewTag] = useState(null);

    const onSubmit = (data) => {
        console.log(data);
        let tmp = {"name": data.name};
        console.log(tmp)
        setNewTag(tmp);
        reset();
    };

    useEffect(()=> {
        newTag && axios.post('/api/Tag/addTag', newTag)
        .then(response => {
            console.log(response.data);
            setTagList(prev =>( [...prev, response.data] ));
        }).catch(e => console.log(e));


    },[newTag]);

    return (
        <> 
            <h4>Add tag</h4>
            <form id="addTag" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="newName">Name:</label>
                <input type="text"  id="newName"
                    placeholder={errors.name ? 'Tags must have at least 3 characters' : ''}
                    aria-label="Add a tag with at least 3 characters"
                    {...register("name", { required: "Tag name is required", 
                        minLength: { value: 3, message: "Must be at least 3 characters" } })} />
                <button type="submit">Add</button>
            </form>
        </>
    );
};
