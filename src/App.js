import './App.css';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

import BackgroundImage from './assets/images/eom-background.webp';

import characters from './assets/json/characters.json';
import stats from './assets/json/stats.json';
import stat_types from './assets/json/stat-types.json';
import gear_sets from './assets/json/gear-sets.json';
import gear_slots from './assets/json/gear-slots.json';

import CharacterSelect from './components/CharacterSelect';
import CharacterPanel from './components/CharacterPanel';
import GearInventory from './components/GearInventory';
import GearSuggestion from './components/GearSuggestion';
import cloneDeep from 'lodash.clonedeep';

const inventory = [
  {
    set: gear_sets.Maple,
    slot: gear_slots.Accessory.RING,
    rarity: 5,
    level: 16,
    stats: [
      { stat: stats.STR, amount: 8, type: stat_types.PERCENT },
      { stat: stats.CON, amount: 7.1, type: stat_types.PERCENT },
      { stat: stats.STR, amount: 4.3, type: stat_types.PERCENT },
      { stat: stats.INT, amount: 3.9, type: stat_types.PERCENT },
      { stat: stats.HP, amount: 7.7, type: stat_types.PERCENT }
    ]
  },
  {
    set: gear_sets.Maple,
    slot: gear_slots.Accessory.BOOTS,
    rarity: 5,
    level: 16,
    stats: [
      { stat: stats.LCK, amount: 88, type: stat_types.FLAT },
      { stat: stats.SPR, amount: 40, type: stat_types.FLAT },
      { stat: stats.INT, amount: 4.5, type: stat_types.PERCENT },
      { stat: stats.HP, amount: 108, type: stat_types.FLAT },
      { stat: stats.LCK, amount: 20, type: stat_types.FLAT }
    ]
  },
  {
    set: gear_sets.Ivory,
    slot: gear_slots.Accessory.NECKLACE,
    rarity: 5,
    level: 16,
    stats: [
      { stat: stats.STR, amount: 8, type: stat_types.PERCENT },
      { stat: stats.SPR, amount: 3.8, type: stat_types.PERCENT },
      { stat: stats.INT, amount: 4, type: stat_types.PERCENT },
      { stat: stats.MP, amount: 17, type: stat_types.FLAT },
      { stat: stats.HP, amount: 151, type: stat_types.FLAT },
    ]
  },
  {
    set: gear_sets.Ivory,
    slot: gear_slots.Accessory.RING,
    rarity: 5,
    level: 16,
    stats: [
      { stat: stats.HP, amount: 219, type: stat_types.FLAT },
      { stat: stats.CON, amount: 16.4, type: stat_types.PERCENT },
      { stat: stats.CON, amount: 20, type: stat_types.FLAT },
      { stat: stats.STR, amount: 27, type: stat_types.FLAT },
      { stat: stats.HP, amount: 3.4, type: stat_types.PERCENT },
    ]
  }
];

function App() {
  const [character, setCharacter] = useState(characters[3]);
  const [characterLevel, setCharacterLevel] = useState(100);
  const [appliedStats, setAppliedStats] = useState(characters[3].stats.max);

  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [weightedInventory, setWeightedInventory] = useState(inventory.map(i => ({ ...i, score: 0 })));
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');

  const [weights, setWeights] = useState({ hp: .5, mp: .5, str: .5, con: .5, int: .5, spr: .5, lck: .5 });
  const [suggestedGear, setSuggestedGear] = useState();

  useEffect(() => {
    updateGearScores(); 
  }, [weights, appliedStats]);

  useEffect(() => { 
    let appliedStats = {};
    if (characterLevel === 100) {
      appliedStats = cloneDeep(character.stats.max);
    } else {
      // FIXME: Linear Scaling Unlikely to be correct, probably some sort of calculation
      Object.keys(character.stats.max).forEach(key => {
        const min = character.stats.base[key];
        const max = character.stats.max[key];
  
        const applied = ((max - min) / 99 * (characterLevel-1)) + min;
        appliedStats[key] = Math.round(applied);
      });
    }

    setAppliedStats(appliedStats);
  }, [characterLevel]);

  useEffect(() => {
    if (inventorySearchTerm) {
      setFilteredInventory(
        filterInventoryByName(inventorySearchTerm, weightedInventory)
      );
    } else {
      setFilteredInventory(weightedInventory);
    }
  }, [inventorySearchTerm]) 

  function switchCharacter(character) {
    setCharacter(character)
  }

  function filterCharactersByName(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const results = characters.filter(character => {
      return character.name.toLowerCase().includes(searchTerm) || character.title.toLowerCase().includes(searchTerm);
    });
    setFilteredCharacters(results);
  }

  function filterInventoryByName(searchTerm, inventory) {
    return inventory.filter(item => {
      const termInSetName = item.set.name.toLowerCase().includes(searchTerm);
      const termInStatName = item.stats.filter(stat => stat.stat.name.toLowerCase().includes(searchTerm)).length > 0;
      const termInStatDescription = item.stats.filter(stat => stat.stat.effect.toLowerCase().includes(searchTerm)).length > 0;
      const termIsItemType = item.slot.toLowerCase().includes(searchTerm);

      return termInSetName || termInStatName || termInStatDescription || termIsItemType;
    });
  }

  function toggleInventory() {
    setInventoryOpen(!inventoryOpen)
  }

  function updateGearScores() {
    if (!character) {
      return;
    };

    const scoredInventory = inventory.map(gear => {

      const gearScore = gear.stats.reduce((acc, stat) => {
        const statKey = stat.stat.name.toLowerCase();
        const statWeight = weights[statKey];
        let statValue = stat.amount;

        if (stat.type === "Percentage") {
            statValue = appliedStats[statKey] / 100 * stat.amount;
        };
        // console.log(`[${statKey.toUpperCase()}](+${stat.amount}${stat.type !== 'Flat' ? '%' : ''}) has a weighted value of (${(statValue * statWeight)}) with weight: ${statWeight}`);
        return acc + (statValue * statWeight);
      }, 0);
      return { ...gear, score: gearScore };
    });
    console.log('updateGearScores: ', scoredInventory);
    setWeightedInventory(scoredInventory);
  }

  return (
    <div className="App">
      <img src={BackgroundImage} className="background-image" />
      <CharacterSelect 
        character={character}
        characters={filteredCharacters} 
        onCharacterSelected={switchCharacter}
        onSearchTermChanged={filterCharactersByName}
      
      />

      <main>
        <CharacterPanel 
          character={character}
          appliedStats={appliedStats}
          weights={weights} 
          onWeightsAdjusted={setWeights} 
          level={characterLevel}
          onLevelChanged={newLevel => {
            setCharacterLevel(newLevel)
          }}
        />
        <div className='content-container'>
          <div className='content'>
            { inventoryOpen 
              ? <GearInventory 
                  character={character}
                  inventory={weightedInventory.sort((item1, item2) => {
                    return item1.score < item2.score ? 1 : -1;
                  })} 
                  onSearchTermChanged={e => {
                    setInventorySearchTerm(e.target.value.toLowerCase().trim());
                  }} 
                  weights={weights}
                />
              : <GearSuggestion suggestedGear={suggestedGear} />
            }
          </div>
          
          <Button onClick={toggleInventory}>{inventoryOpen ? 'Close' : 'Open'} Inventory</Button>
        </div>
      </main>
    </div>
  );
}

export default App;
