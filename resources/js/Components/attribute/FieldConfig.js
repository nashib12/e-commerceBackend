export const metaFieldsConfig = [
  {
    name: 'meta.display_label',
    label: 'Display Label',
    type: 'text',
    maxLength: 100,
  },
  {
    name: 'meta.is_variant_forming',
    label: 'Is Variant Forming?',
    type: 'checkbox',
  },
  {
    name: 'meta.is_filterable',
    label: 'Is Filterable?',
    type: 'checkbox',
  },
  {
    name: 'meta.is_required',
    label: 'Is Required?',
    type: 'checkbox',
  },
  {
    name: 'meta.filter_display_type',
    label: 'Filter Display Type',
    type: 'select',
    options: ['checkbox', 'button_group', 'color_swatch', 'range'],
  },
  {
    name: 'meta.help_text',
    label: 'Help Text',
    type: 'textarea',
    maxLength: 255,
  },
  {
    name: 'meta.help_url',
    label: 'Help URL',
    type: 'text',
    maxLength: 255,
  },
  {
    name: 'meta.sku_key',
    label: 'SKU Key',
    type: 'text',
    maxLength: 10,
  },
  {
    name: 'meta.sort_order',
    label: 'Sort Order',
    type: 'tag_input',
  },
  {
    name: 'meta.applicable_categories',
    label: 'Applicable Categories',
    type: 'tag_input', 
  },
];