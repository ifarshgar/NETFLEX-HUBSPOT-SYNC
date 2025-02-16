export const flattenObject = (obj: object, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const propName = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], propName));
    } else {
      acc[propName] = obj[key];
    }
    return acc;
  }, {});
};

export const convertJSONToCSV = async (data: object[]): Promise<string> => {
  if (!data.length) {
    return '';
  }

  const flatArray = data.map((obj) => flattenObject(obj));

  // Get unique headers
  const headers = [...new Set(flatArray.flatMap((obj) => Object.keys(obj)))];

  // Convert to CSV format
  const csvRows = [
    headers.join(','),
    ...flatArray.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
  ];

  return csvRows.join('\n');
};

export const unflattenObject = (data: string): object => {
  const result: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const keys = key.split('.');
    keys.reduce((acc, part, index) => {
      if (index === keys.length - 1) {
        acc[part] = data[key];
      } else {
        if (typeof acc[part] !== 'object' || acc[part] === null) {
          acc[part] = {}; // Ensure it's an object, not a string or array
        }
      }
      return acc[part];
    }, result);
  });

  return result;
};

export const convertCSVToJSON = async (csvData: string[]): Promise<object[]> => {
  return csvData.map((row: string) => unflattenObject(row));
};
