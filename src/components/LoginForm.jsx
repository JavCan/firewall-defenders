import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import '../styles/variables.css';
import aulifyLogo from '../assets/aulify.png';

// Modificar el esquema para hacer la contraseña opcional
const schema = yup.object().shape({
  identifier: yup.string().required('Correo electrónico o Usuario es requerido'),
});

const FormContainer = styled(motion.div)`
  font-family: var(--font-body);
  background: rgba(255, 255, 255, 0.3); // More transparent
  border-radius: var(--border-radius-lg);
  border: .5px solid rgba(255, 255, 255, 0.5);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 600px; // Reduced from 800px
  max-height: 90vh; /* Ensure form doesn't exceed viewport height */
  overflow: auto; /* Allow scrolling within form if needed */
  margin: 0 auto; /* Changed from margin: 2rem auto */
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  position: relative;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const Logo = styled.div`
  text-align: left;
  img {
    max-width: 130px;
    height: auto;
    object-fit: contain;
  }
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
`; // Fixed missing backtick and extra closing brace

const FormSection = styled.div`
  background:rgb(249, 182, 13);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  border: .5px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  h2 {
    font-family: ../assets/Font/Montserrat-SemiBold.ttf;
    color: #1E1E3F;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: 600;
    text-align: left;
  }

  label {
    font-family: ../assets/Font/Montserrat-Regular.ttf;
    display: block;
    color: #1E1E3F;
    margin-bottom: var(--spacing-xs);
    margin-top: var(--spacing-xs);
    font-size: 1rem;
    text-align: left;
    padding: 0.3rem 0;
  }
`;

// Update the SmallText component to be used inside the form
const SmallText = styled.div`
  font-family: ../assets/Font/Montserrat-Light.ttf;
  color: #1E1E3F;
  font-size: 1rem;
  font-weight: 100;
  margin-bottom: 1.5rem;
  opacity: 0.8;
  text-align: left;

  a {
    color: #D44D56;
    margin-left: var(--spacing-xs);
    text-decoration: none;
    font-weight: 400;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Input = styled.input`
  font-family: var(--font-body);
  width: 100%;
  padding: var(--spacing-md);
  margin: .1rem 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-sm);
  background: white;
  color: #1E1E3F;
  font-family: var(--font-family);

  &::placeholder {
    color: #D44D56;
    opacity: 0.8;
  }
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(2, 190, 239, 0.5);
    box-shadow: 0 2px 8px rgba(2, 190, 239, 0.1);
  }

  &:focus {
    border-color: #02BEEF;
    box-shadow: 0 2px 12px rgba(2, 190, 239, 0.2);
    outline: none;
  }
`;

// Update the ErrorMessage component to be a popup
const ErrorMessage = styled.span`
  font-family: var(--font-body);
  color: #ff0000;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
  text-align: left;
  
  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    font-weight: bold;
  }
`;

// Add a wrapper for inputs to position error messages properly
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

// Add this new styled component for the button
const Button = styled.button`
  background: #1E1E3F;
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 120px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background: #2a2a57;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Add this new styled component for text outside the form
const OutsideText = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 300;
  margin-top: 1.5rem;
  text-align: center;
  grid-column: 1 / -1;
  
  a {
    color: #FFB800;
    margin-left: var(--spacing-xs);
    text-decoration: none;
    font-weight: 400;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Update the LoginForm component to accept onLogin prop (or manage state internally)
// Remove the export default from here if you keep the one at the end,
// OR remove the one at the end and keep this one. Let's keep this one.
export default function LoginForm({ onLogin }) { // Removed isLoading and error from props for now, will manage internally
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      identifier: '',
      password: '' // Clear default password for production
    }
  });

  // Add local state for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modify onSubmit to be async and perform the fetch call
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    console.log("Form data submitted:", data);

    try {
      const response = await fetch('/api/login', { // Ensure this is your correct backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send identifier as email, adjust if backend expects 'identifier'
        body: JSON.stringify({ email: data.identifier, password: data.password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Credenciales inválidas. Inténtalo de nuevo.');
      }

      // Handle successful login
      console.log('Inicio de sesión exitoso:', responseData);
      if (onLogin) {
        onLogin(responseData); // Pass response data (like token) to parent if needed
      }
      // Example: Redirect or save token
      // localStorage.setItem('token', responseData.token);
      // window.location.href = '/dashboard';

    } catch (err) {
      console.error('Error en onSubmit:', err);
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Logo>
        <img src={aulifyLogo} alt="Aulify Logo" />
      </Logo>

      <FormSection>
        <h2>Inicia sesión</h2>
        <SmallText>
          ¿No eres usuario de Aulify?<a href="#">Únete→</a>
        </SmallText>

        {/* Display the local error state */}
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Correo electrónico o Usuario</label>
          <Input
            {...register('identifier')}
            placeholder="Escribe tu correo o Usuario..."
            type="text"
            disabled={isLoading} // Disable input while loading
          />
          {errors.identifier && (
            <ErrorMessage>{errors.identifier.message}</ErrorMessage>
          )}

          <label>Contraseña</label>
          <Input
            {...register('password')}
            placeholder="Escribe tu contraseña..."
            type="password"
            disabled={isLoading} // Disable input while loading
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          {/* Use local isLoading state for the button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Enter →'}
          </Button>
        </form>
      </FormSection>
    </FormContainer>
  );
}

