import DnDCharacter from '@/lib/DnDCharacter';
import { shortRest, longRest } from '@/lib/helperFucntions/charecterFunctions';
import React from 'react';

interface ExtraBoxProps {
    character: DnDCharacter;
    updateCharacter: (field: string, value: any) => void;
}

export function ExtraBox({ character, updateCharacter }: ExtraBoxProps) {
    return (
        <div className='flex flex-col justify-between h-full'>
            <div>
                <h2>{ character.name }</h2>
                <p>Hit Points: { character.hp }</p>
            </div>
            <button className='btn btn-primary'
                onClick={ () => performlongRest(character) }>Long Rest</button>
            <button className='btn btn-secondary'
                onClick={ () => performShortRest(character) }>Short Rest</button>
        </div>
    );

    function performlongRest(character: DnDCharacter) {
        longRest(character);
        updateCharacter("this", character);
    }

    function performShortRest(character: DnDCharacter) {
        shortRest(character);
        updateCharacter("this", character);
    }
}



