import React, { useState, useEffect } from 'react';
import '../stylesheets/CharacterPanel.css';

import CharacterImages from '../assets/images/characters/CharacterImages';
import { Slider } from '@mui/material';

export default function CharacterPanel({ character, onWeightsAdjusted, weights, level, onLevelChanged, appliedStats }) {
    if (!character) { return; }

    return (
        <div className="character-panel">
            <CharacterPortrait character={character} />
            <LevelSelect level={level} onLevelChanged={onLevelChanged} />
            <Stats 
                stats={appliedStats} 
                characterName={character.name} 
                weights={weights}
                onWeightsChanged={onWeightsAdjusted} 
            />
        </div>
    )
}

function CharacterPortrait({ character }) {
    const [images, setImages] = useState();

    useEffect(() => {
        if (character) {
            const imageKey = character.name.toLowerCase();
    
            if (CharacterImages.hasOwnProperty(imageKey)) {
                setImages(CharacterImages[imageKey]);
            } else {
                setImages(null);
                console.warn(`unable to find ${imageKey} in: `, CharacterImages);
            }
        }
    }, [character])

    return (
        <div className='portrait-container'>
            { images 
                ? <img className="portrait" src={images.portrait} />
                : <img className="portrait silhouette" src={CharacterImages.sumo.portrait} />
            }
        </div>  
    )
}

function LevelSelect({ level, onLevelChanged }) {
    console.log('level select: ', level);

    return (
        <div className='character-level-select'>
            <p>Level ({level})</p>
            <Slider
                aria-label="Character Level"
                defaultValue={100}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={100}
                onChange={(e) => onLevelChanged(e.target.value)}
            />
        </div>  
    )
}

function Stats({ stats, characterName, onWeightsChanged, weights }) {
    const [statWeights, setStatWeights] = useState(weights);
    
    useEffect(() => {
        onWeightsChanged(statWeights);
    }, [statWeights])
    
    return (
        <div className='stats-container'>
            <p className="character-name">{ characterName }</p>

            <div className='stats'>
                {Object.keys(stats).map(stat => (
                    <div key={stat} className="stat">
                        <div>
                            <label>{stat.toUpperCase()}</label>
                            <span>{stats[stat]}</span>
                        </div>
                        <Slider
                            aria-label="Weighting"
                            defaultValue={.5}
                            valueLabelDisplay="auto"
                            step={.1}
                            min={0}
                            max={1}
                            onChange={(e) => setStatWeights({
                                ...statWeights,
                                [stat]: e.target.value
                            })}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
