import readline from 'readline';

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const getInput = (input) => {
  return new Promise((resolve) => {
    readLine.question(input, resolve);
  });
};

export const closeInput = () => {
  readLine.close();
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
}
