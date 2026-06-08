import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

const baseStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg3)', border: '1px solid var(--borda)',
  borderRadius: 8, color: 'var(--txt)', fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'var(--txt3)',
  display: 'block', marginBottom: 4,
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

type SelectFieldProps = BaseProps
  & SelectHTMLAttributes<HTMLSelectElement>
  & { as: 'select'; children: ReactNode };

type FormFieldProps = InputFieldProps | SelectFieldProps;


const isSelect = (props: FormFieldProps): props is SelectFieldProps =>
  'as' in props && props.as === 'select';


const FormField = (props: FormFieldProps) => {
  if (isSelect(props)) {
    const { label, error, hint, as: _, children, ...rest } = props;
    return (
      <div>
        <label style={labelStyle}>{label}</label>
        <select style={baseStyle} {...rest}>{children}</select>
        {hint  && !error && <p style={{ fontSize: 10, color: 'var(--txt3)',    marginTop: 3 }}>{hint}</p>}
        {error &&           <p style={{ fontSize: 10, color: 'var(--vermelho)', marginTop: 3 }}>{error}</p>}
      </div>
    );
  }

  const { label, error, hint, ...rest } = props as InputFieldProps;
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={baseStyle} {...rest} />
      {hint  && !error && <p style={{ fontSize: 10, color: 'var(--txt3)',    marginTop: 3 }}>{hint}</p>}
      {error &&           <p style={{ fontSize: 10, color: 'var(--vermelho)', marginTop: 3 }}>{error}</p>}
    </div>
  );
};

export default FormField;
