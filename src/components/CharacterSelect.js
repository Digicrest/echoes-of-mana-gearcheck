import { Search } from '@mui/icons-material';
import { Button, Input } from '@mui/material';
import React, { Fragment } from 'react';
import '../stylesheets/CharacterSelect.css';
import SearchInput from './SearchInput';

export default function CharacterSelect({ characters, onCharacterSelected, onSearchTermChanged, character }) {
    return (
        <div className="character-select-container">
            <div className='character-search'>
                <SearchInput onChange={onSearchTermChanged} />
            </div>
            <div className="character-select">
                {characters.map((c, i) => {
                    return (
                        <div key={i} className={`character-selection ${character === c ? 'active' : ''}`} onClick={() => onCharacterSelected(c)}>
                            <div className='character-name-container'>
                                <span className="character-name">{c.name}</span>
                                <span className='character-title'>{c.title}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

