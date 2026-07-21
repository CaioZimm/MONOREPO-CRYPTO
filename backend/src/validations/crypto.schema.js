const { z } = require('zod');

const conversionSchema = z.object({
  cryptoName: z.string().min(1, 'A criptomoeda é obrigatória'),
  amount: z.number().positive('A quantidade deve ser maior que zero'),
});

const favoriteSchema = z.object({
  cryptoName: z.string().min(1, 'A criptomoeda é obrigatória'),
});

module.exports = { conversionSchema, favoriteSchema };
