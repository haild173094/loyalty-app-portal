export const discountSettings = [
  {
    type: 'TextField',
    name: 'name',
    label: 'Discount name: ',
    placeholder: 'Discount name',
    defaultValue: '',
  },
  {
    type: 'TextField',
    name: 'description',
    label: 'Description: ',
    placeholder: 'Description',
    defaultValue: '',
  },
  {
    type: 'Select',
    label: 'Discount type: ',
    name: 'type',
    props: {
      options: [
        { value: 'amount', label: 'Amount' },
        { value: 'percentage', label: 'Percentage' },
      ],
    },
  },
  {
    type: 'TextField',
    name: 'amount',
    label: 'Amount: ',
    props: {
      type: 'number',
    },
    defaultValue: 0,
  },
  {
    type: 'TextField',
    name: 'time_limit',
    label: 'Time limit: ',
    props: {
      type: 'number',
      suffix: 'days',
    },
    defaultValue: 1,
  },
  {
    type: 'TextField',
    name: 'loyalty_price',
    label: 'Loyalty price: ',
    props: {
      type: 'number',
    },
    defaultValue: 0,
  },
];
