import type { ReactNode, CSSProperties } from 'react';

interface FormRowProps {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}


const FormRow = ({ children, gap = 8, style }: FormRowProps) => (
  <div style={{ display: 'flex', gap, ...style }}>
    {children}
  </div>
);

export default FormRow;
