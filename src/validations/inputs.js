import * as yup from 'yup';


//define scheme
const money = yup.object().shape({
    income: yup.number().positive().required().moreThan(yup.ref('sum')),
    bills: yup.number().min(0).required(),
    savings: yup.number().min(0).required(),
    sum: yup.number().min(0)
});

export default money;