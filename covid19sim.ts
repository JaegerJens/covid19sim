// execute: deno run ./covid19sim.ts

console.log('Simulate Covid19');

const parameter = {
    infected: 309897,  // 7 day incident
    vaccinated: 56500000, // complete vaccinated
    population: 83240000, // Germany population
    r0: 6,  // covid 19 delta variant R0
    vaccinationPrevention: 14, // infection prevention by vaccination
};


class Infected {
    private readonly contagionTime = 10; // Covid19 is 10 days contagios
    private history: number[] = [];
    private currentDay = 0;

    constructor(currently: number) {
        const infectedPerDay = Math.floor(currently/this.contagionTime);
        for(let day=0; day<this.contagionTime; day++) {
            this.history[day] = infectedPerDay;
        }
    }

    get total(): number {
        return this.history.reduce((prev, cur) => cur + prev, 0);
    }

    /**
     * Move to the next day
     * 
     * @param newInfections count of new infections
     * @returns number of recovered
     */
    nextDay(newInfections: number): number {
        const nextDay = (this.currentDay + 1) % this.contagionTime;
        const recovered = this.history[nextDay];
        this.history[nextDay] = newInfections;
        return recovered;
    }
}

const infected = new Infected(parameter.infected);