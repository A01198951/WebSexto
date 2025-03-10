import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

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
  styleUrls: ['./informes.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class InformesComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  displayedPokemons: Pokemon[] = [];
  nextPage: string | null = null;
  previousPage: string | null = null;
  loading: boolean = false;
  totalCount: number = 0;
  currentIndex: number = 0;
  pageSize: number = 5;
  searchTerm: string = '';
  
  constructor() { }

  ngOnInit(): void {
    this.fetchPokemonList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
  }

  fetchPokemonList(url: string): void {
    this.loading = true;
    this.allPokemons = []; // Clear current list
    this.displayedPokemons = [];
    this.currentIndex = 0;
    
    fetch(url)
      .then(response => response.json())
      .then((data: PokemonListResponse) => {
        this.nextPage = data.next;
        this.previousPage = data.previous;
        this.totalCount = data.count;
        
        // Fetch each Pokémon's details
        const pokemonPromises = data.results.map(pokemon => 
          fetch(pokemon.url).then(res => res.json())
        );
        
        return Promise.all(pokemonPromises);
      })
      .then(pokemonDetails => {
        this.allPokemons = pokemonDetails;
        this.updateDisplayedPokemons();
        this.loading = false;
      })
      .catch(error => {
        console.error('Error fetching Pokemon list:', error);
        this.loading = false;
      });
  }

  updateDisplayedPokemons(): void {
    if (this.searchTerm) {
      this.searchPokemon();
    } else {
      const startIndex = this.currentIndex;
      const endIndex = Math.min(startIndex + this.pageSize, this.allPokemons.length);
      this.displayedPokemons = this.allPokemons.slice(startIndex, endIndex);
    }
  }

  searchPokemon(): void {
    if (!this.searchTerm.trim()) {
      this.updateDisplayedPokemons();
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    
    // First try to search in current loaded Pokémon
    const filteredPokemons = this.allPokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term)
    );
    
    if (filteredPokemons.length > 0) {
      this.displayedPokemons = filteredPokemons;
    } else {
      // If not found, try to fetch the specific Pokémon
      this.loading = true;
      fetch(`https://pokeapi.co/api/v2/pokemon/${term}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Pokémon no encontrado');
          }
          return response.json();
        })
        .then(data => {
          this.displayedPokemons = [data];
          this.loading = false;
        })
        .catch(error => {
          console.error('Error searching Pokemon:', error);
          this.displayedPokemons = [];
          this.loading = false;
          alert('Pokémon no encontrado. Intenta con otro nombre.');
        });
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.updateDisplayedPokemons();
  }

  getAbilityNames(abilities: any[]): string {
    return abilities.map(ability => ability.ability.name).join(', ');
  }
  
  loadNextPage(): void {
    if (this.nextPage) {
      this.fetchPokemonList(this.nextPage);
    }
  }
  
  loadPreviousPage(): void {
    if (this.previousPage) {
      this.fetchPokemonList(this.previousPage);
    }
  }

  showNext5(): void {
    if (this.currentIndex + this.pageSize < this.allPokemons.length) {
      this.currentIndex += this.pageSize;
      this.updateDisplayedPokemons();
    } else if (this.nextPage) {
      this.loadNextPage();
    }
  }

  showPrevious5(): void {
    if (this.currentIndex - this.pageSize >= 0) {
      this.currentIndex -= this.pageSize;
      this.updateDisplayedPokemons();
    } else if (this.previousPage) {
      this.loadPreviousPage();
    }
  }

  get currentPageInfo(): string {
    const start = this.currentIndex + 1;
    const end = Math.min(this.currentIndex + this.pageSize, this.allPokemons.length);
    return `Showing ${start}-${end} of ${this.totalCount} Pokémon`;
  }
}