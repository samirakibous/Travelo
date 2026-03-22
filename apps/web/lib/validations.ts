import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('Email requis'),
  password: Yup.string()
    .required('Mot de passe requis'),
});

export const registerSchema = Yup.object({
  fullName: Yup.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .matches(/\S+\s+\S+/, 'Veuillez entrer un prénom et un nom')
    .required('Nom complet requis'),
  email: Yup.string()
    .email('Adresse email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(8, 'Au moins 8 caractères')
    .matches(/[A-Z]/, 'Au moins une majuscule')
    .matches(/[0-9]/, 'Au moins un chiffre')
    .matches(/[^A-Za-z0-9]/, 'Au moins un caractère spécial')
    .required('Mot de passe requis'),
  agreed: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions'),
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;
export type RegisterFormValues = Yup.InferType<typeof registerSchema>;
