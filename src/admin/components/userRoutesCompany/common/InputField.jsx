import React from "react";

const InputField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  label,
  id,
  optional = false,
}) => {
  return (
    <div className="input-field">
      <label htmlFor={id} className="m-0">
        {label}{" "}
        {optional && <small className="text-secondary">(Optional)</small>}
      </label>
      <br />
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={value.length > 0 ? "admin_supervisor_selected_them" : ""}
      />
      <br />
      {error && (
        <em
          className="error ml-3 position-absolute"
          style={{ bottom: "-23px" }}
        >
          {error}
        </em>
      )}
    </div>
  );
};

export default InputField;
