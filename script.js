var day = 1;
var daysOfSimulation = 20;

var initiallyInfected = 5;

var population = 10000;
var canBeInfected;
var currentlyInfected = [];


var mortalityRate = 5; //in percentage per day once incubation period ends
var rNumber = 5; //infected per day


var daysBeforeHealthy = 10;
var daysBeforeLethal = 5; // days before the infected person has a chance of dying


var immunePeople = 0;
var deadPeople = 0;
var todaysDead = 0;

var info;


var dayElement;
var popElement;
var infectedElement;
var deadElement;
var deadTodayElement;
var immuneElement;
var notyetinfectedElement;
var totalElement;



function init()
{
    info = dayElement = document.getElementById("info");

    dayElement = document.getElementById("day");
    popElement = document.getElementById("pop");
    infectedElement = document.getElementById("infected");
    deadElement = document.getElementById("dead");
    deadTodayElement = document.getElementById("deadToday");
    immuneElement = document.getElementById("immune");
    notyetinfectedElement = document.getElementById("notyetinfected");
    totalElement = document.getElementById("total");

    // Sets the number of people available for infection
    canBeInfected = population;
    //Sets the first index of the array holding our infected to the initial number of infected persons
    currentlyInfected[0] = initiallyInfected;

    // Initializes the array holding our infected by making sure we have as many indexes as the days it takes for the infection to run its course
    for (i = 1; i < daysBeforeHealthy; i++)
    {
        currentlyInfected.push(0);
    }

    // Sets the text on the web page
    info.innerHTML  = "Population: " + population + "<p></p>"
                    + "R-Number: " + rNumber + " (infected per day, not duration of sickness) <p></p>"
                    + "Mortality Rate: " + mortalityRate  + "%<p></p>"
                    + "Incubation period before disease is deadly: " + daysBeforeLethal + "<p></p>";

    Simulate();
}





// var newDay = new Day(population, initiallyInfected, 0, 0, population)
function Simulate()
{
    for (d = 1; d <= daysOfSimulation; d++)
    {
        updatePage();
        //logData();
        //logTestData()

        nextDay();
        
        infectNewPeople();

        checkIfPeopleDied();
        day++;
    }
}





function nextDay()
{  
    // Adds everyone who lived through the entire infeciton cycle to immune
    immunePeople += currentlyInfected[currentlyInfected.length-1];

    // Loops through all the people at each stage of the infection cycle and moves them up one day
    for (i = currentlyInfected.length-1; i > 0; i--)
    {
        currentlyInfected[i] = currentlyInfected[i-1];
              
    }

    //Clears out the first index of the array since those people have now been added to the second index.    
    currentlyInfected[0] = 0;  
}





function infectNewPeople()
{
    // How many people are capable of being infected
    canBeInfected = Math.max((population - immunePeople - getTotalInfected()),0);

    // Gets the lowest number out of how many got infected and how many people are left who can be infected
    let newInfectedPeople = Math.min((getTotalInfected() * rNumber), canBeInfected);

    // adds the newly infected people into the first index of the array
    currentlyInfected[0] = Math.floor(newInfectedPeople);
}
 





function checkIfPeopleDied()
{
    // Resets todays dead
    todaysDead = 0;
    
    for (i = daysBeforeLethal-1; i < currentlyInfected.length; i++)
    {
        // Get number of people infected at each stage of infection
        let peopleAtDay = currentlyInfected[i];

        // Check how many died per iteration
        let deadPeopleAtDay = peopleAtDay * (mortalityRate / 100);

        // Floor the number. A person is either dead or alive, not 50% dead.
        deadPeopleAtDay = Math.floor(deadPeopleAtDay);  
        
        // Add this iterations dead to total dead
        deadPeople += deadPeopleAtDay;

        // Lower the population by dead people from current iteration
        population -= deadPeopleAtDay;
        if (population < 0)
            population = 0;

        // Feed the people surviving back into the array
        currentlyInfected[i] = peopleAtDay - deadPeopleAtDay;
    }

}




// Loops through the entire array holding all the infected and returns the total
function getTotalInfected()
{
    let infectedCount = 0;

    for (i = 0; i < currentlyInfected.length; i++)
    {
        infectedCount += currentlyInfected[i];
    }

    return infectedCount;
}




// Loops through the entire array holding all the infected and returns the number of people
// at and after the incubation period ended
function getFullyIncubated()
{
    let infectedCount = 0;

    for (i = daysBeforeLethal-1; i < currentlyInfected.length; i++)
    {
        infectedCount += currentlyInfected[i];
    }

    return infectedCount;
}







function logData() // Console
{
    let total = deadPeople + population;
    console.log("Day: " + day);
    console.log("Population: " + population);
    console.log("Infected: " + getTotalInfected());
    console.log("Dead: " + deadPeople);
    onsole.log("Dead Today: ");
    console.log("Immune:" + immunePeople);
    console.log("Not Yet Infected:" + canBeInfected);
    console.log("-----------");
    console.log("Total population including dead: " + total);
    console.log("___________");
}

function updatePage() // HTML Page
{
    let total = deadPeople + population;

    dayElement.innerHTML += "<p></p>" + day;
    popElement.innerHTML += "<p></p>" + population;
    infectedElement.innerHTML += "<p></p>" + getTotalInfected();
    deadElement.innerHTML += "<p></p>" + deadPeople;
    deadTodayElement.innerHTML += "<p></p>" + todaysDead;
    immuneElement.innerHTML += "<p></p>" + immunePeople;
    notyetinfectedElement.innerHTML += "<p></p>" + canBeInfected;
    totalElement.innerHTML += "<p></p>" + total;
}