import { useEffect, useState } from 'react';

export default function useForm(initialState = {}) {
  // Create a state object for inputs
  const [inputs, setInputs] = useState(initialState);
  const initialValues = Object.values(initialState).join('');

  // console.log('values are', initialValues);
  useEffect(() => {
    // this runs when the data changes
    setInputs(initialState);
    // console.log('set inputs');
  }, [initialValues]);

  function handleChange(event) {
    let { value, name, type } = event.target;

    if (type === 'number') {
      value = Number(value);
    }

    if (type === 'file') {
      [value] = event.target.files;
    }

    setInputs({
      // Copy existing state
      ...inputs,
      [name]: value,
    });
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  function resetForm() {
    setInputs(initialState);
  }
  return { inputs, handleChange, resetForm, clearForm };
}
