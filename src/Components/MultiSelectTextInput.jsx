import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const MultiSelectTextInput = ({ id, label, values, placeholder, onChange, required }) => {
  console.log("🚀 ~ MultiSelectTextInput ~ values:", values)
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const formattedValues = values ?values?.map(value => ({ value, label: value })) : "";
    setOptions(prevOptions => {
      const existingValues = new Set(formattedValues?.map(option => option.value));
      return [...prevOptions, ...formattedValues?.filter(option => !existingValues.has(option.value))];
    });
  }, [values]);

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions?.map(option => option.value) : [];
    onChange(selectedValues);
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions(prevOptions => {
      const existingValues = new Set(prevOptions.map(option => option.value));
      if (!existingValues.has(newOption.value)) {
        return [...prevOptions, newOption];
      }
      return prevOptions;
    });
    onChange([...values, newOption.value]);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        placeholder={placeholder}
        value={options.filter(option => values?.includes(option?.value))}
      />
    </div>
  );
};

export default MultiSelectTextInput;
