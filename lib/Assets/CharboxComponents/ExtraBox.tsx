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
            <div className='text-4xl flex justify-between'>
                <h2>{ character.name }</h2>
                <p>Hit Points: { character.hp }</p>
            </div>
            <span className='grow flex flex-col'>
                <button className='btn btn-primary grow mb-2'
                    onClick={ () => performlongRest(character) }>Long Rest
                </button>
                <button className='btn btn-secondary grow'
                    onClick={ () => performShortRest(character) }>Short Rest
                </button>
            </span>
        </div>
    );

    function performlongRest(character: DnDCharacter) {
        let response = window.confirm('Are you sure you want to perform a long rest?');
        if (response) {
            longRest(character);
            updateCharacter("this", character);
        }
    }

    function performShortRest(character: DnDCharacter) {
        let response = window.confirm('Are you sure you want to perform a short rest?');
        if (response) {
            shortRest(character);
            updateCharacter("this", character);
        }
    }
}



