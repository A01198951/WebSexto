import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  pokemons: Pokemon[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.fetchPokemonData('lucario');
    this.fetchPokemonData('pikachu');
    this.fetchPokemonData('charmander');
  }

  fetchPokemonData(pokemonName: string): void {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => response.json())
      .then(data => {
        this.pokemons.push(data);
      })
      .catch(error => {
        console.error(`Error fetching Pokemon ${pokemonName}:`, error);
      });
  }

  getAbilityNames(abilities: any[]): string {
    return abilities.map(ability => ability.ability.name).join(', ');
  }
}