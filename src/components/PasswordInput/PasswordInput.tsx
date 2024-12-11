// components/PasswordInput/PasswordInput.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordInput.css";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-group password-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          className="form-input password-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        <span
          className="password-toggle-icon"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;
