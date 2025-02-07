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
}