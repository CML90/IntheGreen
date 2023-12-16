import * as yup from 'yup';


//define scheme
const money = yup.object().shape({
    income: yup.number().positive().required().moreThan(yup.ref('sum')),
    bills: yup.number().positive().required(),
    savings: yup.number().positive().required(),
    sum: yup.number().positive()
});

export default money;