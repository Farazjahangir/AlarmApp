import * as yup from "yup";

type ValidationErrors = { [key: string]: string };

export const completeProfileFormSchema = yup.object({
    name: yup.string().required(),
    address: yup.string(),
});

export const createGroupSchema = yup.object({
    groupName: yup.string().required().label("Group name"),
    groupType: yup.string().required().label("Group type")
});

export const signupSchema = yup.object({
    name: yup.string().required().label("Name"),
    email: yup.string().required().email().label("Email"),
    number: yup.string().required().label('Number'),
    password: yup.string().min(6).required().label('Password')
});

export const loginSchema = yup.object({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().label('Password')
});

export const updateProfileSchema = yup.object({
    name: yup.string().required().label("Name"),
});


export const validate = async (
    schema: yup.ObjectSchema<any>,
    data: Record<string, any>
): Promise<ValidationErrors> => {
    const errors: ValidationErrors = {};

    try {
        await schema.validate(data, { abortEarly: false });
        return errors; // No errors if validation passes
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            error.inner.forEach((e) => {
                if (e.path) {
                    errors[e.path] = e.message;
                }
            });
        }
        return errors;
    }
};