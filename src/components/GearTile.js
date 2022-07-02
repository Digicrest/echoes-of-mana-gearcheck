import { Rating } from '@mui/material';
import React, { useEffect } from 'react'

import stat_types from '../assets/json/stat-types.json';
import FeatherIcon from '../assets/images/feather-icon.png';

export default function GearTile({ gear, toggleEquipped }) {
    useEffect(() => {
        if (!gear) { return; }
    }, [])
  
    if (gear.stats.map(stat => stat.stat).includes(undefined)) {
        console.log(gear);
    };

    return (
        <div className='gear-tile' data-set-bonus={gear.set.bonus.stat} onClick={toggleEquipped}>
            <div className='name-container'>
                <img src={FeatherIcon} />
                <p className='name'>
                    {gear.set.name} {gear.slot}
                </p>
            </div>

            <div className='gear'>
                <StatGroup title={'Main Stat'} stats={gear.stats.slice(0, 1)} />
                <StatGroup title={'Bonus Stats'} stats={gear.stats.slice(1)} />
                <p className='gear-score'>{gear.score.toFixed(2)}</p>
                <Rating value={gear.rarity} readOnly size='small' className='rarity'/>
                {/* <SetBonus set={gear.set} /> */}
            </div>
        </div>
    )
}

function StatGroup({ title, stats }) {
    return (
        <div className="stat-group">
            <p className="title">{title}</p>
            <div className='stats'>
                {stats.map((stat, i) => (
                    <Stat key={i} stat={stat} />
                ))}
            </div>
        </div>
    )
}

function Stat({ stat }) {
    let amountString = stat.amount;

    if (stat.type === stat_types.PERCENT) {
        amountString += '%';
    };

    return (
        <p className="stat">
            +{amountString} {stat.stat.name}
        </p>
    )
}

function SetBonus({ set }) {
    let amountString = set.bonus.amount;

    if (set.bonus.type === stat_types.PERCENT) {
        amountString += '%';
    };

    return (
        <div className="set-bonus">
            <p className="title">{set.name} Set Effects ({set.bonus.pieces_required})</p>
            <p className="effect">[{set.bonus.applies_to}] {amountString} {set.bonus.stat}</p>
        </div>
    )
}