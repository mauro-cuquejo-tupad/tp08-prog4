import { useState, type ChangeEvent } from "react";

export function useForm<T extends Record<string, unknown>>(initialState: T) {
    const [formState, setFormState] = useState<T>(initialState);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const resetForm = (newState?: T) => {
        setFormState(newState ?? initialState);
    };

    return {
        ...formState,
        formState,
        handleChange,
        resetForm,
        setFormState,
    };
}