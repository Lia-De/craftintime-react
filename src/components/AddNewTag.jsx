import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { tagListAtom } from "../atoms/tagListAtom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AddNewTag = ( ) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
        const [tagList, setTagList] = useAtom(tagListAtom);
    const [newTag, setNewTag] = useState(null);

    const onSubmit = (data) => {
        let tmp = {"name": data.name};
        setNewTag(tmp);
        reset();
    };

    useEffect(()=> {
        newTag && axios.post(`${API_BASE_URL}/Tag/addTag`, newTag)
        .then(response => {
            
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
