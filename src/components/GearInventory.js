import React from 'react';
import '../stylesheets/GearInventory.css';
import '../stylesheets/GearTile.css';

import GearTile from '../components/GearTile';
import SearchInput from './SearchInput';

export default function GearInventory({ inventory, onSearchTermChanged, toggleEquipped }) {
  return (
    <div className='inventory-container'>
      <SearchInput onChange={onSearchTermChanged} />

      <div className="gear-inventory">
        {inventory.length 
          ? inventory.map((gear, i) => (<GearTile key={i} gear={gear} toggleEquipped={() => toggleEquipped(gear)} />))
          : <h1>No Results</h1>
        }
      </div>
    </div>
  )
}

