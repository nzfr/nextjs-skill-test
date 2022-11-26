export const extractIdFromURL = (url: string) => {
  const params = url.split('/');
  return params[params.length - 1];
};
