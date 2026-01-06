import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('email tidak valid')
      .required('Email harus diisi'),
    password: Yup.string()
      .min(6, 'Password harus lebih dari 6 karakter')
      .required('Password harus diisi'),
})

export const registerSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, 'Nama minimal 3 karakter')
      .required('Nama harus diisi'),
    email: Yup.string()
      .email('email tidak valid')
      .required('Email harus diisi'),
    password: Yup.string()
      .min(6, 'password minimal 6 karakter')
      .required('Password harus diisi')
})