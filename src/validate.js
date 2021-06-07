import * as yup from 'yup';

export default (url) => {
  const schema = yup.object().shape({
    url: yup.string().url(),
  });
  try {
    console.log(url);
    schema.validateSync(url, { abortEarly: false });
    return '';
  } catch (validationErrors) {
    return validationErrors.message;
  }
};
