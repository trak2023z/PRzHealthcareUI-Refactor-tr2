import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  login: yup.string().required(),
  password: yup.string().required()
});
