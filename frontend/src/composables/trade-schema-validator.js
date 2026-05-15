import { computed } from 'vue';
import * as yup from 'yup';

export default function useTradeSchemaValidator() {
  const tradeSchemaValidator = () => {
    return yup.object({
      quantity: yup
      .number()
      .required('Quantity is required')
        .typeError('Quantity must be a number')
        .integer('Quantity must be a whole number')
        .positive('Quantity must be greater than 0')
        .max(99, 'You can buy maximum 99 stocks at a time')
        .label('Quantity'),
    });
  };

  const tradeSchema = computed(() => {
    return tradeSchemaValidator();
  });

  return {
    tradeSchema,
  };
}