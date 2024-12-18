import React from 'react';

const InputField = ({ label, type, value, onChange, required, name }) => {
    return (
        <div className="input-group">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}  
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default InputField;
