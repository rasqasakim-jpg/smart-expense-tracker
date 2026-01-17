import * as Yup from 'yup';

// Reusable validation rules
export const emailRule = Yup.string()
  .email('Email tidak valid')
  .required('Email harus diisi');

export const passwordRule = Yup.string()
  .min(6, 'Password minimal 6 karakter')
  .required('Password harus diisi');

export const nameRule = Yup.string()
  .min(3, 'Minimal 3 karakter')
  .required('Wajib diisi');

export const amountRule = Yup.number()
  .min(1, 'Jumlah harus lebih dari 0')
  .required('Jumlah harus diisi')
  .typeError('Jumlah harus berupa angka');

// Schemas
export const loginSchema = Yup.object().shape({
  email: emailRule,
  password: passwordRule,
});

export const registerSchema = Yup.object().shape({
  fullName: nameRule,
  email: emailRule,
  password: passwordRule,
});

export const walletSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nama wallet minimal 2 karakter')
    .required('Nama wallet harus diisi'),
  type: Yup.string()
    .required('Tipe wallet harus dipilih'),
});

export const transactionSchema = Yup.object().shape({
  amount: amountRule,
  name: Yup.string()
    .min(3, 'Nama transaksi minimal 3 karakter')
    .required('Nama transaksi harus diisi'),
  categoryId: Yup.number()
    .min(1, 'Pilih kategori')
    .required('Kategori harus dipilih'),
  walletId: Yup.string()
    .required('Wallet harus dipilih'),
  transactionDate: Yup.string()
    .required('Tanggal harus dipilih'),
  note: Yup.string(),
});

export const categorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .required('Nama kategori harus diisi'),
  type: Yup.string()
    .required('Tipe kategori harus dipilih'),
});