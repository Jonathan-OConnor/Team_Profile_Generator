// import statements for classes and Node Modules
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// functions to find output directory
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

//import render function
const render = require("./lib/htmlRenderer");

//global variable
const teamList =[]

// main function to prompt user and build the team list
async function run() {
    // get the number of employees on the team
    let initial = await inquirer.prompt([
        {
            type: `input`,
            message: "How many employees are on your team?",
            name: 'amount'
        }
    ])
    var teamSize = parseInt(initial.amount)
    // check that the user passed in an integer for the size of the team
    if (Number.isInteger(teamSize) === true) {
        // ask the user questions for each team member
        for (let i = 0; i < initial.amount; i++) {
            // ask employee name seperatley so future prompts are personalized
            let personName = await inquirer.prompt([
                {
                    type: `input`,
                    message: `What is Employee #${i + 1}'s name?`,
                    name: `name`
                }
            ])
            // prompt user with questions which apply to all employees
            let personInfo = await inquirer.prompt([
                {
                    type: `list`,
                    message: `What role does ${personName.name} have?`,
                    choices: ['Manager', `Engineer`, `Intern`],
                    name: `role`
                },
                {
                    type: `input`,
                    message: `What is ${personName.name}'s ID?`,
                    name: `id`
                },
                {
                    type: `input`,
                    message: `What is ${personName.name}'s Email?`,
                    name: `email`
                },
            ])
            // create the correct employee subclass depending on user input
            switch (personInfo.role) {
                case "Manager":
                    // prompt user with manager-specific question
                    let officeData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s office number?`,
                            type: `input`,
                            name: `officeNumber`
                        }
                    ])
                    teamList.push(new Manager(personName.name, personInfo.id, personInfo.email, officeData.officeNumber))
                    break
                case "Engineer":
                    // prompt user with engineer-specific question
                    let githubData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s github username?`,
                            type: `input`,
                            name: `github`
                        }
                    ])
                    teamList.push(new Engineer(personName.name, personInfo.id, personInfo.email, githubData.github))
                    break
                case "Intern":
                    // prompt user with engineer-specific question
                    let schoolData = await inquirer.prompt([
                        {
                            message: `What is ${personName.name}'s school?`,
                            type: `input`,
                            name: `school`
                        }
                    ])
                    teamList.push(new Intern(personName.name, personInfo.id, personInfo.email, schoolData.school))
                    break
            }
        }
    } else {
        console.log("Please enter an integer")
        run()
    }
}

async function build(){
    await run()
    let htmlFile = render(teamList)
    fs.writeFileSync(outputPath, htmlFile)
}


build()

