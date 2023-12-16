import * as yup from 'yup';


//define scheme
const userSchema = yup.object().shape({
    name: yup.string().required(),
    password: yup.string().min(8).max(255).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
});

export default userSchema;