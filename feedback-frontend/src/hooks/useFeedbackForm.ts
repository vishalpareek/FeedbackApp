import { useReducer, useCallback, useRef } from 'react';

export interface FormData {
    name: string;
    email: string;
    message: string;
}

export interface ModalData {
    id: number;
    name: string;
    message: string;
}

interface State {
    formData: FormData;
    modalData: ModalData;
    errors: Partial<FormData>;
    showModal: boolean;
    modalType: 'success' | 'error';
    modalMessage: string;
}

type Action =
    | { type: 'UPDATE_FIELD'; field: keyof FormData; value: string }
    | { type: 'SET_ERRORS'; errors: Partial<FormData> }
    | { type: 'VALIDATION_ERROR'; message: string; errors: Partial<FormData> }
    | { type: 'SUBMIT_SUCCESS'; payload: ModalData }
    | { type: 'SUBMIT_ERROR'; message: string }
    | { type: 'CLOSE_MODAL' };

const initialState: State = {
    formData: { name: '', email: '', message: '' },
    modalData: { id: 0, name: '', message: '' },
    errors: {},
    showModal: false,
    modalType: 'success',
    modalMessage: '',
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                formData: { ...state.formData, [action.field]: action.value },
            };
        case 'SET_ERRORS':
            return { ...state, errors: action.errors };
        case 'VALIDATION_ERROR':
            return {
                ...state,
                errors: action.errors,
                showModal: true,
                modalType: 'error',
                modalMessage: action.message,
            };
        case 'SUBMIT_SUCCESS':
            return {
                ...state,
                formData: { name: '', email: '', message: '' },
                modalData: action.payload,
                errors: {},
                showModal: true,
                modalType: 'success',
                modalMessage: 'Feedback submitted successfully!',
            };
        case 'SUBMIT_ERROR':
            return {
                ...state,
                showModal: true,
                modalType: 'error',
                modalMessage: action.message,
            };
        case 'CLOSE_MODAL':
            return { ...state, showModal: false };
        default:
            return state;
    }
}

export function useFeedbackForm() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    const validate = useCallback(() => {
        const { name, email, message } = state.formData;
        const newErrors: Partial<FormData> = {};

        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!email.trim()) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';
        if (!message.trim()) newErrors.message = 'Message is required.';

        return newErrors;
    }, [state.formData]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            dispatch({
                type: 'UPDATE_FIELD',
                field: e.target.name as keyof FormData,
                value: e.target.value,
            });
        },
        []
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            const validationErrors = validate();

            if (Object.keys(validationErrors).length > 0) {
                dispatch({
                    type: 'VALIDATION_ERROR',
                    message: 'Please fix the highlighted errors and try again.',
                    errors: validationErrors,
                });
                return;
            }

            try {
                const res = await fetch('http://localhost:8080/api/feedbacks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.formData),
                });

                if (!res.ok) throw new Error('Network response was not ok');
                const data: ModalData = await res.json();
                dispatch({ type: 'SUBMIT_SUCCESS', payload: data });
                firstFieldRef.current?.focus();
            } catch {
                dispatch({
                    type: 'SUBMIT_ERROR',
                    message: 'Something went wrong. Please try again later.',
                });
            }
        },
        [validate, state.formData]
    );

    const handleClose = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), []);

    return {
        ...state,
        firstFieldRef,
        handleChange,
        handleSubmit,
        handleClose,
    };
}
