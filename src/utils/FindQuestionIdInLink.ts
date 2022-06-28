export default (
  text: string
): number => {
  return +text.match(/(?<=task\/)\d+/);
};