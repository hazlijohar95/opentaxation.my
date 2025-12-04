/**
 * Malaysian Tax Filing Deadlines Data
 * Source: LHDN (Lembaga Hasil Dalam Negeri Malaysia)
 */

export type EntityType = 'Individual' | 'Employer' | 'Company' | 'Partnership';

export interface TaxDeadline {
  id: string;
  formCode: string;
  entityType: EntityType;
  month: string;
  monthNumber: number;
  dueDate: string;
  description: string;
  frequency: string;
  notes?: string;
}

export const taxDeadlines: TaxDeadline[] = [
  {
    id: 'cp204',
    formCode: 'CP204',
    entityType: 'Company',
    month: 'January',
    monthNumber: 1,
    dueDate: '30 days before financial year begins',
    description: 'Submission of estimated tax payable for the upcoming year',
    frequency: 'Annual',
    notes: 'Must be submitted before FY starts',
  },
  {
    id: 'form-e',
    formCode: 'Form E',
    entityType: 'Employer',
    month: 'March',
    monthNumber: 3,
    dueDate: '31 March',
    description: "Employer's annual return of all remuneration paid to staff",
    frequency: 'Annual',
  },
  {
    id: 'cp58',
    formCode: 'CP58',
    entityType: 'Employer',
    month: 'March',
    monthNumber: 3,
    dueDate: '31 March',
    description: 'Statement to agents/distributors receiving commission',
    frequency: 'Annual',
    notes: 'For commissions exceeding RM 5,000',
  },
  {
    id: 'form-be',
    formCode: 'Form BE',
    entityType: 'Individual',
    month: 'April',
    monthNumber: 4,
    dueDate: '30 April',
    description: 'Annual income tax return for individuals without business income',
    frequency: 'Annual',
    notes: 'For resident individuals',
  },
  {
    id: 'form-b',
    formCode: 'Form B',
    entityType: 'Individual',
    month: 'June',
    monthNumber: 6,
    dueDate: '30 June',
    description: 'Annual income tax return for individuals with business income',
    frequency: 'Annual',
    notes: 'For resident individuals with business income',
  },
  {
    id: 'form-p',
    formCode: 'Form P',
    entityType: 'Partnership',
    month: 'June',
    monthNumber: 6,
    dueDate: '30 June',
    description: 'Declaration of partnership income',
    frequency: 'Annual',
  },
  {
    id: 'cp204a',
    formCode: 'CP204A',
    entityType: 'Company',
    month: 'June',
    monthNumber: 6,
    dueDate: '6th or 9th month of basis period',
    description: 'Revision of estimated tax payable',
    frequency: 'Bi-annual',
    notes: 'Submit at 6th and 9th month of financial year',
  },
  {
    id: 'form-c',
    formCode: 'Form C',
    entityType: 'Company',
    month: 'December',
    monthNumber: 12,
    dueDate: '7 months after financial year end',
    description: 'Corporate tax return submission',
    frequency: 'Annual',
    notes: 'For both resident and non-resident companies',
  },
];

export const entityTypeInfo: Record<
  EntityType,
  { label: string; description: string; forms: string[] }
> = {
  Individual: {
    label: 'Individual',
    description: 'Personal income tax filing',
    forms: ['Form BE', 'Form B'],
  },
  Company: {
    label: 'Company (Sdn Bhd)',
    description: 'Corporate tax returns',
    forms: ['Form C', 'CP204', 'CP204A'],
  },
  Employer: {
    label: 'Employer',
    description: 'Employee declaration forms',
    forms: ['Form E', 'CP58'],
  },
  Partnership: {
    label: 'Partnership',
    description: 'Partnership tax filing',
    forms: ['Form P'],
  },
};

export function getDeadlinesByEntity(entityType: EntityType): TaxDeadline[] {
  return taxDeadlines.filter((d) => d.entityType === entityType);
}

export function getDeadlinesByMonth(month: number): TaxDeadline[] {
  return taxDeadlines.filter((d) => d.monthNumber === month);
}

export function getAllDeadlinesSorted(): TaxDeadline[] {
  return [...taxDeadlines].sort((a, b) => a.monthNumber - b.monthNumber);
}
