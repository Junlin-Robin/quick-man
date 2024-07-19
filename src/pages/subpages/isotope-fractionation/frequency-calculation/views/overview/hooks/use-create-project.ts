import {useState} from 'react';

export default function useCreateProject(formValue, id) {
    if(!window.localStorage) return 
    const [loading, setLoading] = useState(false);

    const {} = formValue || {};


    
}