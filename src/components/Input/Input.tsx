// components/Input/Input.tsx
import React from "react";
import "./Input.css";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="form-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
