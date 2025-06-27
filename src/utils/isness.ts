const is = {
  array: (variable: any): boolean => Array.isArray(variable),
  string: (variable: any): boolean => typeof variable === 'string',
  number: (variable: any): boolean => typeof variable === 'number' || !isNaN(variable),
  boolean: (variable: any): boolean => ['true', true, 'false', false].includes(variable),
  truly: (variable: any): boolean => Boolean(['true', true].includes(variable)),
  falsely: (variables: any): boolean => Boolean(['false', false, 0, '0'].includes(variables)),
  int: (variable: any): boolean => typeof variable === 'number' && Number.isInteger(variable),
}

export { is }