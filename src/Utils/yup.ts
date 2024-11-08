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