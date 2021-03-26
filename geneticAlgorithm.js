
//defining function for formula or usually called fitness
function formula(x, y) {
    return (x*x) * Math.sin(Math.sin(y*y)) + (x+y);
}

//generating the population for datas
function generatePopulation(populationSize, chromosomeSize) {
    let population = [];

    for (let j = 0; j < populationSize; j++) {
        let chromosome = [];

        for (let i = 0; i < chromosomeSize; i++) {

            let randomNumb = Math.floor(Math.random() * 2);
            chromosome.push(randomNumb);

        };

        population.push(chromosome);
    };

    return population;

}


//decode function
function decode(chromosome, chromosomeSize) {

    //from gdocs
    let xMax = 2;
    let xMin = -1;
    let yMax = 1;
    let yMin = -1;

    //variable
    let x = 0.0;
    let y = 0.0;

    let sigma = 0.0;
    let iterationX = 0.0;
    let iterationY = 0.0;
    let N = chromosomeSize/2;
    let power = -1;

    //sigma
    for (let i=1; i<=N; i++) {

        sigma += Math.pow(2, power);

        power--
    }

    //iteration x after sigma
    power = -1;

    for (let i=0; i<N; i++) {
    
        iterationX = iterationX + (Math.pow(2, power) * chromosome[i]);
    
        power--
    
    }

    //iteration y after sigma
    power = -1

    for (let i=0; i<N; i++) {
    
        iterationY = iterationY + (Math.pow(2, power) * chromosome[i+3]);
    
        power--
    
    }

    x = xMin + ((xMax - xMin) / sigma) * iterationX;
    y = yMin + ((yMax - yMin) / sigma) * iterationY;

    return [x, y];
}

//generate the population
let population = generatePopulation(20, 6);

//find the best and second best from chromosome
let bestChromosome = tournamentSelection(population, 6);

//parent selection
//(k = how manny time; populationI = iteration for population array)
function tournamentSelection(population, k) {
    //generate population
    
    let p = 0;
    let best = [];
    let secondBest = [];

    for (let i = 1; i <= k; i++) {
        
        let individu = population[p];

        let a = decode(individu, population[p].length);
        let b = decode(best, population[p].length);
        let c = decode(secondBest, population[p].length);

        if ((best.length === 0 || (formula(a[0], a[1]) > formula(b[0], b[1])))) {
            secondBest = best;
            best = individu;
        }  else if ((formula(b[0], b[1]) > formula(a[0], a[1])) && (formula(a[0], a[1]) > formula(c[0], c[1]))) {
            secondBest = individu;
        }

        p++

    }

    return [best, secondBest];
}

//crossing between two parent from best and second best in paren selection
function crossover(best, secondBest, crossoverRate) {

    let offSpringFirst = [];
    let offSpringSecond = [];

    let random = Math.floor(Math.random() * Math.floor(100));

    if (random < crossoverRate) {

        let randomPoint = Math.random() * (best.length - 1) + 1;

        offSpringFirst = offSpringFirst.concat(secondBest.slice(0, randomPoint));
        offSpringFirst = offSpringFirst.concat(best.slice(randomPoint, best.length));
        offSpringSecond = offSpringSecond.concat(best.slice(0, randomPoint));
        offSpringSecond = offSpringSecond.concat(secondBest.slice(randomPoint, best.length));

        return [offSpringFirst, offSpringSecond, true];

    } else {

        return [best, secondBest, false];

    }

}


//stimulate the effect of error
function mutation(offSpring) {

    
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < offSpring[i].length; j++) {

            if (Math.floor(Math.random() * Math.floor(100)) < 2) {

                if (offSpring[i][j] === 0) {
                    offSpring[i][j] = 1;
                } else {
                    offSpring[i][j] = 0;
                }
            }
    
        } 
    }

    return [offSpring[0], offSpring[1]];

}

//main function and generational function
function mainGeneration(gen) {

    console.log();
    console.log("................................................")

    console.log("Population");
    console.log(gen + 1, "generation");
    console.log();
    console.log(population);
    console.log();
    console.log("First iteration Best =", bestChromosome[0]);
    console.log("First iteration Second Best =", bestChromosome[1]);
    console.log();
    console.log("_______________________________________________");

    let newPopulation = [];
    
    
    for (let i=0; i < population.length; i++) {
        let formula1 = decode(population[i], population[i].length);
        let offSpring = crossover(bestChromosome[0], bestChromosome[1], 80);
        let finalOffSpring = mutation(offSpring);

        newPopulation.push(finalOffSpring[0]);

        let x = formula1[0];
        let y = formula1[1];
        
        console.log("The", i+1, "chromosome: ", population[i]);
        console.log("x =", x, " y =", y);
        console.log();
        console.log("fitness", formula(x, y));
        
        
        console.log();
        console.log("Crossover:");
        
        if (offSpring[2]) {
            console.log("First Offspring: ", offSpring[0])
            console.log("Second Offspring: ", offSpring[1])
        } else {
            console.log("This chromosome hasnt changed yet")
        }
        
        console.log();
        console.log("Mutation result:", finalOffSpring);

        console.log();
        console.log("-----------------------------------------------");
    }

    population = newPopulation;

    console.log("The new population:");
    console.log(population);
    console.log();

    let elitePopulation = population;
    
    elitePopulation.push(bestChromosome[0]);
    elitePopulation.push(bestChromosome[1]);

    console.log("New population with elitism");
    console.log(elitePopulation);

    return population;
}

function main() {
    let generationSize = 10;

    for (let i = 0; i < generationSize; i++) {
        let population = mainGeneration(i);

    }
    
    let finalBest = tournamentSelection(population, 6)[0];
    let finalDecode = decode(finalBest, finalBest.length);
    let finalFitness = formula(finalDecode[0], finalDecode[1]);
    

    console.log();
    console.log("Final Best:", finalBest);
    console.log("x =", finalDecode[0], "y =", finalDecode[1]);
    console.log("Final fitness value:", finalFitness);
    console.log("Maksimum value:", finalFitness);

}

main();
