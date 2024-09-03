import React from 'react';
import Select from 'react-select';

const getBackgroundColor = (value) => {
    switch (value) {
        case 'Basic':
            case 1:
        case 'Pending':
            return '#FFC107';
        case 'Top Rated':
            case 2:
        case 'Approved':
            return '#28A745';
        case 'Rejected':
            return '#DC3545';
        default:
            return '#f0f0f0';
    }
};

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: '20px',
        backgroundColor: getBackgroundColor(state?.selectProps?.value?.value),
        padding: '5px',
        cursor: state.isDisabled ? 'not-allowed' : 'default',
        boxShadow: 'none',
        border: '1px solid #ccc',
        '&:hover': {
            border: state.isDisabled ? '1px solid #ccc' : '1px solid #007bff',
        },
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        display: 'none',
    }),
    option: (provided, state) => ({
        ...provided,
        borderRadius: '20px',
        backgroundColor: state.isSelected ? '#007bff' : '#fff',
        color: state.isSelected ? '#fff' : '#000',
    }),
    singleValue: (provided, state) => ({
        ...provided,
        borderRadius: '20px',
        backgroundColor: getBackgroundColor(state?.selectProps?.value?.value),
        color: '#fff',
        padding: '5px 10px',
    }),
};

const StyledSelect = ({ options, value, onChange, isDisabled, label }) => {
    const selectedOption = options.find(option => option.value === (value?.value || value));

    if (isDisabled) {
        return (
            selectedOption && (
               <div className='flex flex-col'>
            <label className="text-sm font-medium mb-1">{label}</label>

                 <div
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    style={{
                        backgroundColor: getBackgroundColor(selectedOption?.value),
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        width: '100%',
                    }}
                >
                    {selectedOption?.label}
                </div>
               </div>
            )
        );
    }

    return (
        <div className='flex flex-col'>
            <label className="text-sm font-medium mb-1">{label}</label>
            <Select
                className="w-40"
                styles={customStyles}
                options={options}
                value={selectedOption}
                onChange={onChange}
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default StyledSelect;
