// execute: deno run ./covid19sim.ts

console.log('Simulate Covid19');

const parameter = {
    infected: 309897,  // 7 day incident
    vaccinated: 56500000, // complete vaccinated
    population: 83240000, // Germany population
    r0: 6,  // covid 19 delta variant R0
    vaccinationPrevention: 14, // infection prevention by vaccination
    incubationPeriod: 10, // 10 days incubation period for Covid 19
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

function calcNewInfections(currentlyInfected: number, vaccinated: number, unvaccinated: number): number {
    const spreadVaccinated = currentlyInfected * parameter.r0 / parameter.vaccinationPrevention / parameter.incubationPeriod;
    const spreadUnvaccinated = currentlyInfected * parameter.r0 / parameter.incubationPeriod;
    return Math.floor(spreadVaccinated + spreadUnvaccinated);
}

const infected = new Infected(parameter.infected);

const currentState = {
    time: 0,
    infected: infected.total,
    vaccinated: parameter.vaccinated,
}

while (currentState.time < 365 && currentState.infected < parameter.population && currentState.infected > 0) {
    const unvaccinated = parameter.population - parameter.vaccinated;
    const infections = calcNewInfections(currentState.infected, currentState.vaccinated, unvaccinated);
    console.log(`${currentState.time}: ${currentState.infected} + ${infections}`);
    const totalInfections = infected.nextDay(infections);
    currentState.infected = totalInfections;
    currentState.time++;
}
