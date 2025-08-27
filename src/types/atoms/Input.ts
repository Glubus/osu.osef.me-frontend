export interface InputProps {
    id?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    type?: string; // pour pouvoir gérer password, email, etc.
  }