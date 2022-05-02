import React from 'react';
import '../stylesheets/GearSuggestion.css';

export default function GearSuggestion({ suggestedGear }) {
    if (!suggestedGear) {
        return (
            <div>
                <p>No Suggestions Yet</p>
            </div>
        );
    }
    console.log(suggestedGear);
    const { primary, accessory } = suggestedGear;

    return (
        <div className="gear-suggestion">
            
        </div>
    )
}


function SetOfGear(setOfGear) {
    <div className='gear-set'>
        
    </div>
}