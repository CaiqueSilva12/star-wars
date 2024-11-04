// PeopleTable.test.tsx
import { expect, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import PeopleTable from './PeopleTable';
import { axiosInstance } from "../../../../utils/apiRequest";

vi.mock('../../../../utils/apiRequest', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

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

describe('PeopleTable Component', () => {
  beforeEach(() => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            gender: 'male',
            url: 'https://swapi.dev/api/people/1/',
          },
          {
            name: 'Darth Vader',
            height: '202',
            mass: '136',
            hair_color: 'none',
            skin_color: 'white',
            gender: 'male',
            url: 'https://swapi.dev/api/people/4/',
          },
        ],
      },
    });
  });

  it('1 - deve renderizar a tabela com as colunas corretas', async () => {
    render(<PeopleTable />);

    await waitFor(() => {
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Altura')).toBeInTheDocument();
      expect(screen.getByText('Peso')).toBeInTheDocument();
      expect(screen.getByText('Cor do Cabelo')).toBeInTheDocument();
      expect(screen.getByText('Cor da Pele')).toBeInTheDocument();
      expect(screen.getByText('Gênero')).toBeInTheDocument();
      expect(screen.getByText('Mais Informações')).toBeInTheDocument();
    });

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Darth Vader')).toBeInTheDocument();
  });
});
