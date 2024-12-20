import React from 'react';
import { Input } from 'antd';

interface SearchInputProps {
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  return (
    <Input.Search
      placeholder="Buscar por nome"
      onSearch={onSearch}
      enterButton
      style={{ marginBottom: 20, marginTop: 20, width: 400 }}
    />
  );
};

export default SearchInput;
