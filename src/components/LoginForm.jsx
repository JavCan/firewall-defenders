// Add this import at the top with other imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import '../styles/variables.css';
import aulifyLogo from '../assets/aulify.png';

const schema = yup.object().shape({
  identifier: yup.string().required('Correo electrónico o Usuario es requerido'),
  password: yup.string().required('Contraseña es requerida'),
});

const FormContainer = styled(motion.div)`
  background: rgba(30, 30, 63, 0.85); // More transparent
  border-radius: var(--border-radius-lg);
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
    max-width: 200px;
    height: auto;
    object-fit: contain;
  }
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
`; // Fixed missing backtick and extra closing brace

const FormSection = styled.div`
  background: #FFB800;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  
  h2 {
    color: #1E1E3F;
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
    font-weight: bold;
  }
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  margin: var(--spacing-xs) 0;
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

const GuestGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
`;

const SmallText = styled.div`
  color: #1E1E3F;
  font-size: 0.8rem;
  margin-top: var(--spacing-md);
  opacity: 0.8;
`;

const ErrorMessage = styled.span`
  color: #ff0000;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
  display: block;
`;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormContainer>
      <Logo>
        <img src={aulifyLogo} alt="Aulify Logo" />
      </Logo>
      
      <FormSection>
        <h2>Inicia sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('identifier')}
            placeholder="Correo electrónico o Usuario"
            type="text"
          />
          <Input
            {...register('password')}
            placeholder="Contraseña"
            type="password"
          />
          <SmallText>
            ¿No eres usuario de Aulify? <a href="#">Únete</a>
          </SmallText>
        </form>
      </FormSection>
    </FormContainer>
  );
}