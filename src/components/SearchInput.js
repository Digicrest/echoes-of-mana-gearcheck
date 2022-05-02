import { Search } from '@mui/icons-material';
import { Input } from '@mui/material';
import React from 'react'
import '../stylesheets/SearchInput.css';

export default function SearchInput({ onChange }) {
  return (
    <Input onChange={onChange} startAdornment={<Search />} className="search" />
  )
}