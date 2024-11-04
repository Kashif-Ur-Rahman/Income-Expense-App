import  { FC } from 'react';

// Define the prop types using an interface
interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset'; // Button types can be 'button', 'submit', or 'reset'
  className?: string;
}

const Button: FC<ButtonProps> = ({ text, onClick, type = 'button', className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
