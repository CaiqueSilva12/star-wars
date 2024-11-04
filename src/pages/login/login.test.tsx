import { test, expect, beforeEach } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Login from './login';
import '@testing-library/jest-dom/vitest';
import store from '../../redux/store';
import { vi } from 'vitest';

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  });

  test('1 - deve renderizar o título "Star Wars"', () => {
    const title = screen.getByText(/Star Wars/i);
    expect(title).toBeInTheDocument();
  });

  test('2 - deve exibir mensagem de boas-vindas ao Iniciar Jornada o nome', async () => {
    const nameInput = screen.getByPlaceholderText('Digite seu nome');
    const submitButton = screen.getByRole('button', { name: /Iniciar Jornada/i });

    fireEvent.change(nameInput, { target: { value: 'Luke Skywalker' } });
    fireEvent.click(submitButton);

    const welcomeMessage = await screen.findByText(/bem-vindo, luke skywalker!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});
