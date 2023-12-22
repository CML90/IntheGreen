import * as yup from 'yup';


//define scheme
const transactionSchema = yup.object().shape({
    value: yup.number().positive().required(),
});

export default transactionSchema;