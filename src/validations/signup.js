import * as yup from 'yup';


//define scheme
const NewuserSchema = yup.object().shape({
    name: yup.string().required(),
    password: yup.string().min(8).max(255).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    email: yup.string().email().required()
});

export default NewuserSchema;