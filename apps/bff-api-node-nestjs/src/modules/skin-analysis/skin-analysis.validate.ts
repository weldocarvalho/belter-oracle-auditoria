// import { z } from 'zod';

// // Schema que dita as regras do que PODE e NÃO PODE entrar na API
// export const SkinWizardSchema = z.object({
//   userId: z.string({ required_error: 'O userId é obrigatório.' }).min(3),
//   skinType: z.enum(['oleosa', 'seca', 'mista', 'normal'], {
//     error_map: () => ({ message: 'Tipo de pele inválido. Escolha: oleosa, seca, mista ou normal.' })
//   }),
//   celluliteStage: z.enum(['grau-1', 'grau-2', 'grau-3', 'grau-4'], {
//     error_map: () => ({ message: 'Grau de celulite inválido.' })
//   }),
//   habitsDescription: z.string().min(10, { message: 'Descreva seus hábitos com pelo menos 10 caracteres.' }),
// });
